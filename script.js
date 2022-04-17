const player = () => {
    return {
        mark: this.mark,
        chooseMark() {
            const markBtns = Array.from(document.querySelectorAll('.js-choose-mark-btn'));

            markBtns.forEach(btn => btn.addEventListener('click', (e) => {
                this.mark = e.target.id;
            }));
        }
    }
}

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
humanPlayer.chooseMark();

const computerPlayer = player();
computerPlayer.mark = humanPlayer.mark === 'x' ? 'o' : 'x';