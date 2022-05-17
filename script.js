'use strict';

// gameboard module
const gameBoard = (function() {
    const gameBoardArray = Array.from(document.querySelectorAll('td'));
    console.log('gameBoard was called')

return {
    gameBoardArray,
}
})();

// game controller module
const gameController = (function() {
    const gameboard = gameBoard.gameBoardArray;

    function checkTurnComputer() {
        const humanMarks = gameboard.map(cell => cell.textContent)
        .filter(cell => cell == humanPlayer.mark);

        const computerMarks = gameboard.map(cell => cell.textContent)
        .filter(cell => cell == computerPlayer.mark);

        if (computerPlayer.mark === 'x') {
            makeMoveComputer();
        } else if (computerPlayer.mark === 'o') {
            if (humanMarks.length > computerMarks.length) {
                makeMoveComputer();
            }
        }
        console.log(`checkTurnComputer was called`);
    }

    function makeMoveComputer() {
        getEmptyCells();
        const randomCell = getRandomCell(getEmptyCells().length);
        const temp = getEmptyCells()[randomCell];;

        gameboard[temp].textContent = computerPlayer.mark;
        computerPlayer.placedMarks.push(gameboard.indexOf(gameboard[temp]));
        console.log(`comp indices ${computerPlayer.placedMarks}`);

        function getEmptyCells() {
            let emptyCells = gameboard.map(cell => cell.textContent)
            .reduce((arr, elem, index) => {if (elem === '') arr.push(index); return arr;}, []);

            console.log(`getEmptyCells was called ${emptyCells} l ${emptyCells.length}`);
            return emptyCells;
        }

        function getRandomCell(max) {
                const randomInt = Math.floor(Math.random() * max);
                console.log(`getRandomCell was called ${randomInt}`);
                return randomInt;
        }

        console.log(`randomCell ${randomCell}`);
        console.log('makeMoveComputer was called');

        // okay wtf is test? ugh when will I learn to give variables meaningful names ffs
        //const test = [];
        // gameboard.forEach(cell => {
        //     //test.push(cell.textContent);

        // });

        determineWinner();
    }

    function makeMoveHuman(callback) {

        gameboard.forEach(cell => cell.addEventListener('click', (e) => {
            // place a mark in the selected cell if it's empty
            if (e.target.textContent === '') {
                e.target.textContent = humanPlayer.mark;

                // store indices of the humanPlayer marks
                humanPlayer.placedMarks.push(gameboard.indexOf(e.target));
                console.log(`makeMoveHuman was called ${humanPlayer.placedMarks}`);
            }
            callback();
        }));
        determineWinner();
    };

    function determineWinner() {
        //const winningSequence = [[0,1,2]]
        console.log('unicorn');
    }

    return {
        makeMoveHuman,
        makeMoveComputer,
        checkTurnComputer,
        determineWinner,
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
                // as soon as human selects a mark, computer gets a mark assigned to it
                assignMarkComputer(gameController.checkTurnComputer);
            }, false));
        }
    }
}

const humanPlayer = player();
const computerPlayer = player();

humanPlayer.chooseMark();

gameController.makeMoveHuman(gameController.makeMoveComputer);
//gameController.checkTurnComputer();

//oh great I broke something. 
//Found a bag. Apparently if randomCell equals 0, computer can make the first move even if its mark is o. Yep, I managed to reproduce it. Wellll, how do I fix it? I suppose the computer thinks that the cell is empty and makes a move. Player, in his turn, sees that the cell is taken and doesn't mark it. I don't like that the functions execute in the wrong order. If not for that, I wouldn't encounter these issues. 
// Umm 'redeclaration of const player'? Where? I commented the whole fucking code and I still get this syntax error. Ooooh I get it now. It's rather funny - I happened to accidentally duplicate the part of the html markup that includes script tag, so I basically tried to open script.js file twice, that's why I kept getting the error on the line 1. Funny stuff actually. 



