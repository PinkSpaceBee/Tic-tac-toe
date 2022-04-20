'use strict'

// a factory function for creating players
const player = () => {
    const markBtns = Array.from(document.querySelectorAll('.js-choose-mark-btn'));

    function assignMarkComputer() {
        computerPlayer.mark = humanPlayer.mark === 'x' ? 'o' : 'x';
    }

    return {
        mark: this.mark,
        chooseMark() {
            markBtns.forEach(btn => btn.addEventListener('click', (e) => {
                this.mark = e.target.id;
            }, false));
            markBtns.forEach(btn => btn.addEventListener('click', assignMarkComputer, false));
        }
    }
}

// gameboard module
const gameBoard = (function() {
    function render() {
        const gameBoardArray = Array.from(document.querySelectorAll('td'));
        // I'm making a tic-tac-toe gameboard mock. Dots represent
        // empty cells.
        gameBoardArray.forEach(elem => elem.textContent = '.');
        return gameBoardArray;
    }

return {
    render
}
})();

gameBoard.render();

const humanPlayer = player();
const computerPlayer = player();

humanPlayer.chooseMark();
