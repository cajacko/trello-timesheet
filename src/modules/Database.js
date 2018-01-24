import { initializeApp, database } from 'firebase';

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
}

export default Database;
