const distance = 25;
let score = 0;
     
if (distance <= 1) {
    score += 5000;
}
else if (distance <= 10) {
    score += 4000;
}
else if (distance <= 50) {
    score += 3000;
}
else if (distance <= 100) {
    score += 2000;
} else {
    score += 1000;
}

console.log("Score: " + score);
console.log("Distance: " + distance + " km");
