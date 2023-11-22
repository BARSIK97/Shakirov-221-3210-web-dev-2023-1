"use strict";

let isUserTurn = true;
let isGameOver = false;

function isBoardFull() {
    let cells = document.querySelectorAll(".cell");
    for (let cell of cells) {
        if (cell.textContent === "") {
            return false;
        }
    }
    return true;
}

function showMessage(messageText, category = "event1") {
    let messageBox = document.getElementById("messages");
    let message = document.createElement("div");
    message.textContent = messageText;
    message.classList.add("message", category);
    messageBox.appendChild(message);
    setTimeout(() => message.remove(), 3000);
}

function checkWin() {
    const cells = document.querySelectorAll(".cell");
    for (let i = 0; i < 3; ++i) {
        if (cells[i * 3].textContent !== "" &&
            cells[i * 3].textContent === cells[i * 3 + 1].textContent &&
            cells[i * 3 + 1].textContent === cells[i * 3 + 2].textContent) {
            return cells[i * 3].textContent;
        }
    }
}

function checkWinColumn() {
    const cells = document.querySelectorAll(".cell");
    for (let i = 0; i < 3; ++i) {
        if (cells[i].textContent !== "" &&
            cells[i].textContent === cells[i + 3].textContent &&
            cells[i + 3].textContent === cells[i + 6].textContent) {
            return cells[i].textContent;
        }
    }
}

function checkWinDiagonalLR() {
    const cells = document.querySelectorAll(".cell");
    if (cells[0].textContent !== "" &&
        cells[0].textContent === cells[4].textContent &&
        cells[4].textContent === cells[8].textContent) {
        return cells[0].textContent;
    }
}

function checkWinDiagonalRL() {
    const cells = document.querySelectorAll(".cell");
    if (cells[2].textContent !== "" &&
        cells[2].textContent === cells[4].textContent &&
        cells[4].textContent === cells[6].textContent) {
        return cells[2].textContent;
    }
}

function processClick(event) {
    const cell = event.target;
    if (isGameOver) {
        showMessage("Игра завершена", "event2");
        return;
    }
    if (cell.textContent !== "") {
        showMessage("Занятая ячейка", "event2");
        return;
    }
    cell.textContent = isUserTurn ? "X" : "O";
    isUserTurn = !isUserTurn;

    // eslint-disable-next-line max-len
    const winner = checkWin() || checkWinColumn() || checkWinDiagonalLR() || checkWinDiagonalRL();
    if (winner) {
        showMessage(`${winner} WINS`);
        isGameOver = true;
        return;
    }

    if (isBoardFull()) {
        showMessage("КОНЕЦ", "event2");
        isGameOver = true;
    }
    
}

function startNewGame() {
    const cells = document.querySelectorAll(".cell");
    for (let cell of cells) {
        cell.textContent = "";
    }
    isGameOver = false;
    isUserTurn = true;
}

document.querySelector(".button").onclick = startNewGame;

function initializeBoard() {
    const boardElement = document.getElementById("board");
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.addEventListener("click", processClick);
        boardElement.appendChild(cell);
    }
    return boardElement;
}

window.onload = initializeBoard;