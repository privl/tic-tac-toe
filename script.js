function Gameboard() {
    const board = [];
    for (let i = 0; i < 3; i++) {
        board[i] = [];
        for (let j = 0; j < 3; j++){
            board[i].push(Cell());
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

function Cell() {
    let value = '';
    const getValue = () => value;
    const changeValue = (player) => value = player.getToken();

    return {getValue, changeValue};
}