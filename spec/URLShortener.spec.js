const shortenURL = require('../src/URLShortener');

// These tests should probably be rewritten as integration tests
// As it is they are very dependent on the database specific methods

describe('URLShortener.js', () => {
  const mockDB = {
    findOne(obj, callback) {
      return callback(null, { shortenedURL: 'www.google.com' });
    },
    save(obj, callback) {
      return callback(null, { shortenedURL: 'www.google.com' });
    },
  };

  describe('shortenURL', () => {
    it('should accept a string and database object and return a string', () => {
      expect(shortenURL('', mockDB)).toEqual(jasmine.any(String));
    });
    it('should check if the current url already has a shortened version', () => {
      spyOn(mockDB, 'findOne').and.callThrough();
      shortenURL('www.google.com', mockDB);
      expect(mockDB.findOne).toHaveBeenCalled();
    });
    it('should create a database record for the url', () => {
      pending('WIP');
    });
    it('should return the shortened url', () => {
      pending('WIP');
    });
  });

  describe('alreadyInDB', () => {
    var alreadyInDB = require('../src/URLShortener').alreadyInDB;
    it('should accept a string and an object and return a boolean', () => {
      expect(alreadyInDB('www.sample.com', mockDB)).toEqual(jasmine.any(Boolean));
    });
  });
});

fdescribe('async', () => {
  var mongoose = require('mongoose');
  mongoose.connect(
    'mongodb://arhodebeck:mrsjurgenson@ds229458.mlab.com:29458/freecodecamp-backend-challenges',
  );

  const makeModel = require('../src/URLShortener').makeURLShortenerModel;
  const shortURLModel = makeModel(mongoose);
  const shortenURL = require('../src/URLShortener');
  const getOriginalURL = require('../src/URLShortener').getOriginalURL;

  it('Integration test', async () => {
    let shortURL = await shortenURL(
      'www.rawk.co.uk',
      shortURLModel,
      'https://aaron-rhodebeck-freecodecamp-api-projects.glitch.me',
    );
    console.log(shortURL);
    expect(shortURL).toEqual(jasmine.any(String));
  });
});
