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
// ACTUAL RANGE VARIABLE
// -------------------------

let actualRangeLayer = null;


// -------------------------
// PLAYER CLICKS MAP
// -------------------------

map.on("click", function (event) {

    // Don't allow guess to change after submitting
    if (guessLocked) {
        return;
    }

    // Save clicked location
    playerGuess = event.latlng;


    // Remove previous marker
    if (guessMarker) {
        map.removeLayer(guessMarker);
    }


    // Add new marker
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
// CHECK FOR GUESS
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
// SHOW ACTUAL RANGE
// -------------------------

function showActualRange(range) {

    // Remove old range if one exists
    if (actualRangeLayer) {
        map.removeLayer(actualRangeLayer);
    }


    // Create range polygon
    actualRangeLayer = L.polygon(range, {
        color: "#8b5cf6",
        weight: 3,
        fillColor: "#8b5cf6",
        fillOpacity: 0.35
    }).addTo(map);


    // Add label
    actualRangeLayer.bindTooltip("Actual Range", {
        permanent: true,
        direction: "center"
    });
}


// -------------------------
// CLEAR ACTUAL RANGE
// -------------------------

function clearActualRange() {

    if (actualRangeLayer) {

        map.removeLayer(actualRangeLayer);

        actualRangeLayer = null;
    }
}


// -------------------------
// CLEAR PLAYER GUESS
// -------------------------

function clearGuess() {

    if (guessMarker) {

        map.removeLayer(guessMarker);

        guessMarker = null;
    }

    playerGuess = null;

    guessLocked = false;
}


// -------------------------
// RESET MAP
// -------------------------

function resetMap() {

    // Remove player marker
    clearGuess();


    // Remove actual animal range
    clearActualRange();


    // Return to world view
    map.setView([15, 0], 2);


    // Fix dragging state
    updateDragging();

    showActualRange([
    [30, -80],
    [25, -70],
    [15, -65],
    [10, -75],
    [20, -85]
]);
}