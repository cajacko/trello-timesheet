import Trello from 'src/modules/Trello';
import Database from 'src/modules/Database';

class Cards {
  constructor(trello, database) {
    console.log('Cards - constructor');

    if (!(trello instanceof Trello))
      throw new Error('Cards expects and instance of Trello');

    if (!(database instanceof Database))
      throw new Error('Cards expects and instance of Database');

    this.trello = trello;
    this.database = database;

    this.setCards = this.setCards.bind(this);
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
}

export default Cards;
