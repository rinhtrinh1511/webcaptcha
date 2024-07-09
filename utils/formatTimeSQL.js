function formatTimeSQL(inputDateStr) {
  const parts = inputDateStr.split(" ");
  const datePart = parts[0];
  const timePart = parts[1];
  const [day, month, year] = datePart.split("/");

  const newDateFormat = `${year}-${month}-${day} ${timePart}`;

  return newDateFormat;
}

module.exports = { formatTimeSQL };
