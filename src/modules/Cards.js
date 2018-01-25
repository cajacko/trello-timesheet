import Trello from 'src/modules/Trello';
import Database from 'src/modules/Database';
import getAllDatesFromStart from 'src/helpers/getAllDatesFromStart';

class Cards {
  constructor(trello, database) {
    console.log('Cards - constructor');

    this.cardCache = {};

    if (!(trello instanceof Trello))
      throw new Error('Cards expects and instance of Trello');

    if (!(database instanceof Database))
      throw new Error('Cards expects and instance of Database');

    this.trello = trello;
    this.database = database;

    this.setCards = this.setCards.bind(this);
    this.getSuggestions = this.getSuggestions.bind(this);
    this.saveChanges = this.saveChanges.bind(this);
    this.updateCardsInDatabase = this.updateCardsInDatabase.bind(this);
    this.search = this.search.bind(this);
    this.getCard = this.getCard.bind(this);
    this.clearCache = this.clearCache.bind(this);
  }

  updateCardsInDatabase() {
    console.log('Cards - updateCardsInDatabase');

    const now = new Date();

    return this.database
      .getLastUpdatedDate()
      .then(lastModified => {
        const date = lastModified ? new Date(lastModified) : null;

        return this.getModifedSinceDate(date, now);
      })
      .then(this.setCards)
      .then(() => this.database.setLastUpdatedDate(now));
  }

  getModifedSinceDate(date = null, now) {
    console.log('Cards - getModifedSinceDate', date, now);

    if (!date) {
      return this.trello.getAllCardsFromOrganisations();
    }

    return this.trello.getAllCardsModifiedSinceDate(date, now);
  }

  setCards(cards) {
    console.log('Cards - setCards', cards);

    const promises = [];

    cards.forEach(card => {
      promises.push(this.database.set(`/cards/${card.id}`, card));
    });

    return Promise.all(promises);
  }

  getSuggestions(date) {
    console.log('Cards - getSuggestions');
    const days = getAllDatesFromStart(date).map(({ dateString }) => dateString);

    const promises = [];

    promises.push(this.getCardsOnDates(days));

    promises.push(
      this.database
        .getCards()
        .then(cards => Object.keys(cards).map(id => cards[id])),
    );

    return Promise.all(promises)
      .then(results => {
        const cardIds = {};
        const cardsArr = [];

        const addCards = card => {
          if (cardIds[card.id]) return;

          cardsArr.push(card);
          cardIds[card.id] = true;
        };

        results[0].forEach(cards => {
          if (cards) {
            cards.forEach(addCards);
          }
        });

        results[1].forEach(addCards);

        return cardsArr;
      })
      .then(this.clearCache);
  }

  getCardsOnDates(dates) {
    const promises = dates.map(dateString => {
      return this.database
        .getOnce(`/cardsByDate/${dateString}`)
        .then(
          cards =>
            cards &&
            Promise.all(
              Object.keys(cards).map(cardId => this.getCard(cardId, true)),
            ),
        );
    });

    return Promise.all(promises);
  }

  clearCache(response) {
    this.cardCache = {};
    return response;
  }

  saveChanges(changes) {
    console.log('Cards - saveChanges', changes);
    return this.database.updateCardTimes(changes);
  }

  getCardDateTime(id, date) {
    const timeId = `${id}-${date}`;

    return this.database.getTime(timeId);
  }

  search(searchText, callback) {
    this.database.searchCardsByName(searchText, callback);
  }

  getCard(cardId, useCache) {
    if (useCache && this.cardCache[cardId])
      return Promise.resolve(this.cardCache[id]);

    return this.database.getOnce(`/cards/${cardId}`).then(card => {
      if (useCache) this.cardCache[cardId] = card;

      return card;
    });
  }
}

export default Cards;
