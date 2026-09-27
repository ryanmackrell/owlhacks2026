// =========================================================
// AQUAGUESSR - MAP.JS
// =========================================================


// =========================================================
// LOAD TURF.JS
// =========================================================

const turfReady = new Promise(function (resolve, reject) {

    if (window.turf) {
        resolve();
        return;
    }

    const script = document.createElement("script");

    script.src =
        "https://cdn.jsdelivr.net/npm/@turf/turf@7/turf.min.js";

    script.onload = function () {
        console.log("Turf loaded.");
        resolve();
    };

    script.onerror = function () {
        reject(new Error("Could not load Turf.js"));
    };

    document.head.appendChild(script);
});


// =========================================================
// CREATE MAP
// =========================================================

const worldBounds = L.latLngBounds(
    L.latLng(-85, -180),
    L.latLng(85, 180)
);

const map = L.map("map", {
    maxBounds: worldBounds,
    maxBoundsViscosity: 1.0,

    minZoom: 2,
    maxZoom: 10,

    worldCopyJump: false

}).setView([15, 0], 2);


// =========================================================
// MAP TILES
// =========================================================

L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    {
        attribution: "Tiles &copy; Esri",
        noWrap: false,
        maxZoom: 18
    }
).addTo(map);


// =========================================================
// MAP MOVEMENT
// =========================================================

function updateDragging() {

    if (map.getZoom() === map.getMinZoom()) {
        map.dragging.disable();
    }
    else {
        map.dragging.enable();
    }
}

updateDragging();

map.on("zoomend", updateDragging);


// =========================================================
// PLAYER GUESS
// =========================================================

let playerGuess = null;
let guessMarker = null;
let guessLocked = false;

map.on("click", function (event) {

    if (guessLocked) {
        return;
    }

    playerGuess = event.latlng;

    if (guessMarker) {
        map.removeLayer(guessMarker);
    }

    guessMarker = L.marker([
        playerGuess.lat,
        playerGuess.lng
    ])
        .addTo(map)
        .bindTooltip("Your Guess", {
            permanent: true,
            direction: "top",
            offset: [-15, -12]
        })
        .openTooltip();
});


// =========================================================
// GUESS FUNCTIONS
// =========================================================

function hasPlayerGuessed() {
    return playerGuess !== null;
}

function getPlayerGuess() {
    return playerGuess;
}

function lockGuess() {
    guessLocked = true;
}

function unlockGuess() {
    guessLocked = false;
}


// =========================================================
// RANGE VARIABLES
// =========================================================

// We keep these names as "current" so scoring.js does not
// need to be changed.
//
// They now represent ALL available OBIS observations.

let currentRangeLayer = null;
let currentRangeGeoJSON = null;


// =========================================================
// LAND MASK
// =========================================================

let landMask = null;
let landReady = null;


/*
    Loads:

        Hackathon/data/land.geojson
*/

function loadLandMask() {

    if (landReady) {
        return landReady;
    }

    landReady = fetch("data/land.geojson")

        .then(function (response) {

            if (!response.ok) {

                throw new Error(
                    "Could not load land.geojson. HTTP " +
                    response.status
                );
            }

            return response.json();
        })

        .then(function (data) {

            landMask = data;

            console.log(
                "Land mask loaded:",
                landMask.features
                    ? landMask.features.length
                    : 0,
                "features"
            );

            return landMask;
        })

        .catch(function (error) {

            console.error(
                "LAND MASK ERROR:",
                error
            );

            landMask = null;

            return null;
        });

    return landReady;
}


// Start loading immediately.
loadLandMask();


// =========================================================
// OBIS SETTINGS
// =========================================================

const OBIS_GRID_PRECISION = 3;


// =========================================================
// RANGE SHAPE SETTINGS
// =========================================================

/*
    These control how OBIS observations are converted
    into the filled distribution areas.
*/

const CLUSTER_DISTANCE_KM = 450;

const HULL_DISTANCE_KM = 800;

const FINAL_BUFFER_KM = 50;

const SMALL_CLUSTER_BUFFER_KM = 70;

const MIN_HULL_POINTS = 3;


// =========================================================
// GET OBIS DATA
// =========================================================

async function getObisGrid(scientificName) {

    /*
        IMPORTANT:

        There is NO date filter anymore.

        This request gets all available OBIS observations
        for the selected species.
    */

    const url =
        "https://api.obis.org/v3/occurrence/grid/" +
        OBIS_GRID_PRECISION +
        "?scientificname=" +
        encodeURIComponent(scientificName);


    console.log(
        "OBIS request:",
        url
    );


    const response =
        await fetch(url);


    if (!response.ok) {

        throw new Error(
            "OBIS request failed: " +
            response.status
        );
    }


    return await response.json();
}


// =========================================================
// CONVERT OBIS CELLS TO POINTS
// =========================================================

function cellsToPoints(data) {

    const points = [];


    if (
        !data ||
        !data.features
    ) {

        return turf.featureCollection([]);
    }


    data.features.forEach(function (feature) {

        if (!feature.geometry) {
            return;
        }


        try {

            const center =
                turf.centroid(feature);


            const longitude =
                center.geometry.coordinates[0];

            const latitude =
                center.geometry.coordinates[1];


            if (
                longitude < -180 ||
                longitude > 180 ||
                latitude < -85 ||
                latitude > 85
            ) {

                return;
            }


            points.push(
                turf.point([
                    longitude,
                    latitude
                ])
            );

        }
        catch (error) {

            console.warn(
                "Skipped invalid OBIS feature."
            );
        }
    });


    return turf.featureCollection(points);
}


// =========================================================
// CLUSTER OBSERVATIONS
// =========================================================

function clusterPoints(points) {

    if (
        !points ||
        !points.features ||
        points.features.length === 0
    ) {

        return [];
    }


    const clustered =
        turf.clustersDbscan(
            points,
            CLUSTER_DISTANCE_KM,
            {
                units: "kilometers",
                minPoints: 2,
                mutate: false
            }
        );


    const groups = {};


    clustered.features.forEach(function (feature) {

        const cluster =
            feature.properties.cluster;


        // Ignore isolated noise points.
        if (
            cluster === undefined ||
            cluster === null
        ) {

            return;
        }


        if (!groups[cluster]) {
            groups[cluster] = [];
        }


        groups[cluster].push(feature);
    });


    return Object.values(groups);
}


// =========================================================
// DETECT DATE-LINE PROBLEMS
// =========================================================

function crossesDateLine(feature) {

    if (
        !feature ||
        !feature.geometry
    ) {

        return false;
    }


    const geometry =
        feature.geometry;


    let rings = [];


    if (geometry.type === "Polygon") {

        rings =
            geometry.coordinates;
    }

    else if (
        geometry.type === "MultiPolygon"
    ) {

        geometry.coordinates.forEach(
            function (polygon) {

                polygon.forEach(
                    function (ring) {

                        rings.push(ring);
                    }
                );
            }
        );
    }

    else {

        return false;
    }


    for (const ring of rings) {

        for (
            let i = 1;
            i < ring.length;
            i++
        ) {

            const previousLongitude =
                ring[i - 1][0];

            const currentLongitude =
                ring[i][0];


            if (
                Math.abs(
                    currentLongitude -
                    previousLongitude
                ) > 180
            ) {

                return true;
            }
        }
    }


    return false;
}


// =========================================================
// BUILD RANGE FROM CLUSTER
// =========================================================

function buildClusterRange(features) {

    if (
        !features ||
        features.length === 0
    ) {

        return null;
    }


    const collection =
        turf.featureCollection(features);


    // =====================================================
    // THREE OR MORE OBSERVATIONS
    // =====================================================

    if (
        features.length >=
        MIN_HULL_POINTS
    ) {

        try {

            // Try a concave hull first.
            let hull =
                turf.concave(
                    collection,
                    {
                        maxEdge:
                            HULL_DISTANCE_KM,

                        units:
                            "kilometers"
                    }
                );


            // Fallback if concave fails.
            if (!hull) {

                hull =
                    turf.convex(collection);
            }


            if (!hull) {
                return null;
            }


            if (
                crossesDateLine(hull)
            ) {

                console.log(
                    "Rejected date-line hull."
                );

                return null;
            }


            let buffered =
                turf.buffer(
                    hull,
                    FINAL_BUFFER_KM,
                    {
                        units:
                            "kilometers",

                        steps: 16
                    }
                );


            if (!buffered) {
                buffered = hull;
            }


            if (
                crossesDateLine(buffered)
            ) {

                console.log(
                    "Rejected buffered date-line polygon."
                );

                return null;
            }


            const simplified =
                turf.simplify(
                    buffered,
                    {
                        tolerance: 0.02,
                        highQuality: true,
                        mutate: false
                    }
                );


            if (
                crossesDateLine(simplified)
            ) {

                return null;
            }


            return simplified;

        }
        catch (error) {

            console.warn(
                "Hull failed:",
                error
            );

            return null;
        }
    }


    // =====================================================
    // TWO OBSERVATIONS
    // =====================================================

    if (features.length === 2) {

        try {

            const first =
                features[0];

            const second =
                features[1];


            const lng1 =
                first.geometry.coordinates[0];

            const lng2 =
                second.geometry.coordinates[0];


            if (
                Math.abs(lng1 - lng2) >
                180
            ) {

                return null;
            }


            const line =
                turf.lineString([
                    first.geometry.coordinates,
                    second.geometry.coordinates
                ]);


            const buffered =
                turf.buffer(
                    line,
                    SMALL_CLUSTER_BUFFER_KM,
                    {
                        units:
                            "kilometers",

                        steps: 16
                    }
                );


            if (
                buffered &&
                !crossesDateLine(buffered)
            ) {

                return buffered;
            }


            return null;

        }
        catch (error) {

            return null;
        }
    }


    // =====================================================
    // ONE OBSERVATION
    // =====================================================

    try {

        const buffered =
            turf.buffer(
                features[0],
                SMALL_CLUSTER_BUFFER_KM,
                {
                    units:
                        "kilometers",

                    steps: 16
                }
            );


        if (
            buffered &&
            !crossesDateLine(buffered)
        ) {

            return buffered;
        }


        return null;

    }
    catch (error) {

        return null;
    }
}


// =========================================================
// BOUNDING BOX OVERLAP
// =========================================================

function boundingBoxesOverlap(
    firstFeature,
    secondFeature
) {

    try {

        const first =
            turf.bbox(firstFeature);

        const second =
            turf.bbox(secondFeature);


        return !(
            first[2] < second[0] ||
            first[0] > second[2] ||
            first[3] < second[1] ||
            first[1] > second[3]
        );

    }
    catch (error) {

        return false;
    }
}


// =========================================================
// REMOVE LAND FROM RANGE
// =========================================================

function removeLandFromPolygon(rangePolygon) {

    if (!rangePolygon) {
        return null;
    }


    // If land failed to load, DON'T pretend clipping
    // succeeded. Return original polygon but warn loudly.
    if (
        !landMask ||
        !landMask.features
    ) {

        console.warn(
            "Land mask unavailable. Range was not clipped."
        );

        return rangePolygon;
    }


    let result =
        rangePolygon;


    let landPiecesChecked = 0;
    let landPiecesSubtracted = 0;


    for (const landFeature of landMask.features) {

        if (!result) {
            break;
        }


        if (
            !landFeature ||
            !landFeature.geometry
        ) {

            continue;
        }


        /*
            Don't run Turf difference against continents
            nowhere near this animal range.
        */

        if (
            !boundingBoxesOverlap(
                result,
                landFeature
            )
        ) {

            continue;
        }


        landPiecesChecked++;


        try {

            /*
                Turf 7 difference takes a FeatureCollection.

                First feature = range
                Second feature = land

                Result = range MINUS land
            */

            const difference =
                turf.difference(
                    turf.featureCollection([
                        result,
                        landFeature
                    ])
                );


            /*
                null means the land polygon completely
                removed this range.
            */

            if (!difference) {

                result = null;
                break;
            }


            result = difference;

            landPiecesSubtracted++;

        }
        catch (error) {

            console.warn(
                "Land subtraction failed:",
                error
            );
        }
    }


    console.log(
        "Land clipping:",
        landPiecesChecked,
        "nearby land features checked,",
        landPiecesSubtracted,
        "subtractions completed."
    );


    return result;
}


// =========================================================
// CREATE COMPLETE DISTRIBUTION
// =========================================================

function createDistribution(data) {

    const points =
        cellsToPoints(data);


    console.log(
        "Usable OBIS cells:",
        points.features.length
    );


    if (
        points.features.length === 0
    ) {

        return null;
    }


    const clusters =
        clusterPoints(points);


    console.log(
        "Geographic clusters:",
        clusters.length
    );


    const polygons = [];


    clusters.forEach(function (cluster) {

        // ---------------------------------------------
        // CREATE ORIGINAL RANGE
        // ---------------------------------------------

        let polygon =
            buildClusterRange(cluster);


        if (!polygon) {
            return;
        }


        // ---------------------------------------------
        // REMOVE ALL LAND
        // ---------------------------------------------

        polygon =
            removeLandFromPolygon(
                polygon
            );


        // Land may completely erase a bad polygon.
        if (!polygon) {

            console.log(
                "Range removed because it was entirely on land."
            );

            return;
        }


        // ---------------------------------------------
        // FINAL DATE-LINE CHECK
        // ---------------------------------------------

        if (
            crossesDateLine(polygon)
        ) {

            console.log(
                "Skipped world-crossing polygon."
            );

            return;
        }


        polygons.push(polygon);
    });


    if (
        polygons.length === 0
    ) {

        console.warn(
            "No valid ocean range polygons created."
        );

        return null;
    }


    /*
        IMPORTANT:

        DO NOT union all clusters globally.

        Keeping them separate prevents distant
        populations from drawing giant lines
        across the planet.
    */

    return turf.featureCollection(
        polygons
    );
}


// =========================================================
// OBSERVED DISTRIBUTION
// =========================================================

async function showCurrentRange(
    scientificName
) {

    await turfReady;

    // Wait for land data before building polygons.
    await loadLandMask();


    if (currentRangeLayer) {

        map.removeLayer(
            currentRangeLayer
        );

        currentRangeLayer =
            null;
    }


    currentRangeGeoJSON =
        null;


    try {

        /*
            No start date or end date is passed here.

            This means ALL available OBIS observations
            for the species are used.
        */

        const data =
            await getObisGrid(
                scientificName
            );


        if (
            !data.features ||
            data.features.length === 0
        ) {

            console.log(
                "No observations:",
                scientificName
            );

            return null;
        }


        const distribution =
            createDistribution(data);


        if (!distribution) {
            return null;
        }


        /*
            Keep using currentRangeGeoJSON internally
            so scoring.js does not have to change.
        */

        currentRangeGeoJSON =
            distribution;


        currentRangeLayer =
            L.geoJSON(
                distribution,
                {
                    style: {

                        color:
                            "#00e5ff",

                        weight: 2,

                        opacity: 0.95,

                        fillColor:
                            "#00e5ff",

                        fillOpacity:
                            0.30,

                        lineJoin:
                            "round",

                        lineCap:
                            "round"
                    }
                }
            )
                .addTo(map);


        currentRangeLayer
            .bringToFront();


        console.log(
            "Observed distribution displayed."
        );


        return currentRangeLayer;

    }
    catch (error) {

        console.error(
            "Observed distribution error:",
            error
        );

        return null;
    }
}


// =========================================================
// SHOW SPECIES DISTRIBUTION
// =========================================================

async function showSpeciesDistribution(
    scientificName
) {

    await turfReady;

    await loadLandMask();


    console.log(
        "Loading species:",
        scientificName
    );


    clearRanges();


    /*
        Only ONE distribution is generated now.

        It contains all available OBIS observations.
    */

    await showCurrentRange(
        scientificName
    );


    console.log(
        "Finished loading:",
        scientificName
    );
}


// =========================================================
// CHECK IF GUESS IS INSIDE OBSERVED DISTRIBUTION
// =========================================================

function isGuessInsideCurrentRange() {

    if (
        !playerGuess ||
        !currentRangeGeoJSON ||
        !window.turf
    ) {

        return false;
    }


    const guessPoint =
        turf.point([
            playerGuess.lng,
            playerGuess.lat
        ]);


    for (
        const feature
        of currentRangeGeoJSON.features
    ) {

        try {

            if (
                turf.booleanPointInPolygon(
                    guessPoint,
                    feature
                )
            ) {

                return true;
            }

        }
        catch (error) {

            console.warn(
                "Could not test polygon."
            );
        }
    }


    return false;
}


// =========================================================
// GET RANGE DATA
// =========================================================

function getCurrentRangeLayer() {
    return currentRangeLayer;
}


function getCurrentRangeGeoJSON() {
    return currentRangeGeoJSON;
}


// =========================================================
// CLEAR RANGES
// =========================================================

function clearRanges() {

    if (currentRangeLayer) {

        map.removeLayer(
            currentRangeLayer
        );

        currentRangeLayer =
            null;
    }


    currentRangeGeoJSON =
        null;
}


// =========================================================
// CLEAR GUESS
// =========================================================

function clearGuess() {

    if (guessMarker) {

        map.removeLayer(
            guessMarker
        );

        guessMarker =
            null;
    }


    playerGuess = null;

    guessLocked = false;
}


// =========================================================
// RESET MAP
// =========================================================

function resetMap() {

    clearGuess();

    clearRanges();


    map.setView(
        [15, 0],
        2
    );


    updateDragging();
}