// const Player = (mark) = {
    
// }

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