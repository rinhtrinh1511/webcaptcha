function formatNumber(number) {
  if (!number) {
    return;
  }
  const formattedNumber = number.toLocaleString("en");
  return formattedNumber;
}

function calculateTimeDifference(time1) {
  const time2 = Date.now();
  if (time1 <= time2) {
    return 0;
  }

  let difference = Math.abs(time2 - time1);

  const days = Math.floor(difference / (24 * 3600 * 1000));
  difference = difference % (24 * 3600 * 1000);
  const hours = Math.floor(difference / (3600 * 1000));
  difference = difference % (3600 * 1000);
  const minutes = Math.floor(difference / (60 * 1000));
  const seconds = Math.floor((difference % (60 * 1000)) / 1000);

  return { days, hours, minutes, seconds };
}

module.exports = { formatNumber, calculateTimeDifference };
