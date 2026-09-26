// -------------------------
// CREATE MAP
// -------------------------

const worldBounds = L.latLngBounds(
    L.latLng(-85, -180),
    L.latLng(85, 180)
);

const map = L.map("map", {
    maxBounds: worldBounds,
    maxBoundsViscosity: 1.0,
    minZoom: 2,
    maxZoom: 10
}).setView([15, 0], 2);


// -------------------------
// MAP TILES
// -------------------------

L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    {
        attribution: "Tiles &copy; Esri",
        noWrap: true,
        maxZoom: 18
    }
).addTo(map);


// -------------------------
// MAP MOVEMENT
// -------------------------

function updateDragging() {

    if (map.getZoom() === map.getMinZoom()) {
        map.dragging.disable();
    } else {
        map.dragging.enable();
    }
}

updateDragging();

map.on("zoomend", function () {
    updateDragging();
});


// -------------------------
// PLAYER GUESS VARIABLES
// -------------------------

let playerGuess = null;
let guessMarker = null;
let guessLocked = false;


// -------------------------
// DISTRIBUTION VARIABLES
// -------------------------

let currentRangeLayer = null;
let historicalRangeLayer = null;

// Store the actual processed GeoJSON too.
// scoring.js can use this later.
let currentRangeGeoJSON = null;
let historicalRangeGeoJSON = null;


// -------------------------
// OBIS SETTINGS
// -------------------------

// Keep 3 because this is the precision
// we already know works with OBIS.
const OBIS_GRID_PRECISION = 3;

// Historical observations
const HISTORICAL_END_DATE = "2000-12-31";

// Recent observations
const RECENT_START_DATE = "2001-01-01";


// -------------------------
// PLAYER CLICKS MAP
// -------------------------

map.on("click", function (event) {

    // Don't allow guess changes after submit
    if (guessLocked) {
        return;
    }

    playerGuess = event.latlng;


    // Remove previous marker
    if (guessMarker) {
        map.removeLayer(guessMarker);
    }


    // Add marker
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


// -------------------------
// CHECK FOR PLAYER GUESS
// -------------------------

function hasPlayerGuessed() {

    return playerGuess !== null;
}


// -------------------------
// GET PLAYER GUESS
// -------------------------

function getPlayerGuess() {

    return playerGuess;
}


// -------------------------
// LOCK GUESS
// -------------------------

function lockGuess() {

    guessLocked = true;
}


// -------------------------
// UNLOCK GUESS
// -------------------------

function unlockGuess() {

    guessLocked = false;
}


// -------------------------
// GET OBIS GRID DATA
// -------------------------

async function getObisGrid(
    scientificName,
    extraFilter = ""
) {

    const url =
        "https://api.obis.org/v3/occurrence/grid/" +
        OBIS_GRID_PRECISION +
        "?scientificname=" +
        encodeURIComponent(scientificName) +
        extraFilter;


    console.log(
        "Requesting OBIS:",
        url
    );


    const response = await fetch(url);


    if (!response.ok) {

        throw new Error(
            "OBIS request failed: " +
            response.status
        );
    }


    return await response.json();
}


// -------------------------
// MERGE OBIS GRID CELLS
// -------------------------

function mergeObisCells(geojson) {

    if (
        !geojson ||
        !geojson.features ||
        geojson.features.length === 0
    ) {

        return null;
    }


    // Keep only polygon geometry
    const polygons =
        geojson.features.filter(function (feature) {

            if (!feature.geometry) {
                return false;
            }

            return (
                feature.geometry.type === "Polygon" ||
                feature.geometry.type === "MultiPolygon"
            );
        });


    if (polygons.length === 0) {

        return null;
    }


    console.log(
        "Merging",
        polygons.length,
        "OBIS cells..."
    );


    try {

        /*
            Turf union combines touching/
            overlapping polygons.

            Instead of:

            [][][][]
              [][][]

            Leaflet receives larger connected
            geographic shapes.
        */

        const collection =
            turf.featureCollection(polygons);


        const merged =
            turf.union(collection);


        if (!merged) {

            console.warn(
                "Turf could not merge cells."
            );

            return geojson;
        }


        /*
            Simplify removes unnecessary tiny
            corners from the grid boundary.

            This does NOT invent a completely
            different distribution.

            It just cleans the outline.
        */

        const simplified =
            turf.simplify(
                merged,
                {
                    tolerance: 0.05,
                    highQuality: true,
                    mutate: false
                }
            );


        console.log(
            "OBIS cells successfully merged."
        );


        return simplified;

    } catch (error) {

        console.error(
            "Could not merge OBIS cells:",
            error
        );


        // If Turf has a problem, don't break
        // the entire game.

        // Fall back to original OBIS cells.
        return geojson;
    }
}


// -------------------------
// SHOW RECENT OBSERVATIONS
// -------------------------

async function showCurrentRange(
    scientificName
) {

    // Remove previous current layer
    if (currentRangeLayer) {

        map.removeLayer(
            currentRangeLayer
        );

        currentRangeLayer = null;
    }


    currentRangeGeoJSON = null;


    try {

        // Get 2001+ data
        const rawData =
            await getObisGrid(
                scientificName,
                "&startdate=" +
                RECENT_START_DATE
            );


        if (
            !rawData.features ||
            rawData.features.length === 0
        ) {

            console.log(
                "No recent observations for:",
                scientificName
            );

            return null;
        }


        console.log(
            "Recent OBIS cells:",
            rawData.features.length
        );


        // Merge squares
        const mergedData =
            mergeObisCells(rawData);


        if (!mergedData) {

            return null;
        }


        // Save for scoring later
        currentRangeGeoJSON =
            mergedData;


        // Draw resulting distribution
        currentRangeLayer =
            L.geoJSON(
                mergedData,
                {
                    style: {
                        color: "#22c55e",

                        weight: 2,

                        opacity: 0.9,

                        fillColor: "#22c55e",

                        fillOpacity: 0.32,

                        lineJoin: "round",

                        lineCap: "round"
                    }
                }
            ).addTo(map);


        console.log(
            "Recent distribution loaded:",
            scientificName
        );


        return currentRangeLayer;

    } catch (error) {

        console.error(
            "Error loading recent distribution:",
            error
        );

        return null;
    }
}


// -------------------------
// SHOW HISTORICAL OBSERVATIONS
// -------------------------

async function showHistoricalRange(
    scientificName
) {

    // Remove old historical layer
    if (historicalRangeLayer) {

        map.removeLayer(
            historicalRangeLayer
        );

        historicalRangeLayer = null;
    }


    historicalRangeGeoJSON = null;


    try {

        // Get observations through 2000
        const rawData =
            await getObisGrid(
                scientificName,
                "&enddate=" +
                HISTORICAL_END_DATE
            );


        if (
            !rawData.features ||
            rawData.features.length === 0
        ) {

            console.log(
                "No historical observations for:",
                scientificName
            );

            return null;
        }


        console.log(
            "Historical OBIS cells:",
            rawData.features.length
        );


        // Merge squares
        const mergedData =
            mergeObisCells(rawData);


        if (!mergedData) {

            return null;
        }


        // Save for later
        historicalRangeGeoJSON =
            mergedData;


        // Draw historical distribution
        historicalRangeLayer =
            L.geoJSON(
                mergedData,
                {
                    style: {
                        color: "#8b5cf6",

                        weight: 3,

                        opacity: 0.9,

                        fillColor: "#8b5cf6",

                        fillOpacity: 0.18,

                        lineJoin: "round",

                        lineCap: "round"
                    }
                }
            ).addTo(map);


        console.log(
            "Historical distribution loaded:",
            scientificName
        );


        return historicalRangeLayer;

    } catch (error) {

        console.error(
            "Error loading historical distribution:",
            error
        );

        return null;
    }
}


// -------------------------
// SHOW BOTH DISTRIBUTIONS
// -------------------------

async function showSpeciesDistribution(
    scientificName
) {

    // Remove previous species
    clearRanges();


    console.log(
        "Loading distribution for:",
        scientificName
    );


    /*
        Historical loads first.

        Recent loads second so the green
        distribution appears over purple.
    */

    await showHistoricalRange(
        scientificName
    );


    await showCurrentRange(
        scientificName
    );


    console.log(
        "Finished loading distribution for:",
        scientificName
    );
}


// -------------------------
// GET CURRENT LAYER
// -------------------------

function getCurrentRangeLayer() {

    return currentRangeLayer;
}


// -------------------------
// GET HISTORICAL LAYER
// -------------------------

function getHistoricalRangeLayer() {

    return historicalRangeLayer;
}


// -------------------------
// GET CURRENT GEOJSON
// -------------------------

function getCurrentRangeGeoJSON() {

    return currentRangeGeoJSON;
}


// -------------------------
// GET HISTORICAL GEOJSON
// -------------------------

function getHistoricalRangeGeoJSON() {

    return historicalRangeGeoJSON;
}


// -------------------------
// CLEAR DISTRIBUTIONS
// -------------------------

function clearRanges() {

    if (currentRangeLayer) {

        map.removeLayer(
            currentRangeLayer
        );

        currentRangeLayer = null;
    }


    if (historicalRangeLayer) {

        map.removeLayer(
            historicalRangeLayer
        );

        historicalRangeLayer = null;
    }


    currentRangeGeoJSON = null;

    historicalRangeGeoJSON = null;
}


// -------------------------
// CLEAR PLAYER GUESS
// -------------------------

function clearGuess() {

    if (guessMarker) {

        map.removeLayer(
            guessMarker
        );

        guessMarker = null;
    }


    playerGuess = null;

    guessLocked = false;
}


// -------------------------
// RESET MAP
// -------------------------

function resetMap() {

    // Remove guess
    clearGuess();


    // Remove distributions
    clearRanges();


    // Return to world view
    map.setView(
        [15, 0],
        2
    );


    // Fix dragging state
    updateDragging();
}