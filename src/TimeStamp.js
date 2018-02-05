function parseDate(str) {
  if (str === '') {
    return new Date()
  }
  return new Date(str);
}

function unixTimeStampFrom(date) {
  return  date instanceof Date && date.toString() !== 'Invalid Date' ? date.getTime().toString() : null;
}

function utcTimeStampFrom(date) {
   return date instanceof Date && date.toString() !== 'Invalid Date' ? date.toString() : 'Invalid Date';
}

module.exports.parseDate = parseDate;
module.exports.unixTimeStampFrom = unixTimeStampFrom;
module.exports.utcTimeStampFrom = utcTimeStampFrom;