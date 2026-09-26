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

    // Lock movement when completely zoomed out
    if (map.getZoom() === map.getMinZoom()) {
        map.dragging.disable();
    } else {
        map.dragging.enable();
    }
}


// Run when map first loads
updateDragging();


// Check again whenever player zooms
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
// PLAYER CLICKS MAP
// -------------------------

map.on("click", function (event) {

    // Don't allow the player to change
    // their answer after submitting
    if (guessLocked) {
        return;
    }


    // Save clicked location
    playerGuess = event.latlng;


    // Remove old marker if one exists
    if (guessMarker) {
        map.removeLayer(guessMarker);
    }


    // Create marker at new location
// Create marker at new location
guessMarker = L.marker([
    playerGuess.lat,
    playerGuess.lng
])
.addTo(map)
.bindTooltip("Your Guess", {
    permanent: true,
    direction: "top"
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
// CLEAR GUESS
// -------------------------

function clearGuess() {

    // Remove marker
    if (guessMarker) {
        map.removeLayer(guessMarker);
        guessMarker = null;
    }

    // Remove stored coordinates
    playerGuess = null;

    // Allow another guess
    guessLocked = false;
}


// -------------------------
// RESET MAP
// -------------------------

function resetMap() {

    // Remove previous guess
    clearGuess();

    // Return map to starting location/zoom
    map.setView([15, 0], 2);

    // Make sure dragging state is correct
    updateDragging();
}