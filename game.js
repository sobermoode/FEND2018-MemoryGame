const cardNames = ['face', 'face', 'bug_report', 'bug_report', 'motorcycle', 'motorcycle', 'radio', 'radio', 'toys', 'toys', 'videogame_asset', 'videogame_asset', 'brightness_5', 'brightness_5', 'looks', 'looks'];
let currentBoard;

const deck = shuffleCards(cardNames);
placeCards(deck);
logCardIcons();

function shuffleCards(cards) {
    let currentIndex = cards.length;
    let tempCard, randoIndex;

    /* NOTE: code promoted from https://stackoverflow.com/a/2450976 */
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

    let cardIndex = 0;
    for (row of rows) {
        const cells = row.cells;

        for (cell of cells) {
            const cardDiv = cell.querySelector('.card');
            const newI = document.createElement('i');
            newI.setAttribute('class', 'material-icons md-96');
            //newI.classList.toggle('icon', cards[cardIndex++]);
            //newI.setAttribute('background-color', 'pink');
            //newI.textContent = cards[cardIndex++];
            newI.setAttribute('icon', cards[cardIndex++]);
            newI.style.backgroundColor = 'pink';
            cardDiv.appendChild(newI);
        }
    }

    // for (const td of table.cells) {
    //     const cardDiv = td.querySelector('card');
    //     const newI = document.createElement('i');
    //     newI.addAttribute('material-icons md-96');
    //     newI.textContent = cards[cardIndex++];
    //     cardDiv.appendChild(newI);
    // }
}

function logCardIcons() {
    const table = document.getElementById('cardTable');
    const rows = table.rows;

    let cardIndex = 0;
    for (row of rows) {
        const cells = row.cells;

        for (cell of cells) {
            const cardDiv = cell.querySelector('.card');
            const i = cardDiv.querySelector('i');
            console.log(i);
            const icon = i.getAttribute('icon');
            // const icon = cardDiv.classList['icon'];
            // if (icon.classList.contains('icon')) {
            //     console.log();
            // }
            console.log(icon);
        }
    }
}
