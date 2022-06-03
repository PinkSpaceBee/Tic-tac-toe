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

    restartGame();

    function getEmptyCells() {
        // oh I see the issue. The textContent property of the <3 cells is empty. Okay, what is the way around it? Well since I append a child to a cell when I place a mark in it, I can check if the cell has children

        //let testEmpty = gameboard
        // let emptyCells = gameboard.map(cell => cell.textContent)
        // .reduce((arr, elem, index) => {if (elem === '') arr.push(index); return arr;}, []);

        let emptyCells = gameboard.reduce((arr, elem, index) => {if (elem.childNodes.length === 0) arr.push(index); return arr;}, []);


        console.log(`getEmptyC was called ${emptyCells}`);

        return {
            emptyCells,
        };
    }

    function restartGame() {
        // how do I restart a game? well the simplest way is to refresh a page because there are just too many private variables that I would have to make public if I wanted to restart a game without refreshing the page. Buuuut it would be more proper to avoid refreshing the page ig? 
        // mock
        const restartBtn = Array.from(document.querySelectorAll('.js-restart-btn'));
        restartBtn.forEach(btn => btn.addEventListener('click', () => {location.reload()}));
        // ok now to find a way to announce the winner
    }

    function determineWinner(sequence, winner) {
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
            const restartPopUp = document.querySelector('#js-restart-game');
            if (winner === 'x') {
                const xMark = document.createElement('p');
                xMark.classList.add('xMark');
                xMark.innerHTML = '\&times;';

                restartPopUp.prepend(xMark);
            } else if (winner === 'o') {
                const heartIcon = document.createElement('img');
                heartIcon.classList.add('heart-icon');
                heartIcon.src = "https://img.icons8.com/ios-filled/50/undefined/pixel-heart.png";

                restartPopUp.prepend(heartIcon);
            }
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
        if (!determineWinner(humanPlayer.placedMarks, humanPlayer.mark)) {
            if (computerPlayer.mark === 'x') {
                makeMoveComputer();
            } else if (computerPlayer.mark === 'o') {
                if (humanPlayer.placedMarks.length > computerPlayer.placedMarks.length) {
                    makeMoveComputer();
                }
            }
        }
    }

    function makeMoveComputer() {
        const getEmptyCellsComp = getEmptyCells();

        const randomCell = getRandomCell(getEmptyCellsComp.emptyCells.length);
        const temp = getEmptyCellsComp.emptyCells[randomCell];


        if (computerPlayer.mark === 'x') {
            const xMark = document.createElement('p');
            xMark.classList.add('xMark');
            xMark.innerHTML = '\&times;';

            gameboard[temp].appendChild(xMark);
        } else if (computerPlayer.mark === 'o') {
            const heartIcon = document.createElement('img');
            heartIcon.classList.add('heart-icon');
            heartIcon.src = "https://img.icons8.com/ios-filled/50/undefined/pixel-heart.png";

            gameboard[temp].appendChild(heartIcon);
        }

        // array with indices of cells marked by computer
        computerPlayer.placedMarks.push(gameboard.indexOf(gameboard[temp]));

        function getRandomCell(max) {
            const randomInt = Math.floor(Math.random() * max);
            return randomInt;
        }

        determineWinner(computerPlayer.placedMarks, computerPlayer.mark);
    }

    function makeMoveHuman(callback) {
        gameboard.forEach(cell => cell.addEventListener('click', (e) => {

            // place a mark in the selected cell if it's empty;
            if (e.target.childNodes.length === 0 && e.target.tagName !== 'IMG' && humanPlayer.mark !== undefined) {

                if (humanPlayer.mark === 'x') {
                    const xMark = document.createElement('p');
                    xMark.classList.add('xMark');
                    xMark.innerHTML = '\&times;';

                    e.target.appendChild(xMark);

                } else if (humanPlayer.mark === 'o') {
                    const heartIcon = document.createElement('img');
                    heartIcon.classList.add('heart-icon');
                    heartIcon.src = "https://img.icons8.com/ios-filled/50/undefined/pixel-heart.png";
    
                    e.target.appendChild(heartIcon);
                }

                // store indices of the humanPlayer marks
                humanPlayer.placedMarks.push(gameboard.indexOf(e.target));
                console.log(`humanMarks ${humanPlayer.placedMarks.length} ${humanPlayer.placedMarks} ${humanPlayer.mark}`);
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

