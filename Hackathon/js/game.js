// -------------------------
// GAME VARIABLES
// -------------------------

let currentRound = 1;
let totalScore = 0;

const maxRounds = 5;


// -------------------------
// UPDATE GAME DISPLAY
// -------------------------

function updateGameDisplay() {

    document.getElementById("round-number").textContent =
        currentRound;

    document.getElementById("total-score").textContent =
        totalScore;
}

//-------------------------
// Calculate Score
//-------------------------

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

    resetMap();

    document.getElementById("result").textContent = "";

    document.getElementById("submit-button").style.display =
        "inline-block";

    document.getElementById("next-button").style.display =
        "none";

    updateGameDisplay();
}


// -------------------------
// SUBMIT GUESS
// -------------------------

function submitGuess() {

    // Make sure player selected somewhere
    if (!hasPlayerGuessed()) {

        document.getElementById("result").textContent =
            "Select a location on the map first!";

        return;
    }


    // Stop player from changing their answer
    lockGuess();


    // -------------------------
    // TEMPORARY SCORE
    // -------------------------
    //
    // scoring.js will replace this later

    const roundScore = 1000;


    // Add score
    totalScore += roundScore;


    // Show result
    document.getElementById("result").textContent =
        "Round Score: +" + roundScore;


    // Hide Submit
    document.getElementById("submit-button").style.display =
        "none";


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


    // Clear previous result
    document.getElementById("result").textContent = "";


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
        <h2>Game Over!</h2>

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
        .addEventListener("click", startGame);
}


// -------------------------
// BUTTON EVENTS
// -------------------------

document
    .getElementById("submit-button")
    .addEventListener("click", submitGuess);


document
    .getElementById("next-button")
    .addEventListener("click", nextRound);


// -------------------------
// START GAME
// -------------------------

startGame();