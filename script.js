function Gameboard() {
    const board = [];
    for (let i = 0; i < 3; i++) {
        board[i] = [];
        for (let j = 0; j < 3; j++){
            board[i].push(Cell(i, j));
        }
    }
    
    const getBoard = () => board;

    const dropToken = (player, position) => {
        const isAvailableCell =
            (board[position.row][position.column].getValue() === null) ?
                true : false;
        if (!isAvailableCell) return false;
        board[position.row][position.column].changeValue(player);
        return true;
    }

    return {getBoard, dropToken};
}

function Cell(row, column) {
    let value = null;
    const getValue = () => value;
    const changeValue = (player) => value = player.token;
    const clearValue = () => value = null;

    const position = {row, column};
    const getPosition = () => position;

    return {getValue, changeValue, clearValue, getPosition};
}

function Game() {
    const gameboard = Gameboard();
    const players = [
        {token: 'X'},
        {token: 'O'}
    ];
    let activePlayer = players[0];
    const getActivePlayer = () => activePlayer;
    const switchActivePlayer = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }
    let scores = {X: 0, O: 0};
    const playRound = (position) => {
        let wasDropped = gameboard.dropToken(getActivePlayer(), position);
        let roundWinner = referee();
        if (roundWinner && roundWinner !== "tie") {
            scores[roundWinner]++;
            gameboard.getBoard().forEach(row => {
                row.forEach(cell => {
                    cell.clearValue();
                });
            });
        } else if (roundWinner === "tie") {
            gameboard.getBoard().forEach(row => {
                row.forEach(cell => {
                    cell.clearValue();
                });
            });
        }else if (wasDropped) {
            switchActivePlayer();
        }
        return {roundWinner, scores};
    }
    const referee = () => {
        const board = gameboard.getBoard();
        const lines = [
            // Rows
            [board[0][0], board[0][1], board[0][2]],
            [board[1][0], board[1][1], board[1][2]],
            [board[2][0], board[2][1], board[2][2]],
            // Columns
            [board[0][0], board[1][0], board[2][0]],
            [board[0][1], board[1][1], board[2][1]],
            [board[0][2], board[1][2], board[2][2]],
            // Diagonals
            [board[0][0], board[1][1], board[2][2]],
            [board[2][0], board[1][1], board[0][2]]
        ];

        for (const line of lines) {
            const [a, b, c] = line;
            if (a.getValue() === b.getValue() && b.getValue() === c.getValue() &&
                a.getValue() && b.getValue() && c.getValue()){
                return a.getValue();
            }
        }

        const full = function() {
            return gameboard.getBoard().every(row => row.every(cell => cell.getValue() !== null));
        };
        if (full()) return "tie";
        return null;
    }

    return {getBoard: gameboard.getBoard, getActivePlayer, playRound};
}

function screenController() {
    const game = Game();
    const messageDiv = document.querySelector('.message');
    const boardDiv = document.querySelector('.board');
    let scores = {X: 0, O: 0};
    let winner = null;
    const updateScreen = () => {
        boardDiv.replaceChildren();
        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();
        if (scores.X === 3) winner = 'X';
        if (scores.O === 3) winner = 'O';
        if (!winner) {
            messageDiv.textContent = activePlayer.token +`'s Turn (`+
                "X:" + scores.X + " O:" + scores.O + ")";
        } else {
            messageDiv.textContent = winner + " WINS!";
            scores = {X: 0, O: 0};
        }

        board.forEach(row => {
            row.forEach(cell => {
                const cellButton = document.createElement('button');
                cellButton.classList.add('cell');
                cellButton.textContent = cell.getValue();
                cellButton.addEventListener('click', () => {
                    let result = game.playRound(cell.getPosition());
                    scores = result.scores;
                    let roundWinner = result.roundWinner; 
                    updateScreen();
                });
                boardDiv.append(cellButton);
            });
        });
    }
    return {updateScreen};
}

screenController().updateScreen();