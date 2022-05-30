'use strict';

// gameboard module
const gameBoard = (function() {
    const gameBoardArray = Array.from(document.querySelectorAll('td'));

return {
    gameBoardArray,
}
})();

// game controller module
const gameController = (function() {
    const gameboard = gameBoard.gameBoardArray;

    function getEmptyCells() {
        let emptyCells = gameboard.map(cell => cell.textContent)
        .reduce((arr, elem, index) => {if (elem === '') arr.push(index); return arr;}, []);

        return {
            emptyCells,
        };
    }

    function determineWinner(sequence) {
        //const getEmptyCellsDW = getEmptyCells();

        const winningSequences = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];

        const hasWon = winningSequences.find(
            subarray => subarray.every((elem) => sequence.includes(elem))
        );

        function highlighWinningCombo() {
            hasWon.forEach(elem => gameboard[elem].style.backgroundColor = 'yellow');          
        }

        function disableGameBoard() {
            // if the game is finished, player can't place marks anymore
            gameboard.forEach(elem => elem.style.pointerEvents = 'none');
        }

        function alertWinner() {
            // a mock. will add an actual pop-up later
            alert `win`;
        }

        if (hasWon) {
            disableGameBoard();
            highlighWinningCombo();
            alertWinner();
        // if there are no empty cells left it's a draw
        } else if (getEmptyCells().emptyCells.length === 0) {
            // mock. will add some pop-up later
            alert ('draw');
        }

        return hasWon;  
    }

    function checkTurnComputer() {
        const humanMarks = gameboard.map(cell => cell.textContent)
        .filter(cell => cell == humanPlayer.mark);

        const computerMarks = gameboard.map(cell => cell.textContent)
        .filter(cell => cell == computerPlayer.mark);

        if (!determineWinner(humanPlayer.placedMarks)) {
            if (computerPlayer.mark === 'x') {
                makeMoveComputer();
            } else if (computerPlayer.mark === 'o') {
                if (humanMarks.length > computerMarks.length) {
                    makeMoveComputer();
                }
            }
        }
    }

    function makeMoveComputer() {
        const getEmptyCellsComp = getEmptyCells();

        const randomCell = getRandomCell(getEmptyCellsComp.emptyCells.length);
        const temp = getEmptyCellsComp.emptyCells[randomCell];

        gameboard[temp].textContent = computerPlayer.mark;

        // array with indices of cells marked by computer
        computerPlayer.placedMarks.push(gameboard.indexOf(gameboard[temp]));

        function getRandomCell(max) {
            const randomInt = Math.floor(Math.random() * max);
            return randomInt;
        }

        determineWinner(computerPlayer.placedMarks);
    }

    function makeMoveHuman(callback) {
        gameboard.forEach(cell => cell.addEventListener('click', (e) => {
            // place a mark in the selected cell if it's empty
            if (e.target.textContent === '') {
                e.target.textContent = humanPlayer.mark;

                // store indices of the humanPlayer marks
                humanPlayer.placedMarks.push(gameboard.indexOf(e.target));
                callback();
            }
        }));
    };

    return {
        makeMoveHuman,
        makeMoveComputer,
        checkTurnComputer,
    }
})();


// factory function for creating players
const player = () => {
    const markBtns = Array.from(document.querySelectorAll('.js-choose-mark-btn'));
    const placedMarks = [];

    // as soon as human selects a mark, computer gets a mark assigned to it and checks if it's computer's turn to make a move
    function assignMarkComputer(callback) {
        computerPlayer.mark = humanPlayer.mark === 'x' ? 'o' : 'x';
        callback();
    }

    // disable buttons when player selects a mark
    function disableButtons() {
        markBtns.forEach(btn => btn.addEventListener('click', () => {markBtns.forEach(btn => btn.disabled = true)}, false));
    }

    disableButtons();    
    return {
        mark: this.mark,
        placedMarks,
        chooseMark() {
            markBtns.forEach(btn => btn.addEventListener('click', (e) => {
                this.mark = e.target.id;
                assignMarkComputer(gameController.checkTurnComputer);
            }, false));
        }
    }
}

const humanPlayer = player();
const computerPlayer = player();

humanPlayer.chooseMark();
gameController.makeMoveHuman(gameController.checkTurnComputer);

