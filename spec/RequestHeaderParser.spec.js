describe('RequestHeaderParser.js', () => {
  describe('parseHeader', () => {
    const parseHeader = require('../src/RequestHeaderParser');

    const sampleHeader = {
      "connection":"close",
      "x-forwarded-for":"76.84.68.176,::ffff:10.10.11.6,::ffff:10.10.10.148",
      "x-forwarded-proto":"https,http,http",
      "x-forwarded-port":"443,80,80",
      "host":"aaron-rhodebeck-freecodecamp-api-projects.glitch.me",
      "x-amzn-trace-id":"Root=1-5a762e71-4b9440745a6282774c8178a8",
      "user-agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36",
      "upgrade-insecure-requests":"1",
      "accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
      "accept-encoding":"gzip, deflate, br",
      "accept-language":"en-US,en;q=0.9",
      "x-request-id":"f18548eb95742f84",
      "x-glitch-routing":"813f4687-ec57-49eb-9fa5-a8af5ece675c:1085",
      "x-forwarded-host":"aaron-rhodebeck-freecodecamp-api-projects.glitch.me"}
    const parsedSampleHeader = parseHeader(sampleHeader);

    it('should accept an object and return an object', () => {
      expect(parsedSampleHeader).toEqual(jasmine.any(Object));
    });
    it('should return an object containing three properties', () => {
      expect(Object.keys(parsedSampleHeader).length).toBe(3);
    });
    it('should have an "ipaddress" key)', () => {
      expect(parsedSampleHeader.ipaddress).not.toBe(undefined);
    });
    it('should have a language key', () => {
      expect(parsedSampleHeader.language).not.toBe(undefined);
    });
    it('should have a software key', () => {
      expect(parsedSampleHeader.software).not.toBe(undefined);
    });

    describe('getIPAddress', () => {
      const getIPAddress = require('../src/RequestHeaderParser').getIPAddress;

      it('should accept an object and return a string', () => {
        expect(getIPAddress(sampleHeader)).toEqual(jasmine.any(String));
      });
      it('should return a string containing only numbers and dots', () => {
        const ipAddress = getIPAddress(sampleHeader);
        expect((/[^0-9.]/).test(ipAddress)).toBe(false)
      });
    });

    describe('getLanguage', () => {
      const getLanguage = require('../src/RequestHeaderParser').getLanguage;

      it('should accept an object and return a string', () => {
        expect(getLanguage(sampleHeader)).toEqual(jasmine.any(String));
      });
    });

    describe('getSoftware', () => {
      const getSoftware = require('../src/RequestHeaderParser').getSoftware;

      it('should accept an object and return a string', () => {
        expect(getSoftware(sampleHeader)).toEqual(jasmine.any(String));
      });
    });
  });
});