function parseURL (string) {
  return string.replace(/https:\/\/|http:\/\//, '')
}

function makeURLShortenerModel(db) {
  const schema = new db.Schema({
    requestedURL: { type: String, required: true },
    index: { type: Number, unique: true, required: true },
  });
  return db.model('URLShortener', schema);
}

async function shortenURL(string, Model, baseURL) {
  let shortURL;
  const inDB = await alreadyInDB(string, Model);

  if (inDB) {
    shortURL = await getShortenedURL(string, Model, baseURL);
  } else {
    shortURL = getNewURL(string, Model, baseURL);
  }

  return shortURL;
}

async function getOriginalURL(num, Model) {
  let record;
  try {
    record = await Model.findOne({ index: num });
  } catch (err) {
    console.log(err)
  }
  return record.requestedURL;
}

// #region Helper methods
function alreadyInDB(requestedURL, Model) {
  return Model.findOne({ requestedURL }).exec();
}

async function getShortenedURL(requestedURL, Model, baseURL) {
    const record = await Model.findOne({ requestedURL }).exec();
    return `${baseURL}/${record.index}`;
}

async function getNewURL(string, collection, baseURL) {
  try {
    const record = await addURLToDB(string, collection);
    return `${baseURL}/${record.index}`;
  } catch (err) {
    console.log(err);
  }
}

async function addURLToDB(string, Model) {
  const count = await Model.count(function(err, count) {
    return count;
  });
  var shortURL = new Model({ requestedURL: string, index: count + 1 });
  const result = await shortURL.save();
  return result;
}
// #endregion

module.exports = shortenURL;
module.exports.parseURL = parseURL;
module.exports.makeURLShortenerModel = makeURLShortenerModel;
module.exports.getOriginalURL = getOriginalURL;
