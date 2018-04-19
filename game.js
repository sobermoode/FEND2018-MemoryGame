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

// star rating thresholds
const twoStars = 11, oneStar = 14, noStars = 17;

// timer
let didStart = false;
const minutes = document.getElementById('minutes');
const seconds = document.getElementById('seconds');
let elapsedSeconds = 0;
let timerFunction;

/* NOTE: code promoted from https://stackoverflow.com/a/5517836 */
function pad(val) {
  var valString = val + "";
  if (valString.length < 2) {
      return "0" + valString;
  } else {
      return valString;
  }
}

// shuffle the cards and deal out the board
const deck = shuffleCards(cardNames);
placeCards(deck);

// one event handler for the whole table
const cardTable = document.querySelector('#cardTable');
cardTable.addEventListener('click', function(event) {

    // get the ID (currentBoard[] index) of the cell,
    // if any part of the table besides a card cell is clicked, do nothing
    const targetID = event.target.getAttribute('id');

    // do nothing if:
    // - any part of the table besides a card cell is clicked
    // - the user clicks the table while current cards are reverted
    // - the cell is a current selection or already matched
    if (!targetID || cardTableIsInactive || (currentBoard[targetID] === false)) {
        return;
    }

    if (firstTurn) {
        firstID = targetID;
    } else {
        secondID = targetID;
    }

    // get the element holding the icon
    const icon = event.target.querySelector('i');

    // make the icon appear by setting the textContent of it's
    // <i> element to the icon name (in attribute 'icon').
    icon.textContent = icon.getAttribute('icon');

    // this table cell is now inactive
    currentBoard[targetID] = false;

    if (firstTurn) {    // on first turn, remember the choice
        firstChoice = icon;
    } else {            // second turn

        // start the timer (if not already started)
        if (!didStart) {
            didStart = !didStart;

            timerFunction = setInterval(function() {
                seconds.textContent = pad(++elapsedSeconds % 60);
                minutes.textContent = parseInt(elapsedSeconds / 60);
            }, 1000);           // update the elements every second
        }

        secondChoice = icon;    // second selection

        // +1 turn
        updateTurnCounter(++totalTurns);

        if (firstChoice.getAttribute('icon') === icon.getAttribute('icon')) {
            matchCards();       // match!!!

            if (++totalMatches === maxMatches) {    // WINNER!!!
                setTimeout(win(), 500);
            }
        } else {
            revertCards();      // nope...
        }
    }

    // back to the first selection of the next turn
    firstTurn = !firstTurn;
});

// get the panels in the scoreboard
let [starsPanel, timerPanel, turnsPanel] = document.getElementById('scoreboard').children;

// takes the new number of turns
function updateTurnCounter(turns) {

    // set the text of the counter (it's the yellow text) to the turns argument
    turnsPanel.querySelector('.yellowText').textContent = turns;

    // adjust the star rating as necessary
    if (totalTurns === twoStars || totalTurns === oneStar || totalTurns === noStars) {
        loseStar();
    }
}

// turns a star gray, indicating a downgraded rating for solving the puzzle
function loseStar() {

    // get the stars as an array of elements,
    // select the last star
    const stars = starsPanel.getElementsByClassName('yellowText');
    const lastIndex = stars.length - 1;
    const star = stars[lastIndex];

    // swap a class to turn the star gray
    star.classList.remove('yellowText');
    star.classList.add('grayText');
}

// returns the x,y coordinate of a table cell
/* NOTE: code promoted from https://stackoverflow.com/questions/2151084/map-a-2d-array-onto-a-1d-array#comment65016851_2151141 */
function cardTablePositionForCardID(id) {
    let size = cardTable.rows.length;
    let x = id % size;
    let y = (id - id % size) / size;

    return [x, y];
}

// turns two cards green, indicating a match
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

// incorrect match; the cards turn red, then back to pink
// (indicating being hidden, or turned over)
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

// all cards are matched
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

    // stop the timer
    clearInterval(timerFunction);
}

// randomize the array of card names
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

// use the randomized array to set each cell of the table to an icon
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
