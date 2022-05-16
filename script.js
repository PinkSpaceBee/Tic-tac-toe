'use strict';

// gameboard module
const gameBoard = (function() {
    const gameBoardArray = Array.from(document.querySelectorAll('td'));
    console.log('gameBoard was called')
    // but elem.textContent IS empty, why did I write this function? 
    // function render() {
    //     gameBoardArray.forEach(elem => elem.textContent = '');
    //     return gameBoardArray;
    // }

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
            console.log(`c ${computerPlayer.mark} hMl ${humanMarks.length}`);
            makeMoveComputer();
        } else if (computerPlayer.mark === 'o') {
            console.log(`c ${computerPlayer.mark} hMl ${humanMarks.length}`);
            makeMoveComputer();
        }
        console.log(`checkTurnComputer was called`);
    }

    function makeMoveComputer() {
        // count empty cells
        function getEmptyCells() {
            let emptyCells = gameboard.map(cell => cell.textContent)
            .reduce((arr, elem, index) => {if (elem === '') arr.push(index); return arr;}, []);

            console.log(`getEmptyCells was called ${emptyCells} l ${emptyCells.length}`);
            return emptyCells;
        }

        function getRandomCell(max) {
            // wait what? isn't max always an integer?
            //max = Math.floor(max);
            const randomInt = Math.floor(Math.random() * max);
            console.log(`getRandomCell was called ${randomInt}`);
            return randomInt;
        }

        getEmptyCells();
        const randomCell = getRandomCell(getEmptyCells().length);
        console.log(`randomCell ${randomCell}`);

        const temp = getEmptyCells()[randomCell];
        //console.log(temp);

        gameboard[temp].textContent = computerPlayer.mark;

        console.log('makeMoveComputer was called');
    }

    function makeMoveHuman(callback) {
        const humanMarks = gameboard.map(cell => cell.textContent)
        .filter(cell => cell === humanPlayer.mark);

        gameboard.forEach(cell => cell.addEventListener('click', (e) => {
            // place a mark in the selected cell if it's empty
            if (e.target.textContent === '') {
                e.target.textContent = humanPlayer.mark;
                console.log(`makeMoveHuman was called`);
            }
            callback();
        }));
    };

    function determineWinner() {}

    return {
        makeMoveHuman,
        makeMoveComputer,
        checkTurnComputer,
    }
})();

// a factory function for creating players
const player = () => {
    const markBtns = Array.from(document.querySelectorAll('.js-choose-mark-btn'));

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



