import Database from 'src/modules/Database';
import Trello from 'src/modules/Trello';
import Cards from 'src/modules/Cards';

const trello = new Trello(
  process.env.TRELLO_APPLICATION_KEY,
  process.env.TRELLO_USER_TOKEN,
);

const database = new Database(process.env.DATABASE_URL);

const cards = new Cards(trello, database);

cards.updateCardsInDatabase();
