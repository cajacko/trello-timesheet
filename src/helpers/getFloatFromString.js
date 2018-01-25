function getFloatFromString(string) {
  let time = parseFloat(string);

  if (isNaN(time)) time = 0;

  return time || 0;
}

export default getFloatFromString;
