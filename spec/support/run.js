var Jasmine = require('jasmine');
var SpecReporter = require('jasmine-spec-reporter').SpecReporter

var jasmine = new Jasmine();
// To use a custom reporter override the default reporter
jasmine.configureDefaultReporter({
    print: function() {}
});

// Register custom reporter
jasmine.addReporter(
	new SpecReporter({
      // Configure any reporter specific options
        spec: {
            displayPending: true
        }
    })
  );
// Load the configuration file that was created by jasmine init
// the relative path from the main directory of the app
jasmine.loadConfigFile("./spec/support/jasmine.json");
// Run jasmine
jasmine.execute();