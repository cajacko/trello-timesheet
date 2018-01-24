import getTrelloOrganisations from 'src/helpers/getTrelloOrganisations';

class Trello {
  constructor(key, token) {
    console.log('Trello - constructor', key, token);

    if (!key) throw new Error('No key specified to Trello');
    if (!token) throw new Error('No token specified to Trello');

    this.key = key;
    this.token = token;

    this.authQueryParams = `&key=${this.key}&token=${this.token}`;

    this.getAllCardsFromOrganisation = this.getAllCardsFromOrganisation.bind(
      this,
    );

    this.getAllBoardsFromOrganisation = this.getAllBoardsFromOrganisation.bind(
      this,
    );

    this.getAllCardsFromBoard = this.getAllCardsFromBoard.bind(this);
    this.getOrganisation = this.getOrganisation.bind(this);
  }

  fetch(endpoint, data, method = 'GET') {
    console.log('Trello - fetch', endpoint, data, method);

    if (!endpoint) return Promise.reject(new Error('No endpoint defined'));

    let url = `https://api.trello.com/1/${endpoint}?${this.authQueryParams}`;

    if (data) {
      Object.keys(data).forEach(key => {
        const value = data[key];

        switch (method) {
          default:
            url += `&${key}=${value}`;
        }
      });
    }

    return fetch(url, {}).then(res => res.json());
  }

  search(query, props = {}) {
    console.log('Trello - search', query, props);

    if (!query) return Promise.reject(new Error('No query supplied to search'));

    return this.fetch('search', { ...props, query });
  }

  getAllCardsFromOrganisations() {
    console.log('Trello - getAllCardsFromOrganisations');

    const trelloOrganisations = getTrelloOrganisations();

    const promises = trelloOrganisations.map(this.getAllCardsFromOrganisation);

    return Promise.all(promises).then(results => results[0].concat(results[1]));
  }

  getAllCardsFromOrganisation(organisation) {
    console.log('Trello - getAllCardsFromOrganisation', organisation);

    return this.getAllBoardsFromOrganisation(organisation).then(boards => {
      const promises = boards.map(this.getAllCardsFromBoard);

      return Promise.all(promises).then(results =>
        results[0].concat(results[1]),
      );
    });
  }

  getAllBoardsFromOrganisation(organisation) {
    console.log('Trello - getAllBoardsFromOrganisation', organisation);

    return this.fetch(`organizations/${organisation}/boards`).then(data => {
      return data.map(({ id }) => id);
    });
  }

  getAllCardsFromBoard(boardId) {
    console.log('Trello - getAllCardsFromBoard', boardId);

    return this.fetch(`boards/${boardId}/cards/all`);
  }

  getAllCardsModifiedSinceDate(lastModified, now) {
    console.log('Trello - getAllCardsModifiedSinceDate', lastModified, now);

    const daysSinceLastModified = Math.round(
      (now - lastModified) / (1000 * 60 * 60 * 24),
    );

    const query = `edited:${daysSinceLastModified + 1}`;

    return this.getAllOrganisationIds()
      .then(organisationIds => {
        let idOrganizations = '';

        organisationIds.forEach((id, i) => {
          if (i !== 0) idOrganizations += ',';

          idOrganizations += id;
        });

        return this.search(query, {
          idOrganizations,
          modelTypes: 'cards',
          cards_limit: 1000,
        });
      })
      .then(({ cards }) =>
        cards.filter(({ dateLastActivity }) => {
          const dateModified = new Date(dateLastActivity);

          return dateModified > lastModified;
        }),
      );
  }

  getAllOrganisationIds() {
    console.log('Trello - getAllOrganisationIds');

    const trelloOrganisations = getTrelloOrganisations();

    const promises = trelloOrganisations.map(this.getOrganisation);

    return Promise.all(promises).then(organisations =>
      organisations.map(({ id }) => id),
    );
  }

  getOrganisation(organisationId) {
    console.log('Trello - getOrganisation', organisationId);

    return this.fetch(`organizations/${organisationId}`);
  }
}

export default Trello;
