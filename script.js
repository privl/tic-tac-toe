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
            (board[position.row][position.column].getValue() === '') ?
                true : false;
        if (!isAvailableCell) return;
        board[position.row][position.column].changeValue(player);
    }

    return {getBoard, dropToken};
}

function Cell(row, column) {
    let value = '';
    const getValue = () => value;
    const changeValue = (player) => value = player.token;

    const position = {row, column};
    const getPosition = () => position;

    return {getValue, changeValue, getPosition};
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
        activePlayer = players[0] ? players[1] : players[0];
    }
    const playRound = (position) => {
        gameboard.dropToken(getActivePlayer(), position);
        switchActivePlayer();
    }
    return {getBoard: gameboard.getBoard, getActivePlayer, playRound};
}

function screenController() {
    const game = Game();
    const messageDiv = document.querySelector('.message');
    const boardDiv = document.querySelector('.board');
    const updateScreen = () => {
        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();
        messageDiv.textContent = activePlayer.token +`'s Turn`;
        board.forEach((row, rowIndex) => {
            row.forEach((cell, columnIndex) => {
            const cellButton = document.createElement('button');
            cellButton.classList.add('cell');
            cellButton.dataset.row = rowIndex;
            cellButton.dataset.column = columnIndex;
            cellButton.textContent = cell.getValue();
            cellButton.addEventListener('click', )
            boardDiv.append(cellButton);
            })
        })
    }
    return {updateScreen};
}

screenController().updateScreen();