function getTrelloOrganisations() {
  return process.env.TRELLO_ORGANISATIONS.split(',');
}

export default getTrelloOrganisations;
