// -------------------------
// CREATE MAP
// -------------------------

const worldBounds = L.latLngBounds(
    L.latLng(-85, -Infinity),
    L.latLng(85, Infinity)
);

const map = L.map("map", {
    maxBounds: worldBounds,
    maxBoundsViscosity: 1.0,
    minZoom: 2,
    maxZoom: 10,
    zoom: 3,
    maxBoundsViscosity: 1.0,
}).setView([15, 0], 2);


// -------------------------
// MAP TILES
// -------------------------

L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    {
        attribution: "Tiles &copy; Esri",
        noWrap: false,
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
// RANGE VARIABLES
// -------------------------

let currentRangeLayer = null;
let historicalRangeLayer = null;


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
// SHOW CURRENT RANGE
// -------------------------

function showCurrentRange(range) {

    // Remove previous current range
    if (currentRangeLayer) {
        map.removeLayer(currentRangeLayer);
    }

    // Draw current range
    currentRangeLayer = L.polygon(range, {
        color: "#22c55e",
        weight: 3,
        fillColor: "#22c55e",
        fillOpacity: 0.35
    }).addTo(map);

    // Add label
    currentRangeLayer.bindTooltip("Current Range", {
        permanent: true,
        direction: "center"
    });
}


// -------------------------
// SHOW HISTORICAL RANGE
// -------------------------

function showHistoricalRange(range) {

    // Remove previous historical range
    if (historicalRangeLayer) {
        map.removeLayer(historicalRangeLayer);
    }

    // Draw historical range
    historicalRangeLayer = L.polygon(range, {
        color: "#8b5cf6",
        weight: 3,
        fillColor: "#8b5cf6",
        fillOpacity: 0.20,
        dashArray: "8, 6"
    }).addTo(map);

    // Add label
    historicalRangeLayer.bindTooltip("Historical Range", {
        permanent: true,
        direction: "center"
    });
}


// -------------------------
// CLEAR RANGES
// -------------------------

function clearRanges() {

    if (currentRangeLayer) {
        map.removeLayer(currentRangeLayer);
        currentRangeLayer = null;
    }

    if (historicalRangeLayer) {
        map.removeLayer(historicalRangeLayer);
        historicalRangeLayer = null;
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

    clearGuess();
    clearRanges();

    map.setView([15, 0], 2);

    updateDragging();
}