var parseDate = require('../src/TimeStamp').parseDate;
var unixTimeStampFrom = require('../src/TimeStamp').unixTimeStampFrom;
var utcTimeStampFrom = require('../src/TimeStamp').utcTimeStampFrom;

describe('TimeStamp.js', () => {
  describe('parseDate', () => {
    it('should accept a string and return a Date', () => {
      expect(parseDate('')).toEqual(jasmine.any(Date));
      expect(parseDate('2015-12-25')).toEqual(jasmine.any(Date));
    });
    it('should return a new Date if passed an empty string', () => {
      // Can fail due to clock ticks, might be a bad test
      expect(parseDate('')).toEqual(new Date());
    });
    it('should convert a string into a Date', () => {
      expect(parseDate('2012-06-09')).toEqual(new Date('Jun 9, 2012'));
    });
  });

  describe('unixTimeStampFrom', () => {
    it('should accept a Date object and return a string', () => {
      expect(unixTimeStampFrom(new Date())).toEqual(jasmine.any(String));
    });
    it('should return null if passed anything but a date object', () => {
      const badInputs = ['', NaN, 'Invalid Date', {}, [], function() {},];
      for (let i = 0, len = badInputs.length; i < len; i++) {
        expect(unixTimeStampFrom(badInputs[i])).toBe(null); 
      }
    });
    it('should return null if passed an invalid Date object', () => {
      expect(unixTimeStampFrom(new Date('six'))).toBe(null)
    });
    it('should return a string containing only numbers', () => {
      const timeStamp = unixTimeStampFrom(new Date());
      expect(Number.parseInt(timeStamp)).not.toEqual(NaN);
    });
    it('should return ms elapsed from Jan 1, 1970 to the Date object', () => {
      const dates = [new Date('Jan 1, 1970'), new Date('Jan 2, 1970'), new Date('Dec 31, 1999')]
      const correctMS = [0, 86400000, 946598400000]
      for (let i = 0, len = dates.length; i < len; i++) {
        expect(unixTimeStampFrom(dates[i])).toEqual(correctMS[i].toString()); 
      }
    });
    it('should return a negative number for dates before Jan 1, 1970', () => {
      expect(unixTimeStampFrom(new Date('Dec 31, 1969'))).toEqual('-86400000');
    });

  });

  describe('utcTimeStampFrom', () => {
    it('should accept a Date object and return a string', () => {
      expect(utcTimeStampFrom(new Date())).toEqual(jasmine.any(String));
    });
    it('should return Invalid Date if passed anything but a date object', () => {
      const badInputs = ['', NaN, 'Invalid Date', {}, [], function() {}];
      for (let i = 0, len = badInputs.length; i < len; i++) {
        expect(utcTimeStampFrom(badInputs[i])).toBe('Invalid Date'); 
      }
    });
    it('should return a valid representation of a date', () => {
      const testDate = new Date(utcTimeStampFrom(new Date()));
      expect(testDate.toString()).not.toEqual('Invalid Date');
    })
  });
});