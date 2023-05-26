let fieldSize = 600;
let squareSizeOptions = [50, 100, 150, 200, 250, 300];
let container = document.getElementsByClassName("container")[0];
let initialStateForm = document.getElementsByClassName("card")[0]; 
let square1, square2;
let pressedKeys = {};
let user1KeyCodes = [ 'KeyW', 'KeyD', 'KeyS', 'KeyA' ];
let user2KeyCodes = [ 'ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft' ];

main();

function main() {
    initializeOptions();
}

function initializeOptions() {
    let squareSizeElements = document.getElementsByClassName("control-square-size");
    for (let i=0; i<squareSizeElements.length; i++) {
        for (let j=0; j<squareSizeOptions.length; j++) {
            let optionElem = document.createElement('option');
            optionElem.textContent = squareSizeOptions[j]+"x"+squareSizeOptions[j];
            squareSizeElements[i].appendChild(optionElem);
        }
    }
    document.getElementById("form").onsubmit = initializeGame;
}

function initializeGame(e) {
    e.preventDefault();
    square1 = initializeUser(1);
    square2 = initializeUser(2);
    if (square1.size > square2.size) {
        square1.isSmaller = false;
        square2.isSmaller = true;
    } else {
        square1.isSmaller = true;
        square2.isSmaller = false;
    }
    removeChildren(container);

    let field = document.createElement('div');
    field.className = 'field';
    field.style.width = field.style.height = fieldSize + 'px';
    field.appendChild(square1);
    field.appendChild(square2);
    container.appendChild(field);
    document.onkeydown = move;
    document.onkeyup = move;
}

function removeChildren(element) {
    element.innerHTML = '';
}

function initializeUser(userNum) {
    let offest = 10;
    let square = document.createElement('img');
    square.className = 'square';
    let size = squareSizeOptions[document.getElementById("square-size-"+userNum).selectedIndex];
    let speed = Number(document.getElementById("speed-"+userNum).value);
    square.size = size;
    square.speed = speed;
    square.userNum = userNum;
    square.style.width = square.style.height = size + "px";
    square.top = userNum == 1 ? offest : (fieldSize - size - offest);
    square.left = square.top;
    updateCoords(square);
    square.src = userNum == 1 ? "img/man.gif" : "img/cat.gif";
    return square;
}

function move(event) {
    if ([...user1KeyCodes, ...user2KeyCodes].includes(event.code)) {
        pressedKeys[event.code] = event.type === 'keydown';
    }

    for (let key in pressedKeys) {
        if (!pressedKeys[key]) continue;
        calculateUserCoords(user1KeyCodes, square1, key)
        calculateUserCoords(user2KeyCodes, square2, key)
    }
    
    updateCoords(square1);
    updateCoords(square2);

    let gameOver = checkGameOver(square1) || checkGameOver(square2);
    if (gameOver) {
        removeChildren(container);
        container.appendChild(initialStateForm);
        pressedKeys = {};
        document.onkeydown = null;
        document.onkeyup = null;
    }
}

function calculateUserCoords(userKeyCodes, square, key) {
    if (!userKeyCodes.includes(key)) return;
    switch(key) {
        case userKeyCodes[0]:
            square.top -= square.speed;
            break;
        case userKeyCodes[1]:
            square.left += square.speed;
            break;
        case userKeyCodes[2]:
            square.top += square.speed;
            break;
        case userKeyCodes[3]:
            square.left -= square.speed;
            break;
        default: 
            break;
    }
}

function checkGameOver(square) {
    if (!cooridinatesInsideField(square.size, square.size, square.top, square.left)) {
        alert('Игрок ' + square.userNum + ' проиграл!');
        return true;
    } else if (usersFaced(square1, square2) || usersFaced(square2, square1)) {
        let winner = square1.isSmaller ? 2 : 1;
        alert('Игрок ' + winner + ' победил!')
        return true;
    } 
    return false;
}

function cooridinatesInsideField(width, height, top, left) {
    return top > 0 
        && left > 0 
        && top + height < fieldSize
        && left + width < fieldSize           
}

function usersFaced(square1, square2) {
    return pointInSquare(square1.top, square1.left, square2)
        || pointInSquare(square1.top + square1.size, square1.left, square2)
        || pointInSquare(square1.top, square1.left + square1.size, square2)
        || pointInSquare(square1.top + square1.size, square1.left + square1.size, square2)
}

function pointInSquare(top, left, square) {
    return top >= square.top
        && top <= square.top + square.size
        && left >= square.left
        && left <= square.left + square.size
}

function updateCoords(square) {
    square.style.top = square.top + 'px';
    square.style.left = square.left + 'px';
}

