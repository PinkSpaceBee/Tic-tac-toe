'use strict';

// a factory function for creating players
const player = () => {
    const markBtns = Array.from(document.querySelectorAll('.js-choose-mark-btn'));

    function assignMarkComputer() {
        computerPlayer.mark = humanPlayer.mark === 'x' ? 'o' : 'x';
        if (computerPlayer.mark === 'x') {
            // Ahaaa. I call test() in a different scope, that's why randomCell and emptyCells are undefined. Gods, I should have noticed it way earlier. So what do I do? I suppose I can make use of closure somehow. 
            gameController.test();
        }
        console.log(`assignMarkComp was called`);
    }

    // disable buttons when player selects a mark
    function disableButtons() {
        markBtns.forEach(btn => btn.addEventListener('click', () => {markBtns.forEach(btn => btn.disabled = true)}, false));
    }

    return {
        mark: this.mark,
        // do I have to make markBtns public? check later 
        markBtns,
        chooseMark() {
            markBtns.forEach(btn => btn.addEventListener('click', (e) => {
                this.mark = e.target.id;
                console.log(`chooseMark was called`);
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
    // I don't remember why did I move these variables to the outer scope
    //const emptyCells = makeMoveComputer();
    //emptyCells.getEmptyCells();

    function determineWinner() {
        // a mock; will change later
        console.log(`determineWinner was called`);
        return true;
    }

    function makeMoveHuman() {
        gameboard.forEach(cell => cell.addEventListener('click', (e) => {
            // humanPlayer can place a mark only in an empty cell 
            if (e.target.textContent === '') {
                e.target.textContent = humanPlayer.mark;
            }
        }))

        console.log(`makeMoveHuman was called`);
    }

    function makeMoveComputer() {

        function checkTurn() {
            const humanMarks = gameboard.map(cell => cell.textContent)
            .filter(cell => cell == humanPlayer.mark);

            const computerMarks = gameboard.map(cell => cell.textContent)
            .filter(cell => cell == computerPlayer.mark);

            console.log(`checkTurn was called ${humanMarks.length > computerMarks.length}`);
            //return humanMarks.length > computerMarks.length;
            switch (humanPlayer.mark) {
                case 'x': 
                console.log('case x');
                return humanMarks.length > computerMarks.length;
                break;

                case 'o': 
                console.log('case o');
                return computerMarks.length > humanMarks.length;
                break;
            }
        }

        function getEmptyCells() {
            let emptyCells = gameboard.map(cell => cell.textContent)
            .reduce((arr, elem, index) => {if (elem === '') arr.push(index); return arr;}, []);

            console.log(`getEmptyCells was called ${emptyCells}`);
            return emptyCells;
        }

        function getRandomCell(max) {
            max = Math.floor(max);
            // check if I need +1 in this line 
            console.log(`getRandomCell was called`);
            return Math.floor(Math.random() * max);
        }

        const emptyCells = getEmptyCells();
        const randomCell = getRandomCell(emptyCells.length);

        gameboard.forEach(cell => cell.addEventListener('click', () => {
            if (checkTurn()) {
                console.log(`computer's turn ${computerPlayer.mark} ${randomCell}`);

                let temp = emptyCells[randomCell];
                console.log(temp);

                gameboard[temp].textContent = computerPlayer.mark;
            };
        })); 

console.log(`makeMoveComp was called`);
return {
    getEmptyCells,
    getRandomCell,
}
    }


    function test() {
        // okay this is hilarious. I'm trying to find a way for an IMMIDEATELY INVOKED function expression not to be invoked immidiately. If not for my attempts to understand the module pattern and make it work I would ditch the whole IIFE thing. 
        // Oh. So I want to make randomCell variable global (well, function-level global) so I could call it from here. 
        gameboard[2].textContent = computerPlayer.mark;
        console.log
        //console.log(`test was called ${randomCell}`);
    }

    // Well shit I forgot what I was doing. I remember that I tried to use closure to get the result I wanted but failed? Well, have to brush up my knowledge on scopes and closures. 

    return {
        gameboard,
        makeMoveHuman,
        makeMoveComputer,
        determineWinner,
        test,
    }
})();

gameBoard.render();

const humanPlayer = player();
const computerPlayer = player();

humanPlayer.chooseMark();


gameController.makeMoveHuman();
gameController.makeMoveComputer();

//oh great I broke something. 
//Found a bag. Apparently if randomCell equals 0, computer can make the first move even if its mark is o. Yep, I managed to reproduce it. Wellll, how do I fix it? I suppose the computer thinks that the cell is empty and makes a move. Player, in his turn, sees that the cell is taken and doesn't mark it. I don't like that the functions execute in the wrong order. If not for that, I wouldn't encounter these issues. 
// Umm 'redeclaration of const player'? Where? I commented the whole fucking code and I still get this syntax error



