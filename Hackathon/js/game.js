// -------------------------
// GAME VARIABLES
// -------------------------

let currentRound = 1;
let totalScore = 0;

const maxRounds = 5;

// Current animal being played
let currentSpecies = null;

// Keeps animals from repeating during a game
let usedSpecies = [];


// -------------------------
// UPDATE GAME DISPLAY
// -------------------------

function updateGameDisplay() {

    document.getElementById("round-number").textContent =
        currentRound;

    document.getElementById("total-score").textContent =
        totalScore;
}


// -------------------------
// LOAD RANDOM SPECIES
// -------------------------

function loadRandomSpecies() {

    // If every species somehow gets used,
    // reset the list.
    if (usedSpecies.length >= species.length) {
        usedSpecies = [];
    }


    // Find species that have not been used yet
    const availableSpecies = species.filter(
        function (animal) {

            return !usedSpecies.includes(
                animal.scientificName
            );
        }
    );


    // Pick random species
    const randomIndex =
        Math.floor(
            Math.random() *
            availableSpecies.length
        );


    currentSpecies =
        availableSpecies[randomIndex];


    // Remember that it was used
    usedSpecies.push(
        currentSpecies.scientificName
    );


    // -------------------------
    // DISPLAY ANIMAL
    // -------------------------

    document.getElementById("fish-name").textContent =
        currentSpecies.name;


    document.getElementById("fish-image").src =
        currentSpecies.image;


    document.getElementById("fish-image").alt =
        currentSpecies.name;


    console.log(
        "Current species:",
        currentSpecies.name,
        "(" + currentSpecies.scientificName + ")"
    );
}


// -------------------------
// CALCULATE SCORE
// -------------------------

function calculateScore(distance) {

    if (distance <= 1) {
        return 5000;
    }

    else if (distance <= 10) {
        return 4000;
    }

    else if (distance <= 50) {
        return 3000;
    }

    else if (distance <= 100) {
        return 2000;
    }

    else {
        return 1000;
    }
}


// -------------------------
// START GAME
// -------------------------

function startGame() {

    currentRound = 1;
    totalScore = 0;

    // Allow all species again
    usedSpecies = [];

    resetMap();

    // Pick first animal
    loadRandomSpecies();


    document.getElementById("result").textContent =
        "";


    document.getElementById("submit-button").style.display =
        "inline-block";


    document.getElementById("next-button").style.display =
        "none";


    updateGameDisplay();
}


// -------------------------
// SUBMIT GUESS
// -------------------------

async function submitGuess() {

    // Make sure player selected somewhere
    if (!hasPlayerGuessed()) {

        document.getElementById("result").textContent =
            "Select a location on the map first!";

        return;
    }


    // Stop player from changing their answer
    lockGuess();


    // Prevent player from clicking Submit twice
    document.getElementById("submit-button").style.display =
        "none";


    // -------------------------
    // SHOW SPECIES DISTRIBUTION
    // -------------------------

    await showSpeciesDistribution(
        currentSpecies.scientificName
    );


    // -------------------------
    // TEMPORARY SCORE
    // -------------------------
    //
    // scoring.js can replace this later.

    const roundScore = 1000;


    // Add score
    totalScore += roundScore;


    // -------------------------
    // SHOW RESULT
    // -------------------------

    document.getElementById("result").innerHTML =
        `
        <strong>
            Round Score: +${roundScore}
        </strong>

        <br><br>

        <strong>
            Conservation Status:
        </strong>

        ${currentSpecies.conservationStatus}

        <br><br>

        <strong>
            Fun Fact:
        </strong>

        ${currentSpecies.funFact}
        `;


    // Show Next Fish
    document.getElementById("next-button").style.display =
        "inline-block";


    updateGameDisplay();
}


// -------------------------
// NEXT ROUND
// -------------------------

function nextRound() {

    currentRound++;


    // Check if game is finished
    if (currentRound > maxRounds) {

        endGame();

        return;
    }


    // Reset map
    resetMap();


    // Pick new animal
    loadRandomSpecies();


    // Clear previous result
    document.getElementById("result").textContent =
        "";


    // Show Submit again
    document.getElementById("submit-button").style.display =
        "inline-block";


    // Hide Next Fish
    document.getElementById("next-button").style.display =
        "none";


    updateGameDisplay();
}


// -------------------------
// END GAME
// -------------------------

function endGame() {

    // Lock map
    lockGuess();


    // Hide buttons
    document.getElementById("submit-button").style.display =
        "none";


    document.getElementById("next-button").style.display =
        "none";


    // Display final score
    document.getElementById("result").innerHTML =
        `
        <h2>
            Game Over!
        </h2>

        <h3>
            Final Score: ${totalScore}
        </h3>

        <button id="play-again-button">
            Play Again
        </button>
        `;


    // Play again button
    document
        .getElementById("play-again-button")
        .addEventListener(
            "click",
            startGame
        );
}


// -------------------------
// BUTTON EVENTS
// -------------------------

document
    .getElementById("submit-button")
    .addEventListener(
        "click",
        submitGuess
    );


document
    .getElementById("next-button")
    .addEventListener(
        "click",
        nextRound
    );


// -------------------------
// START GAME
// -------------------------

startGame();