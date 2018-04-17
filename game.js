// the names of the material icons used for the cards (2x each)
const cardNames = ['face', 'face', 'bug_report', 'bug_report', 'motorcycle', 'motorcycle', 'radio', 'radio', 'toys', 'toys', 'videogame_asset', 'videogame_asset', 'brightness_5', 'brightness_5', 'looks', 'looks'];

// the state of the cards currently on the board
// (all active to start)
let currentBoard = [ true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true ];

let firstTurn = true;
let firstID, secondID;
let firstChoice, secondChoice;
let maxMatches = cardNames.length / 2, totalMatches = 0, totalTurns = 0;

// disable clicks on the table while cards are being reverted
let cardTableIsInactive = false;

// shuffle the cards and deal out the board
const deck = shuffleCards(cardNames);
placeCards(deck);

// one event handler for the whole table
const cardTable = document.querySelector('#cardTable');
cardTable.addEventListener('click', function(event) {

    // do nothing if the user clicks the table while current cards are reverted
    if (cardTableIsInactive) {
        return;
    }

    // get the ID (currentBoard[] index) of the cell,
    // if any part of the table besides a card cell is clicked, do nothing
    const targetID = event.target.getAttribute('id');
    if (!targetID) { return; }

    if (firstTurn) {
        firstID = targetID;
    } else {
        secondID = targetID;
    }

    // if cell is inactive, do nothing
    const isInactive = (currentBoard[targetID] === false);
    if (isInactive) { return; }

    // get the element holding the icon
    const icon = event.target.querySelector('i');

    // make the icon appear by setting the textContent of it's
    // <i> element to the icon name (in attribute 'icon').
    icon.textContent = icon.getAttribute('icon');

    // this table cell is now inactive
    currentBoard[targetID] = false;

    if (firstTurn) {    // on first turn, remember the choice
        firstChoice = icon;
    } else {            // on second turn, see if there's a match
        secondChoice = icon;

        if (firstChoice.getAttribute('icon') === icon.getAttribute('icon')) {
            matchCards();       // match!!!

            if (++totalMatches === maxMatches) {    // WINNER!!!
                setTimeout(win(), 500);
            }
        } else {
            revertCards();      // nope...
        }
    }

    // next turn, first choice
    totalTurns++;
    firstTurn = !firstTurn;
});

/* NOTE: code promoted from https://stackoverflow.com/questions/2151084/map-a-2d-array-onto-a-1d-array#comment65016851_2151141 */
function cardTablePositionForCardID(id) {
    let size = cardTable.rows.length;
    let x = id % size;
    let y = (id - id % size) / size;

    return [x, y];
}

function matchCards() {
    let [x, y] = cardTablePositionForCardID(firstID);
    let cell = cardTable.rows[y].cells[x];
    cell.style.backgroundColor = 'lightGreen';
    cell.querySelector('i').style.backgroundColor = 'lightGreen';

    [x, y] = cardTablePositionForCardID(secondID);
    cell = cardTable.rows[y].cells[x];
    cell.style.backgroundColor = 'lightGreen';
    cell.querySelector('i').style.backgroundColor = 'lightGreen';
}

function revertCards() {

    // prevent the card table from performing anything on a click event
    cardTableIsInactive = true;

    let [x, y] = cardTablePositionForCardID(firstID);
    let cell = cardTable.rows[y].cells[x];
    cell.style.backgroundColor = 'red';
    cell.querySelector('i').style.backgroundColor = 'red';

    [x, y] = cardTablePositionForCardID(secondID);
    cell = cardTable.rows[y].cells[x];
    cell.style.backgroundColor = 'red';
    cell.querySelector('i').style.backgroundColor = 'red';

    setTimeout(function() {
        firstChoice.textContent = '';
        currentBoard[firstID] = true;

        secondChoice.textContent = '';
        currentBoard[secondID] = true;

        [x, y] = cardTablePositionForCardID(firstID);
        cell = cardTable.rows[y].cells[x];
        cell.style.backgroundColor = 'pink';
        cell.querySelector('i').style.backgroundColor = 'pink';

        [x, y] = cardTablePositionForCardID(secondID);
        cell = cardTable.rows[y].cells[x];
        cell.style.backgroundColor = 'pink';
        cell.querySelector('i').style.backgroundColor = 'pink';

        // make the card table active again
        cardTableIsInactive = false;
    }, 500);
}

function win() {

    // all the cards turn blue as a visual indicator
    for (row of cardTable.rows) {
        for (cell of row.cells) {
            cell.style.backgroundColor = 'lightBlue';
            cell.querySelector('i').textContent = '';
        }
    }

    // pop up the win modal
    const modal = document.querySelector('#winModal');
    modal.style.zIndex = 1;
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
    let rowCounter = 0;
    for (row of rows) {
        const cells = row.cells;

        // and every cell in that row...
        for (cell of cells) {

            // ID each cell
            /* NOTE: code promoted from https://stackoverflow.com/a/2151141 */
            const cellID = cell.cellIndex + rowCounter * row.cells.length;
            cell.setAttribute('id', cellID);

            // create the material icon (requires an <i> element)
            const newI = document.createElement('i');
            newI.setAttribute('class', 'material-icons md-96');
            newI.setAttribute('id', cellID);

            // add the card name for retrieval later
            newI.setAttribute('icon', cards[cellID]);

            newI.style.backgroundColor = 'pink';

            // add the material icon to the cell
            const cardDiv = cell.querySelector('.card');
            cardDiv.setAttribute('id', cellID);
            cardDiv.appendChild(newI);
        }

        rowCounter++;
    }
}
