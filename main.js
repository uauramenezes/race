const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Factory functions to create elements
const wall = (x) => {
    y = 0;
    width = 4;
    height = canvas.height;

    return {x, y, width, height};
}

const element = (x, y, line) => {
    width = 50;
    height = 50;

    return {x, y, width, height, line};
}

// Get the x position of obstacles on line with 2 obstacles
function getPosition2x() {
    let randomPosition = Math.floor(Math.random() * 2); 
    let x;
    switch (randomPosition) {
        case 0:
            x = 275;
            break;
        case 1:
            x = 425;
            break;
    }
    return x
}

// Get the x position of obstacles on line with 3 obstacles
function getPosition3x() {
    let randomPosition = Math.floor(Math.random() * 3);
    let x;
    switch (randomPosition) {
        case 0:
            x = 200
            break;
        case 1:
            x = 350;
            break;
        case 2:
            x = 500;
            break;
    }
    return x
}

// Create the elements of the game

// Create the walls
let leftWall = wall(canvas.width / 4 - 2);
let rightWall = wall(canvas.width * (3 / 4) - 2);

// Create the player
let player = element(canvas.width / 2 - 25, canvas.height - 55, 1);

// Create the obstacles
let obstacle = {};

const createObstacle = (() => {
    for (let i = 0; i < 6; i++) {
        if (i < 2) {
            obstacle[i] = element(getPosition3x(), -50, 3);
        } else if (i < 4) {
            obstacle[i] = element(getPosition2x(), -250, 2);
        } else if (i < 6) {
            obstacle[i] = element(getPosition3x(), -450, 3);
        } 
     }
})()

let gameState = 'start';
let score = 0;

// Draw the elements on the screen
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //Define color of objects and texts
    ctx.fillStyle = '#fff';

    // Draw player
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Draw walls
    ctx.fillRect(leftWall.x, leftWall.y, leftWall.width, leftWall.height);
    ctx.fillRect(rightWall.x, rightWall.y, rightWall.width, rightWall.height);

    // Create obstacles and draw them if game over
    for (let i = 0; i < 6; i++) {
        ctx.fillRect(obstacle[i].x, obstacle[i].y, obstacle[i].width, obstacle[i].height);
        
    }

    // Define font and alignment of screen text
    ctx.font = '30px Quantico'
    ctx.textAlign = 'center'

    // Display score
    ctx.fillText('Score', leftWall.x / 2, 75)
    ctx.fillText(score,  leftWall.x / 2, 125)

    // Display message
    if (gameState === 'start') {
        ctx.fillText('Press Enter to start!', canvas.width / 2, 125)
        ctx.fillText('Press Space to pause!', canvas.width / 2, 200)
        ctx.fillText('Press Enter', 660, 75)
    }
    if (gameState === 'play' || gameState === 'pause') {
        ctx.fillText('Press Space', 660, 75)
    }
    if (gameState === 'gameOver') {
        ctx.fillStyle = '#gray';
        ctx.fillText('Press Escape to restart!', canvas.width / 2, 200)
        ctx.fillStyle = '#fff';
        ctx.fillText('Press Esc', 660, 75)
    }
}

// Variables to control elements speed
let dy = 1;

function playerInput(e) {
    const dx = 75;
    
    if (e.key === 'Enter' && gameState === 'start') {
        gameState = 'play';
    }
    
    if (gameState === 'play' && e.key === ' ') {
        gameState = 'pause';
    } else if (gameState === 'pause' && e.key === ' ') {
        gameState = 'play'
    }

    if (gameState === 'play') {
        if ((e.key === 'a' || e.key === 'ArrowLeft') && player.x > 200) {
            player.x -= dx;
        }
        if ((e.key === 'd' || e.key === 'ArrowRight') && player.x < 500) {
            player.x += dx;
        }
    }

    if (gameState === 'gameOver' && e.key === 'Escape') {
        resetGame()
        gameState = 'start'
    }
}

function moveObstacle() {
    for (let i = 0; i < 6; i++) {
        obstacle[i].y += dy
        if (obstacle[i].y > canvas.height) {
            obstacle[i].y = -50
            if (obstacle[i].line === 3) {
                obstacle[i].x = getPosition3x()
            } else {
                obstacle[i].x = getPosition2x() 
            }
        } 
    }
    if (distance > 1000) {
        dy = Math.floor(distance / 1000)
    }
}

function collisionDetect() {
    for (let i = 0; i < 6; i++) {
        if (player.y < obstacle[i].y + obstacle[i].height &&
            player.x === obstacle[i].x) {
            gameState = 'gameOver'
        }
    }
}

// Variable to control speed and score
let distance = 0;

function getScore() {
    let turn = Math.floor(distance / 1000)
    
    if (distance < 1000) {
        score = Math.floor(distance / 100)
    } else {
        score = Math.floor(distance / 100) * turn
    }
}

function resetGame() {
    for (let i = 0; i < 6; i++) {
        if (i < 2) {
            obstacle[i] = element(getPosition3x(), -50, 3);
        } else if (i < 4) {
            obstacle[i] = element(getPosition2x(), -250, 2);
        } else if (i < 6) {
            obstacle[i] = element(getPosition3x(), -450, 3);
        } 
    }
    player.x = canvas.width / 2 - 25;
    distance = 0;
    score = 0;
    dy = 1;
}

// function to control the game
function playGame() {
    draw()

    document.addEventListener('keydown', playerInput);

    if (gameState === 'play') {
        collisionDetect();
        moveObstacle();
        distance += 1;
        getScore();
    }  

    requestAnimationFrame(playGame)
}

playGame();
