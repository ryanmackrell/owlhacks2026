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


L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    {
        attribution: "Tiles &copy; Esri",
        noWrap: true,
        maxZoom: 18
    }
).addTo(map);


// Lock movement when fully zoomed out
function updateDragging() {

    if (map.getZoom() === map.getMinZoom()) {
        map.dragging.disable();
    } else {
        map.dragging.enable();
    }

}


// Run when map loads
updateDragging();


// Run every time user zooms
map.on("zoomend", function () {
    updateDragging();
});


// -------------------------
// PLAYER GUESS
// -------------------------

let playerGuess = null;
let guessMarker = null;


// When player clicks somewhere on the map
map.on("click", function (event) {

    playerGuess = event.latlng;

    // Remove previous marker
    if (guessMarker) {
        map.removeLayer(guessMarker);
    }

    // Add marker at clicked location
    guessMarker = L.marker([
        playerGuess.lat,
        playerGuess.lng
    ]).addTo(map);

});


// Remove guess when starting a new round
function clearGuess() {

    if (guessMarker) {
        map.removeLayer(guessMarker);
        guessMarker = null;
    }

    playerGuess = null;
}