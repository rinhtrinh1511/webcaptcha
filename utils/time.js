const moment = require("moment-timezone");

const getTime = () => {
  const nowInUTC7 = moment().tz("Asia/Ho_Chi_Minh");
  const Milliseconds = nowInUTC7.valueOf();
  const date = nowInUTC7.format();
  return { date, Milliseconds };
};

const convertToTimestamp = (dateString, timezone = "Asia/Ho_Chi_Minh") => {
  const momentObj = moment.tz(dateString, timezone);
  return momentObj.valueOf();
};

const calculateDifference = (timestamp, timezone = "Asia/Ho_Chi_Minh") => {
  const dateFromTimestamp = moment.tz(timestamp, timezone);
  const currentDate = moment.tz(timezone);
  const duration = moment.duration(dateFromTimestamp.diff(currentDate));
  const difference = {
    days: Math.floor(duration.asDays()),
    hours: duration.hours(),
    minutes: duration.minutes(),
    seconds: duration.seconds(),
  };

  return {
    dateFromTimestamp: dateFromTimestamp.format(),
    currentDate: currentDate.format(),
    difference,
  };
};

const timeTodate = (dateString) => {
  
  const dateObj = new Date(dateString);
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  const hours = String(dateObj.getHours()).padStart(2, "0");
  const minutes = String(dateObj.getMinutes()).padStart(2, "0");
  const seconds = String(dateObj.getSeconds()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day} lúc ${hours}:${minutes}:${seconds}`;

  return formattedDate;
};

const getCurrentMillisecondsUTC7 = () => {
  const now = new Date();
  const utcNow = now.getTime() + now.getTimezoneOffset() * 60000;
  const utc7Now = new Date(utcNow + 7 * 3600000);
  return utc7Now.getTime();
};

module.exports = {
  getTime,
  convertToTimestamp,
  calculateDifference,
  timeTodate,
  getCurrentMillisecondsUTC7,
};
