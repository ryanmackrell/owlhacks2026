// -------------------------
// AQUAGUESSR GAME SYSTEM
// -------------------------

let currentRound = 1;
let totalScore = 0;

const maxRounds = 5;


// -------------------------
// UPDATE SCREEN
// -------------------------

function updateGameDisplay() {

    document.getElementById("round-number").textContent =
        currentRound;

    document.getElementById("total-score").textContent =
        totalScore;
}


// -------------------------
// START GAME
// -------------------------

function startGame() {

    currentRound = 1;
    totalScore = 0;

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

    // Temporary score for testing.
    // Later scoring.js will calculate this.
    const roundScore = 1000;

    totalScore += roundScore;

    document.getElementById("result").textContent =
        "Round Score: +" + roundScore;

    document.getElementById("submit-button").style.display =
        "none";

    document.getElementById("next-button").style.display =
        "inline-block";

    updateGameDisplay();
}


// -------------------------
// NEXT ROUND
// -------------------------

function nextRound() {

    currentRound++;

    if (currentRound > maxRounds) {

        endGame();
        return;
    }

    document.getElementById("result").textContent = "";

    document.getElementById("submit-button").style.display =
        "inline-block";

    document.getElementById("next-button").style.display =
        "none";

    updateGameDisplay();
}


// -------------------------
// END GAME
// -------------------------

function endGame() {

    document.getElementById("submit-button").style.display =
        "none";

    document.getElementById("next-button").style.display =
        "none";

    document.getElementById("result").innerHTML =
        `
        <h2>Game Over!</h2>
        <h3>Final Score: ${totalScore}</h3>
        <button id="play-again-button">Play Again</button>
        `;

    document
        .getElementById("play-again-button")
        .addEventListener("click", startGame);
}


// -------------------------
// BUTTONS
// -------------------------

document
    .getElementById("submit-button")
    .addEventListener("click", submitGuess);

document
    .getElementById("next-button")
    .addEventListener("click", nextRound);


// -------------------------
// START
// -------------------------

startGame();