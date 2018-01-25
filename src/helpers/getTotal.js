function getTotal(totals, prop, key) {
  let total;

  if (key) {
    total = totals[prop] ? totals[prop][key] : null;
  } else {
    total = totals[prop];
  }

  return typeof total === 'number' ? total : null;
}

export default getTotal;
