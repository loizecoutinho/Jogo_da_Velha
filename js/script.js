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

// objeto de jogadores
const players = {
    O: {
        nameEl: player1Name,
        score: 0,
        scoreEl: score1El
    },
    X: {
        nameEl: player2Name,
        score: 0,
        scoreEl: score2El
    }
};

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

//função para o fim do jogo
function endGame(result) {
    gameActive = false;

    if (result) {
        winLine.className = `win ${result.lineClass}`;

        const winnerName = players[result.player].nameEl.textContent;
        winnerEl.textContent = `Vencedor: ${winnerName}`;
        winnerEl.style.display = 'block';

        players[result.player].score++;
        updateScoreboard();

        statusEl.textContent = '';
        statusEl.style.display = 'none';
        return;
    }

    winnerEl.textContent = 'Deu velha!';
    winnerEl.style.display = 'block';
    statusEl.textContent = '';
    statusEl.style.display = 'none';
}

//atualização dos pontos
function updateScoreboard() {
    Object.keys(players).forEach(player => {
        players[player].scoreEl.textContent = players[player].score;
    });
}

//atualização do jogo e vez de cada player
function updateStatus() {
    const currentName = players[currentPlayer].nameEl.textContent;
    statusEl.textContent = `${currentName} (${currentPlayer}) está na vez`;
    statusEl.style.display = 'block';
    winnerEl.style.display = 'none';
}

// lógica do botão de reset
function resetBoard() {
    board.fill('');
    cells.forEach(cell => {
        cell.textContent = '';
        cell.disabled = false;
    });
    winLine.className = 'win';
    gameActive = true;
    currentPlayer = 'O';
    updateStatus();
    winnerEl.textContent = '';
    winnerEl.style.display = 'none';
}

// lógica do botão de acabar o jogo
function finishGame() {
    Object.keys(players).forEach(player => {
        players[player].score = 0;
    });
    updateScoreboard();
    resetBoard();
}

startGame();