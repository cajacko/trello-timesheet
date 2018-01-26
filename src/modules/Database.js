import { initializeApp, database } from 'firebase';
import getFloatFromString from 'src/helpers/getFloatFromString';
import getPartsFromTimeId from 'src/helpers/getPartsFromTimeId';

class Database {
  constructor(databaseURL) {
    console.log('Database - constructor', databaseURL);

    if (!databaseURL) throw new Error('No databaseURL specified to Database');

    initializeApp({ databaseURL });

    this.database = database;
  }

  set(ref, data) {
    console.log('Database - set', ref, data);

    return this.database()
      .ref(ref)
      .set(data);
  }

  listenTo(ref, callback) {
    console.log('listenTo', ref);

    const parent = this.database().ref(ref);

    parent.on('value', function(snapshot) {
      callback(snapshot.val());
    });

    return parent;
  }

  getOnce(ref) {
    console.log('Database - getOnce', ref);

    return this.database()
      .ref(ref)
      .once('value')
      .then(snapshot => snapshot.val());
  }

  getLastUpdatedDate() {
    console.log('Database - getLastUpdatedDate');

    return this.getOnce('/lastUpdated');
  }

  setLastUpdatedDate(date) {
    console.log('Database - setLastUpdatedDate', date);

    return this.set('/lastUpdated', date.toISOString());
  }

  getCards(orderBy = 'dateLastActivity', limit = 10) {
    console.log('Database - getCards', orderBy, limit);

    return this.database()
      .ref('/cards')
      .orderByChild(orderBy)
      .limitToLast(limit)
      .once('value')
      .then(snapshot => snapshot.val());
  }

  getTime(id) {
    return this.getOnce(`/times/${id}`).then(time => (time ? time.time : null));
  }

  updateCardTimes({ times, datesByCard, cardsByDate }) {
    console.log('Database - updateCardTimes', times, datesByCard, cardsByDate);

    var updates = {};

    const toDelete = [];

    Object.keys(times).forEach(timeId => {
      const value = getFloatFromString(times[timeId]);

      if (value === 0) {
        const { cardId, dateString } = getPartsFromTimeId(timeId);
        toDelete.push(`/datesByCard/${cardId}/${dateString}`);
        toDelete.push(`/cardsByDate/${dateString}/${cardId}`);
        updates[`/times/${timeId}`] = null;
      } else {
        updates[`/times/${timeId}`] = value;
      }
    });

    const update = ref => {
      if (toDelete.includes(ref)) {
        updates[ref] = null;
      } else {
        updates[ref] = true;
      }
    };

    Object.keys(datesByCard).forEach(cardId => {
      const times = datesByCard[cardId];

      Object.keys(times).forEach(dateString => {
        update(`/datesByCard/${cardId}/${dateString}`);
      });
    });

    Object.keys(cardsByDate).forEach(dateString => {
      const times = cardsByDate[dateString];

      Object.keys(times).forEach(cardId => {
        update(`/cardsByDate/${dateString}/${cardId}`);
      });
    });

    return this.database()
      .ref()
      .update(updates);
  }

  searchCardsByName(searchText, callback) {
    console.log('Database - searchCardsByName', searchText);
    let carryOn = true;
    let i = 0;
    const returnedIds = {};

    const search = () => {
      i += 1;
      const limit = 100 * i;

      return this.getCards('dateLastActivity', limit).then(cards => {
        const filteredCards = [];

        const cardIds = Object.keys(cards);

        cardIds.forEach(cardId => {
          if (returnedIds[cardId]) return;

          const card = cards[cardId];

          if (
            searchText === '' ||
            !searchText ||
            card.name.toLowerCase().includes(searchText.toLowerCase())
          ) {
            returnedIds[cardId] = true;
            filteredCards.push(card);
          }
        });

        carryOn = callback(filteredCards);

        if (cardIds.length < limit) carryOn = false;

        if (carryOn) {
          return search();
        }
      });
    };

    search();
  }
}

export default Database;
