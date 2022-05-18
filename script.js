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

        console.log(`getEmptyCells was called ${emptyCells}`);

        return {
            emptyCells,
        };
    }

    function checkTurnComputer() {
        const humanMarks = gameboard.map(cell => cell.textContent)
        .filter(cell => cell == humanPlayer.mark);

        const computerMarks = gameboard.map(cell => cell.textContent)
        .filter(cell => cell == computerPlayer.mark);

        if (computerPlayer.mark === 'x') {
            makeMoveComputer();
        } else if (computerPlayer.mark === 'o' && !determineWinner(humanPlayer.placedMarks)) {
            if (humanMarks.length > computerMarks.length ) {
                makeMoveComputer();
                console.log(`0 hasWon ${humanPlayer.placedMarks}`);
                console.log(`0 hasWon ${determineWinner(humanPlayer.placedMarks)}`);
            }
        }
        console.log(`checkTurnComputer was called`);
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

        console.log('makeMoveComputer was called');
        // if I don't call this function here, a draw doesn't get announced for some reason
        //return getEmptyCells();
        determineWinner(computerPlayer.placedMarks);
    }

    function makeMoveHuman(callback) {

        gameboard.forEach(cell => cell.addEventListener('click', (e) => {
            // place a mark in the selected cell if it's empty
            if (e.target.textContent === '') {
                e.target.textContent = humanPlayer.mark;

                // store indices of the humanPlayer marks
                humanPlayer.placedMarks.push(gameboard.indexOf(e.target));
            }
            //computer can't place a mark if the game is already finished
            if (!determineWinner(humanPlayer.placedMarks)) {
                //console.log(`computer can move ${!determineWinner(humanPlayer.placedMarks)}`);
                callback();
            }
            //callback();
            //determineWinner(humanPlayer.placedMarks);
        }));
    };

    function determineWinner(sequence) {
        // OH SHIT FORGOT ABOUT DRAW
        // well I can check for empty cells. If there no empty cells left and hasWon is undefined then it's a draw. BTW where did I picked up this draw thing? Since when I call it a draw and not a tie?

        const getEmptyCellsDW = getEmptyCells();

        const winningSequences = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
        // I spend ungodly amounts of time thinking of variable names. Like, how should I name this one? winningCells? hasWon? winCombo? Aaaaagrh. currentWin? Ah whatever
        const hasWon = winningSequences.find(
            subarray => subarray.every((elem) => sequence.includes(elem))
        );

        function alertWinner() {
            // a mock
            alert `win`;
        }

        function highlighWinningCombo() {
            // yeah I stopped caring about variable names
            // a mock; will add actual styles later
            hasWon.forEach(elem => gameboard[elem].style.backgroundColor = 'yellow');          
        }

        function disableGameBoard() {
            // if the game is finished, player can't place marks anymore
            gameboard.forEach(elem => elem.style.pointerEvents = 'none');
        }



        // if there's no empty cells left and no winner then it's a draw
        if (getEmptyCellsDW.emptyCells.length === 0 && !hasWon) {
            // a mock. I'll add some pop up later I guess. 
            alert ('drrrrraw');
            console.log(`hasWon ${hasWon} !!hasWon ${!!hasWon}`);
        } else if (hasWon) {
            highlighWinningCombo();
            alertWinner();
            disableGameBoard();
        }
    }

    return {
        makeMoveHuman,
        makeMoveComputer,
        checkTurnComputer,
        //determineWinner,
    }
})();

// a factory function for creating players
const player = () => {
    const markBtns = Array.from(document.querySelectorAll('.js-choose-mark-btn'));
    const placedMarks = [];

    function assignMarkComputer(callback) {
        computerPlayer.mark = humanPlayer.mark === 'x' ? 'o' : 'x';
        console.log(`assignMarkComp was called comp ${computerPlayer.mark}`);
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
                console.log(`chooseMark was called human ${humanPlayer.mark}`);
                // as soon as human selects a mark, computer gets a mark assigned to it and checks if it's computer's turn to make a move
                assignMarkComputer(gameController.checkTurnComputer);
            }, false));
        }
    }
}

const humanPlayer = player();
const computerPlayer = player();

humanPlayer.chooseMark();

gameController.makeMoveHuman(gameController.checkTurnComputer);
//gameController.makeMoveHuman(gameController.checkTurnComputer);

//oh great I broke something. 

// Umm 'redeclaration of const player'? Where? I commented the whole fucking code and I still get this syntax error. Ooooh I get it now. It's rather funny - I happened to accidentally duplicate the part of the html markup that includes script tag, so I basically tried to open script.js file twice, that's why I kept getting the error on the line 1. Funny stuff actually.

// Oh shit. It appears that I've been invoking the funking function and not just assigning it to a variable, ffs. If you use (), you call the function, that's it. Okay. now that I know that I had been invoking the function an ungodly number of times, now what? 



