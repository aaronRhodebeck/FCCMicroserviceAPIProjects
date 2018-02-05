function parseHeader(header) {
  const ipaddress = getIPAddress(header);
  const language = getLanguage(header);
  const software = getSoftware(header);
  return { ipaddress, language, software };
}

function getIPAddress(header) {
  const fullAddress = header["x-forwarded-for"];
  return fullAddress.match(/^.*?(?=,)/)[0]
}

function getLanguage(header) {
  return header['accept-language']
}

function getSoftware(header) {
  return header['user-agent'];
}

module.exports = parseHeader;
module.exports.getIPAddress = getIPAddress;
module.exports.getLanguage = getLanguage;
module.exports.getSoftware = getSoftware;
