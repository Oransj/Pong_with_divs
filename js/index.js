var playerSpeed = [1.5, 1.5];

var singlePlayer = true;

var hits = 0;

var hitArea = 0.1;

var running = true;
//[0] = P1, [1] = P2
var goals = [0,0]

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
    //[0] = x, [1] = y
    speed: [3, 0]
}

var board = {
    anchorX: 0,
    anchorY: 0,
    lengthX: 0,
    lengthY: 0
}

const hitText = document.getElementById("hit-text");
const highscoreText = document.getElementsByClassName("highscore-text")[0];
const menu = document.getElementsByClassName("top-down-menu")[0];
const menuToggle = document.getElementById("toggle-checkbox");
var highScore = 0;

window.onload = function() {
    highScore = localStorage.getItem('pongHighScore');
    if (highScore == null) {
        highScore = 0;
    }
    highscoreText.innerText = `${highScore}`;
    initialize();
}

function initialize() {
    reset();
    if(getRndInteger(0,1) == 1) {
        ball.speed[0] = -ball.speed[0];
    }
    ball.speed[1] = (getRndInteger(0, 9) - 5)/10;
    running = true;
    gameLoop();
}

function reset() {
    var boardObject = document.getElementById("board");
    board.lengthX = boardObject.offsetWidth;
    board.lengthY = boardObject.offsetHeight;
    player1.posY = board.lengthY*0.5 - player1.racket.offsetHeight/2; //Centering player1 of the Y axis
    player2.posY = board.lengthY*0.5 - player2.racket.offsetHeight/2; //Centering player2 of the Y axis
    ball.posY = board.lengthY/2;
    ball.posX = board.lengthX/2;
    ball.speed[0] = 3;
    ball.speed[1] = 0;
    hits = 0;
    updateTextEntities();
    running = false;
}

function calculateHighscore() {
    if (hits > highScore) {
        highScore = hits;
        localStorage.setItem('pongHighScore', highScore);
        highscoreText.innerText = `${highScore}`
        updateTextEntities();
    }
}

function isOverlapping(element1, element2){
    var box1 = element1.getBoundingClientRect();
    var box2 = element2.getBoundingClientRect();
    return (box1.right > box2.left && 
            box1.left < box2.right && 
            box1.bottom > box2.top && 
            box1.top < box2.bottom)
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function gameLogic() {
    var speedIncrease = 0.1;
    var angle = (5/3); //This is equal to about 75 degrees
    var inHitbox = false;
    // Checks if the ball is overlapping any of the rackets
    var overlappingRacket1 = isOverlapping(player1.racket, ball.ballRef);
    var overlappingRacket2 = isOverlapping(player2.racket, ball.ballRef);
    if(overlappingRacket1 && !inHitbox) {
        //ball.speed[1] = calculateRelativePosition(player1, ball);
        ball.speed[0] = ball.speed[0] * -1 + speedIncrease;
        ball.speed[1] = Math.abs(ball.speed[0]) * (calculateRelativePosition(player1, ball)*angle);
        hits++;
        inHitbox = true;
    }
    else if (overlappingRacket2 && !inHitbox) {
        //ball.speed[1] = calculateRelativePosition(player2, ball);
        ball.speed[0] = ball.speed[0] * -1 - speedIncrease;
        ball.speed[1] = Math.abs(ball.speed[0]) * (calculateRelativePosition(player2, ball)*angle);
        inHitbox = true;
        if(singlePlayer) {
            hitArea = getRndInteger(1, 5)/10;
        }
    } else if (!overlappingRacket1 && !overlappingRacket2){
        inHitbox = false;
    }
    if(ball.ballRef.offsetTop <= 0 || (ball.ballRef.offsetTop+ball.ballRef.offsetHeight) >= board.lengthY) {
        ball.speed[1] = -ball.speed[1];
    }

    if(ball.ballRef.offsetLeft <= 0) {
        ball.speed[0] = -ball.speed[0];
        running = false;
    }
    if((ball.ballRef.offsetLeft + ball.ballRef.offsetWidth) >= board.lengthX) {
        ball.speed[0] = -ball.speed[0];
    }
    
    ball.posX += ball.speed[0];
    ball.posY += ball.speed[1];
}

function calculateRelativePosition(player, ball) {
    var ballMiddle = ball.posY + (ball.ballRef.offsetHeight/2);
    var playerMiddle = player.posY + (player.racket.offsetHeight/2);
    return (ballMiddle - playerMiddle) / player.racket.offsetHeight;
}

function updateMovableEntities() {
    player1.racket.style.top = `${player1.posY}px`;
    player2.racket.style.top = `${player2.posY}px`;
    ball.ballRef.style.top = `${ball.posY}px`;
    ball.ballRef.style.left = `${ball.posX}px`;
}

function updateTextEntities() {
    hitText.innerText = `${hits}`
}

function updateEntities() {

    updateMovableEntities();
    updateTextEntities();
}

function aiCalculation() {
    var offset = calculateRelativePosition(player2, ball);
    if(offset < -hitArea) {
        moveUp(player2);
    }
    if(offset > hitArea) {
        moveDown(player2);
    }
}

function moveUp(player) {
    if (player.posY > 0) {
        player.posY -= 10;
    }
}

function moveDown(player) {
    if(player.posY + player.racket.offsetHeight < board.lengthY) {
        player.posY += 10;
    }
}

function gameLoop() {
    gameLogic();
    updateEntities();
    if(singlePlayer) {
        aiCalculation();
    }
    if (running) {
        window.requestAnimationFrame(gameLoop);
    } else {
        calculateHighscore();
    }
    
}

document.addEventListener("keydown", (event) => {
    switch (event.code) {
        case "KeyW":
            if(player1.posY > 0) {
                player1.posY -= 10;
            }
            else {
                player1.posY = 0;
            }
            break;
        case "KeyS":
            if((player1.posY + player1.racket.offsetHeight) < board.lengthY) {
                player1.posY += 10;
            }
            else {
                player1.posY = (board.lengthY - player1.racket.offsetHeight);
            }
            break;
    }
});

menuToggle.addEventListener('click', () => {
    const open = menu.getAttribute('data-state') == "opened";
    if (open ? closeMenu() : openMenu());
});

function openMenu() {
    menu.setAttribute('data-state', "opened");
}
function closeMenu() {
    menu.setAttribute('data-state', "closing");

    menu.addEventListener('animationend', () => {
        menu.setAttribute('data-state', "closed");
        console.log("Closed")
    }, {once: true});
}