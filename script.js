const bingoNumbers = [];
for (let i = 1; i <= 75; i++) {
    bingoNumbers.push(i);
}

let drawnNumbers = [];
let bNumbers = [];
let iNumbers = [];
let nNumbers = [];
let gNumbers = [];
let oNumbers = [];
const ballDisplay = document.getElementById("current-ball");
let selectedLetter = "all";
const letterSelector = document.getElementById("letter-selector");

letterSelector.addEventListener("change", (event) => {
    selectedLetter = event.target.value;
});

document.getElementById("next-ball").addEventListener("click", drawNextBall);

function drawNextBall() {
    if (drawnNumbers.length === 75) {
        alert("Todos los números han sido sorteados");
        return;
    }

    let elapsed = 0;
    const interval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * 75) + 1;
        const ballLetter = getBallLetter(randomIndex);
        const ballText = `${ballLetter} ${randomIndex}`;
        ballDisplay.innerText = ballText;
        elapsed += 100;

        if (elapsed >= 3000) {
            clearInterval(interval);
            selectFinalBall();
        }
    }, 100);
}

function selectFinalBall() {
    let randomIndex;
    let potentialBallNumbers = [];
    
    do {
        potentialBallNumbers = bingoNumbers.filter(number => {
            const ballLetter = getBallLetter(number);
            return selectedLetter === "all" || ballLetter === selectedLetter;
        }).filter(number => !drawnNumbers.includes(number));
        
        if (potentialBallNumbers.length === 0) {
            alert(`Ya no quedan más balotas para la letra ${selectedLetter}`);
            return;
        }

        randomIndex = Math.floor(Math.random() * potentialBallNumbers.length);
        randomIndex = potentialBallNumbers[randomIndex] - 1;

        const ballLetter = getBallLetter(randomIndex + 1);
        if (selectedLetter === "all" || ballLetter === selectedLetter) {
            break;
        }
    } while (true);

    drawnNumbers.push(randomIndex + 1);

    const ballLetter = getBallLetter(randomIndex + 1);
    const ballNumber = randomIndex + 1;
    const ballText = `${ballLetter} ${ballNumber}`;

    if (ballLetter === 'B') bNumbers.push(ballNumber);
    if (ballLetter === 'I') iNumbers.push(ballNumber);
    if (ballLetter === 'N') nNumbers.push(ballNumber);
    if (ballLetter === 'G') gNumbers.push(ballNumber);
    if (ballLetter === 'O') oNumbers.push(ballNumber);

    ballDisplay.innerText = ballText;
    highlightNumber(ballNumber);

    speakBall(ballText);
}

function getBallLetter(number) {
    if (number <= 15) return 'B';
    if (number <= 30) return 'I';
    if (number <= 45) return 'N';
    if (number <= 60) return 'G';
    return 'O';
}

function highlightNumber(number) {
    const td = document.getElementById(`num-${number}`);
    if (td) {
        td.classList.add("highlight");
    }
}

function generateBingoBoard() {
    const board = document.getElementById("bingo-numbers");

    for (let row = 1; row <= 15; row++) {
        const tr = document.createElement("tr");

        const tdB = document.createElement("td");
        tdB.id = `num-${row}`;
        tdB.textContent = row;
        tr.appendChild(tdB);

        const tdI = document.createElement("td");
        tdI.id = `num-${row + 15}`;
        tdI.textContent = row + 15;
        tr.appendChild(tdI);

        const tdN = document.createElement("td");
        tdN.id = `num-${row + 30}`;
        tdN.textContent = row + 30;
        tr.appendChild(tdN);

        const tdG = document.createElement("td");
        tdG.id = `num-${row + 45}`;
        tdG.textContent = row + 45;
        tr.appendChild(tdG);

        const tdO = document.createElement("td");
        tdO.id = `num-${row + 60}`;
        tdO.textContent = row + 60;
        tr.appendChild(tdO);

        board.appendChild(tr);
    }
}

function speakBall(ballText) {
    const speech = new SpeechSynthesisUtterance(ballText);
    speech.lang = 'es-ES'; // Cambia el idioma a español
    window.speechSynthesis.speak(speech);
}

function speakNumbersForLetter(numbers, letter) {
    if (numbers.length === 0) {
        speakBall(`No hay balotas para la letra ${letter}`);
        return;
    }

    const numbersText = numbers.join(', ');
    speakBall(`Letras para la letra ${letter}: ${numbersText}`);
}

document.getElementById("B-letter").addEventListener("click", () => speakNumbersForLetter(bNumbers, 'B'));
document.getElementById("I-letter").addEventListener("click", () => speakNumbersForLetter(iNumbers, 'I'));
document.getElementById("N-letter").addEventListener("click", () => speakNumbersForLetter(nNumbers, 'N'));
document.getElementById("G-letter").addEventListener("click", () => speakNumbersForLetter(gNumbers, 'G'));
document.getElementById("O-letter").addEventListener("click", () => speakNumbersForLetter(oNumbers, 'O'));

generateBingoBoard();
