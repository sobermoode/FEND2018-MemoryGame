const cardNames = ['face', 'face', 'bug_report', 'bug_report', 'motorcycle', 'motorcycle', 'radio', 'radio', 'toys', 'toys', 'videogame_asset', 'videogame_asset', 'brightness_5', 'brightness_5', 'looks', 'looks'];

const deck = shuffleCards(cardNames);


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

function placeCards(cards) {
    const table = document.getElementById('cardTable');
    let cardIndex = 0;

    for (const td of table.cells) {
        td.
    }
    for (const card of cards) {

    }
}

console.log(deck);
