/* var playerSpeed = [1.5, 1.5]

var player1 = {
    racket: document.getElementById("player1"),
    posX: 0,
    posY: 0,
    speed: playerSpeed
};

var player2 ={
    racket: document.getElementById("player2"),
    posX: 0,
    posY: 0,
    speed: playerSpeed
}

var ball = {
    ballRef: document.getElementById("ball"),
    posX: 0,
    posY: 0,
    speed: [2.5, 2.5]
}

var board = {
    anchorX: 0,
    anchorY: 0,
    lengthX: 0,
    lengthY: 0
}

window.onload = function() {
    initialize();
}

function initialize() {
    var boardObject = document.getElementById("board"); 
    board.lengthX = boardObject.offsetWidth;
    board.lengthY = boardObject.offsetHeight;
    player1.posX = 50;
    player1.posY = board.lengthY*0.5 - 50; //Middle of Y, then compensating for anchor by moving up by half the length of the player
    player2.posX = board.lengthX - 75; // moving 50px away from thre right border
    player2.posY = board.lengthY*0.5 - 150; //Middle of Y, then compensating for anchor by moving up by half the length of the player
    gameLoop();
}

function isOverlapping(element1, element2){
    var box1 = element1.getBoundingClientRect();
    var box2 = element2.getBoundingClientRect();
    return (box1.right > box2.left && 
            box1.left < box2.right && 
            box1.bottom > box2.top && 
            box1.top < box2.bottom)
    }

function gameLogic() {
    // Checks if the ball is overlapping any of the rackets of the player
    if(isOverlapping(player1.racket, ball.ballRef)) {

    }
    else if (isOverlapping(player2.racket, ball.ballRef)) {

    }

}

function updateEntities() {
 player1.racket.style.transform = `translate(${player1.posX}px,${player1.posY}px)`
 player2.racket.style.transform = `translate(${player2.posX}px,${player2.posY}px)`
 ball.ballRef.style.transform = `translate(${ball.posX}px,${ball.posY}px)`
}

var running = true;
function gameLoop() {
    gameLogic();
    updateEntities();
    if (running) {
        window.requestAnimationFrame(gameLoop);
    }
}  */


var pl1 = document.getElementById("player1");
var position = 0;
var running = true;

function move(time) {
    pl1.style.left = `${position}px`;
/*     pl1.style.transform = `translateX(${position}px)`; */
    position += 5;
    if(position > 200) {
        running = false;
    }
    if(running) {
        window.requestAnimationFrame(move);
    }
}


window.requestAnimationFrame(move);

