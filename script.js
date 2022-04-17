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
console.log(`human ${humanPlayer.mark}`);


//const computerPlayer  = player();
//computerPlayer.mark = humanPlayer.mark = 'x' ? 'o' : 'x';

//console.log(`human: ${humanPlayer.mark}; computer: ${computerPlayer.mark}`)

/*
const greeter = () => {
    return {
        mark: this.mark, 
        greet() {
            const btns = Array.from(document.querySelectorAll('.x'));
            btns.forEach(btn => btn.addEventListener('click', (e) => {
                this.mark = e.target.id;
                //name = 'q';
                //console.log(e.target)
            }))
            //return `Hi, my name is ${name}`;
        }
    }
}

const human = greeter();
human.greet();
*/