// -------------------------
// AQUAGUESSR SCORING
// -------------------------

function calculateScore() {

    // map.js checks whether the player's guess
    // is inside the species distribution.
    const insideRange =
        isGuessInsideCurrentRange();


    if (insideRange) {

        console.log(
            "Guess is inside the distribution."
        );

        return 5000;
    }


    console.log(
        "Guess is outside the distribution."
    );

    return 0;
}