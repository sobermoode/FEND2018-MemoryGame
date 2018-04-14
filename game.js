// the names of the material icons used for the cards (2x each)
const cardNames = ['face', 'face', 'bug_report', 'bug_report', 'motorcycle', 'motorcycle', 'radio', 'radio', 'toys', 'toys', 'videogame_asset', 'videogame_asset', 'brightness_5', 'brightness_5', 'looks', 'looks'];

// the state of the cards currently on the board
// (all active to start)
let currentBoard = [ true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true ];
let firstTurn = true;
let firstChoice;
let totalTurns = 0;

// shuffle the cards and deal out the board
const deck = shuffleCards(cardNames);
placeCards(deck);

// one event handler for the whole table
const cardTable = document.querySelector('#cardTable');
cardTable.addEventListener('click', function(event) {
    console.log(event.target);

    // get the element holding the icon
    const icon = event.target.querySelector('i');

    // get the cell number
    const cellIndex = Number(icon.getAttribute('id'));
    console.log(cellIndex);

    // if cell is inactive, do nothing
    //const isInactive = (currentBoard[cellIndex] === 0);
    if (currentBoard[cellIndex] === false) {
        console.log('returning...');
        return;
    }

    console.log('not returning...');

    // make the icon appear by setting the textContent of it's
    // <i> element to the icon name (in attribute 'icon').
    icon.textContent = icon.getAttribute('icon');

    // this table cell is now inactive
    currentBoard[cellIndex] = false;

    if (firstTurn) {    // on first turn, remember the choice
        firstChoice = icon.getAttribute('icon');
    } else {            // on second turn, see if there's a match
        if (firstChoice === icon.getAttribute('icon')) {
            matchCards();
        } else {
            revertCards();
        }
    }

    totalTurns++;
    firstTurn = !firstTurn;

    console.log(currentBoard);
});

function matchCards() {
    console.log('MATCH!!!');
}

function revertCards() {
    console.log('nope...');
}

function win() {
    console.log('WIN!!!');
}

/* NOTE: code promoted from https://stackoverflow.com/a/2450976 */
function shuffleCards(cards) {
    let currentIndex = cards.length;
    let tempCard, randoIndex;

    // while there remain elements to shuffle...
    while (currentIndex !== 0) {
        // Pick a remaining element...
        randoIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        tempCard = cards[currentIndex];
        cards[currentIndex] = cards[randoIndex];
        cards[randoIndex] = tempCard;
    }

    return cards;
}

/* NOTE: use a document fragment here, to avoid tons of reflows and repaints!!! */
function placeCards(cards) {
    const table = document.getElementById('cardTable');
    const rows = table.rows;

    // for every row...
    let cardIndex = 0;
    for (row of rows) {
        const cells = row.cells;

        // and every cell in that row...
        for (cell of cells) {

            // ID each cell
            const cellID = String(cardIndex);
            console.log("cellID: ", cellID);
            //cell.setAttribute('id', cellID);
            console.log(cell.cellIndex);

            // create the material icon (requires an <i> element)
            const newI = document.createElement('i');
            newI.setAttribute('class', 'material-icons md-96');

            // add the card name for retrieval later
            newI.setAttribute('icon', cards[cardIndex++]);

            newI.style.backgroundColor = 'pink';

            // add the material icon to the cell
            const cardDiv = cell.querySelector('.card');
            cardDiv.appendChild(newI);
        }
    }
}
