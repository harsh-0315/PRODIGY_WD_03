let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset-btn");
let newBtn = document.querySelector("#new-btn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");
let turnText = document.querySelector("#turn-text");
let changeMode = document.getElementById("choose-btn");

let mode = "";
let turnO = true;
let count = 0;

const winPatterns = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
    [3, 4, 5],
    [6, 7, 8],
];

function startGame(selectedMode) {
    mode = selectedMode;

    document.getElementById("mode-screen").classList.add("hide");
    document.getElementById("game-screen").classList.remove("hide");

    resetGame();
}

function resetGame() {
    turnO = true;
    count = 0;

    boxes.forEach((box) => {
        box.innerText = "";
        box.disabled = false;
    });

    msgContainer.classList.add("hide");
    turnText.innerText = "Player O's Turn";
}

function checkWinner() {
    for (let pattern of winPatterns) {
        let a = boxes[pattern[0]].innerText;
        let b = boxes[pattern[1]].innerText;
        let c = boxes[pattern[2]].innerText;

        if (a !== "" && a === b && b === c) {
            showWinner(a);
            return true;
        }
    }
    return false;
}

function showWinner(winner) {
    msg.innerText = `Winner is ${winner}!`;
    msgContainer.classList.remove("hide");
    boxes.forEach((b) => (b.disabled = true));
}

function gameDraw() {
    msg.innerText = "Game Draw!";
    msgContainer.classList.remove("hide");
    boxes.forEach((b) => (b.disabled = true));
}

function findBestMove(symbol) {
    for (let pattern of winPatterns) {
        let [a, b, c] = pattern;
        let values = [boxes[a].innerText, boxes[b].innerText, boxes[c].innerText];

        if (values.filter((v) => v === symbol).length === 2 && values.includes("")) {
            return pattern[values.indexOf("")];
        }
    }
    return -1;
}

function aiMove() {
    let move = findBestMove("X");

    if (move === -1) move = findBestMove("O");

    if (move === -1) {
        let empty = [];
        boxes.forEach((box, i) => {
            if (box.innerText === "") empty.push(i);
        });
        move = empty[Math.floor(Math.random() * empty.length)];
    }

    boxes[move].innerText = "X";
    boxes[move].disabled = true;
    count++;
    turnO = true;

    if (!checkWinner() && count === 9) gameDraw();
    turnText.innerText = "Player O's Turn";
}

boxes.forEach((box) => {
    box.addEventListener("click", () => {
        if (mode === "pvp") {

            box.innerText = turnO ? "O" : "X";
            box.disabled = true;
            turnO = !turnO;
            turnText.innerText = `Player ${turnO ? "O" : "X"}'s Turn`;

            count++;
            if (!checkWinner() && count === 9) gameDraw();
        }

        else if (mode === "ai") {

            if (turnO) {
                box.innerText = "O";
                box.disabled = true;
                count++;
                turnO = false;

                if (!checkWinner() && count === 9) gameDraw();

                setTimeout(() => {
                    if (!checkWinner() && count < 9) aiMove();
                }, 400);
            }
        }
    });
});

resetBtn.addEventListener("click", resetGame);
newBtn.addEventListener("click", resetGame);

changeMode.addEventListener("click", () => {
    document.getElementById("mode-screen").classList.remove("hide");
    document.getElementById("game-screen").classList.add("hide");
})