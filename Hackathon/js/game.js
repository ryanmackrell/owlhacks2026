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

    // Reset if every species has somehow been used
    if (usedSpecies.length >= species.length) {
        usedSpecies = [];
    }


    // Find species that have not been used
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


    // Remember species
    usedSpecies.push(
        currentSpecies.scientificName
    );


    // -------------------------
    // DISPLAY ANIMAL
    // -------------------------

    // DON'T reveal the name yet
    document.getElementById("fish-name").textContent =
        "???";


    // Show image
    document.getElementById("fish-image").src =
        currentSpecies.image;


    document.getElementById("fish-image").alt =
        "Mystery Fish";


    console.log(
        "Current species:",
        currentSpecies.name,
        "(" + currentSpecies.scientificName + ")"
    );
}


// -------------------------
// START GAME
// -------------------------

function startGame() {
    document
    .getElementById("result")
    .classList.remove("game-over");

    currentRound = 1;
    totalScore = 0;

    usedSpecies = [];


    resetMap();


    // Pick first animal
    loadRandomSpecies();


    // Clear results
    document.getElementById("result").textContent =
        "";


    // -------------------------
    // SET MAIN BUTTON
    // -------------------------

    const gameButton =
        document.getElementById("submit-button");


    gameButton.style.display =
        "inline-block";


    gameButton.textContent =
        "Submit Guess";


    gameButton.disabled =
        false;


    gameButton.onclick =
        submitGuess;


    // Never use the separate Next Fish button
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


    // Stop player from changing answer
    lockGuess();


    const gameButton =
        document.getElementById("submit-button");


    // Disable while OBIS loads
    gameButton.disabled =
        true;


    gameButton.textContent =
        "Loading...";


    // -------------------------
    // SHOW SPECIES DISTRIBUTION
    // -------------------------

    await showSpeciesDistribution(
        currentSpecies.scientificName
    );


    // -------------------------
    // REVEAL SPECIES NAME
    // -------------------------

    document.getElementById("fish-name").textContent =
        currentSpecies.name;


    document.getElementById("fish-image").alt =
        currentSpecies.name;


    // -------------------------
    // CALCULATE SCORE
    // -------------------------

    const roundScore =
        calculateScore();


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


    // -------------------------
    // CHANGE SAME BUTTON
    // -------------------------

    gameButton.textContent =
        "Next Fish";


    gameButton.disabled =
        false;


    gameButton.onclick =
        nextRound;


    updateGameDisplay();
}


// -------------------------
// NEXT ROUND
// -------------------------

function nextRound() {

    currentRound++;


    // Game finished
    if (currentRound > maxRounds) {

        endGame();

        return;
    }


    // Clear map and guess
    resetMap();


    // Pick another species
    loadRandomSpecies();


    // Clear previous result
    document.getElementById("result").textContent =
        "";


    // -------------------------
    // CHANGE BUTTON BACK
    // -------------------------

    const gameButton =
        document.getElementById("submit-button");


    gameButton.textContent =
        "Submit Guess";


    gameButton.style.display =
        "inline-block";


    gameButton.disabled =
        false;


    gameButton.onclick =
        submitGuess;


    // Make absolutely sure old Next button stays hidden
    document.getElementById("next-button").style.display =
        "none";


    updateGameDisplay();
}


// -------------------------
// END GAME
// -------------------------

function endGame() {

    lockGuess();

    document.getElementById("submit-button").style.display =
        "none";

    document.getElementById("next-button").style.display =
        "none";


    const resultBox =
        document.getElementById("result");

    // Give result box special Game Over styling
    resultBox.classList.add("game-over");


    resultBox.innerHTML =
        `
        <div class="game-over-content">

            <div class="game-over-wave">
                🌊
            </div>

            <h2>
                Game Over!
            </h2>

            <p class="final-score-label">
                Final Score
            </p>

            <div class="final-score">
                ${totalScore}
            </div>

            <button id="play-again-button">
                Play Again
            </button>

        </div>
        `;


    document
        .getElementById("play-again-button")
        .addEventListener(
            "click",
            startGame
        );
}


// -------------------------
// BUTTON SETUP
// -------------------------

document.getElementById("submit-button").onclick =
    submitGuess;


// We don't use the separate Next Fish button anymore
document.getElementById("next-button").style.display =
    "none";


// -------------------------
// START GAME
// -------------------------

startGame();