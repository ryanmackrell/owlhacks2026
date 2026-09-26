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

    // Lock map when completely zoomed out
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
// PLAYER GUESS
// -------------------------

let playerGuess = null;
let guessMarker = null;
let guessLocked = false;


// Player clicks somewhere on map
map.on("click", function (event) {

    // Don't allow changing guess after Submit
    if (guessLocked) {
        return;
    }

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
        offset: [0, -10]
    })
    .openTooltip();
});


// -------------------------
// LOCK GUESS
// -------------------------

function lockGuess() {

    guessLocked = true;
}


// -------------------------
// CHECK IF PLAYER GUESSED
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
// RESET MAP
// -------------------------

function resetMap() {

    // Remove marker
    if (guessMarker) {
        map.removeLayer(guessMarker);
        guessMarker = null;
    }

    // Clear coordinates
    playerGuess = null;

    // Unlock guessing
    guessLocked = false;

    // Return map to beginning
    map.setView([15, 0], 2);

    updateDragging();
}