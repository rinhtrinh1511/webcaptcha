function convertUtcToUtcPlus7(utcDateString) {
  const utcDate = new Date(utcDateString);
  const utcHours = utcDate.getUTCHours();
  const utcPlus7Hours = utcHours + 7;
  utcDate.setHours(utcPlus7Hours);
  const formattedDate = `${utcDate.getFullYear()}-${padZero(
    utcDate.getMonth() + 1
  )}-${padZero(utcDate.getDate())} ${padZero(utcDate.getHours())}:${padZero(
    utcDate.getMinutes()
  )}:${padZero(utcDate.getSeconds())}`;
  return formattedDate;
}

function padZero(num) {
  return num.toString().padStart(2, "0");
}

export default convertUtcToUtcPlus7;
