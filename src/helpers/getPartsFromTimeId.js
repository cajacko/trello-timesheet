function getPartsFromTimeId(timeId) {
  const cardId = timeId.split('-')[0];
  const dateString = timeId.split(/-(.+)/)[1];

  return { cardId, dateString };
}

export default getPartsFromTimeId;
