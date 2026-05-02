const cells = Array.from(document.querySelectorAll('.cell'));
const statusEl = document.getElementById('status');
const winnerEl = document.getElementById('vencedor');
const score1El = document.getElementById('pontuacao1');
const score2El = document.getElementById('pontuacao2');
const reiniciarBnt = document.getElementById('reiniciar');
const finalizarBnt = document.getElementById('finalizar');
const winLine = document.getElementById('win-line');
const player1Name = document.getElementById('jogador1');
const player2Name = document.getElementById('jogador2');

// combinações de vitória
const WIN_COMBINATIONS = [
    { combo: [0, 1, 2], lineClass: 'win-row-0' },
    { combo: [3, 4, 5], lineClass: 'win-row-1' },
    { combo: [6, 7, 8], lineClass: 'win-row-2' },
    { combo: [0, 3, 6], lineClass: 'win-col-0' },
    { combo: [1, 4, 7], lineClass: 'win-col-1' },
    { combo: [2, 5, 8], lineClass: 'win-col-2' },
    { combo: [0, 4, 8], lineClass: 'diag-1' },
    { combo: [2, 4, 6], lineClass: 'diag-2' }
];

let board = Array(9).fill('');
let currentPlayer = 'O';
let gameActive = true;
let scoreO = 0;
let scoreX = 0;

//Starta o Jogo
function startGame() {
    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    reiniciarBnt.addEventListener('click', resetBoard);
    finalizarBnt.addEventListener('click', finishGame);
    resetBoard();
}

// função lidar com clicks
function handleCellClick(event) {
    const cell = event.currentTarget;
    const index = Number(cell.dataset.index);

    if (!gameActive || board[index] !== '') {
        return;
    }

    board[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.disabled = true;

    const winResult = checkWin();
    if (winResult) {
        endGame(winResult);
        return;
    }

    if (!board.includes('')) {
        endGame(null);
        return;
    }

    currentPlayer = currentPlayer === 'O' ? 'X' : 'O';
    updateStatus();
}

//função checar vitória
function checkWin() {
    for (const { combo, lineClass } of WIN_COMBINATIONS) {
        const [a, b, c] = combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return { player: board[a], lineClass };
        }
    }
    return null;
}

