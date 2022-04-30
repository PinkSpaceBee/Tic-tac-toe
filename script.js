'use strict';

// a factory function for creating players
const player = () => {
    const markBtns = Array.from(document.querySelectorAll('.js-choose-mark-btn'));

    function assignMarkComputer() {
        computerPlayer.mark = humanPlayer.mark === 'x' ? 'o' : 'x';
    }

    // disable buttons when player selects a mark
    function disableButtons() {
        markBtns.forEach(btn => btn.addEventListener('click', () => {markBtns.forEach(btn => btn.disabled = true)}, false));
    }

    return {
        mark: this.mark,
        chooseMark() {
            markBtns.forEach(btn => btn.addEventListener('click', (e) => {
                this.mark = e.target.id;
            }, false));
            
            markBtns.forEach(btn => btn.addEventListener('click', assignMarkComputer, false));

            disableButtons();
        }
    }
}

// gameboard module
const gameBoard = (function() {
    const gameBoardArray = Array.from(document.querySelectorAll('td'));
    function render() {
        // I'm making a tic-tac-toe gameboard mock. Dots represent empty cells.
        gameBoardArray.forEach(elem => elem.textContent = '');
        return gameBoardArray;
    }

return {
    gameBoardArray,
    render
}
})();

// game controller module
const gameController = (function() {
    const gameboard = gameBoard.gameBoardArray;

    function makeMoveHuman() {
        gameboard.forEach(cell => cell.addEventListener('click', (e) => {
            // humanPlayer can place a mark only in an empty cell 
            if (e.target.textContent === '') {
                e.target.textContent = humanPlayer.mark;
            }
        }))
    }

    function makeMoveComputer() {

        function checkTurn() {
            const humanMarks = gameboard.map(cell => cell.textContent)
            .filter(cell => cell == humanPlayer.mark);

            const computerMarks = gameboard.map(cell => cell.textContent)
            .filter(cell => cell == computerPlayer.mark);

            return humanMarks.length > computerMarks.length;
        }

        function getEmptyCells() {
            let emptyCells = gameboard.map(cell => cell.textContent)
            .reduce((arr, elem, index) => {if (elem === '') arr.push(index); return arr;}, []);

            return emptyCells;
        }

        function getRandomCell(max) {
            max = Math.floor(max);
            // check if I need +1 in this line 
            return Math.floor(Math.random() * max);
        }

        gameboard.forEach(cell => cell.addEventListener('click', () => {
            if (checkTurn()) {
                const emptyCells = getEmptyCells();
                let randomCell = getRandomCell(emptyCells.length);
                let temp = emptyCells[randomCell];

                gameboard[temp].textContent = computerPlayer.mark;
            };
        }));
    }

    return {
        gameboard,
        makeMoveHuman,
        makeMoveComputer
    }
})();

gameBoard.render();

const humanPlayer = player();
const computerPlayer = player();

humanPlayer.chooseMark();

gameController.makeMoveHuman();
gameController.makeMoveComputer();