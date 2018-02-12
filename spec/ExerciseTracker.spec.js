// Unit tests
import { isValidUserName, missingRequiredFields } from '../src/ExerciseTracker';

describe('ExerciseTracker unit tests', () => {
  describe('isValidUserName', () => {
    it('should accept a string and return a boolean', () => {
      expect(isValidUserName('aaron')).toEqual(jasmine.any(Boolean));
    });
    it('should return unchanged if the string contains only letters and numbers', () => {
      expect(isValidUserName('bill10')).toEqual(true);
    });
    it('should return "Invalid user name" if the contains any other characters', () => {
      expect(isValidUserName('a$4<')).toEqual(false);
    });
  });
  describe('missingRequiredFields()', () => {
    const requiredFields = ['userName', 'exerciseDescription', 'duration'];

    it('should accept an object and return a boolean', () => {
      expect(missingRequiredFields({})).toEqual(jasmine.any(Boolean));
    });
    it('should return false if object contains all required fields', () => {
      const sampleExercise = {
        userName: 'aaron',
        exerciseDescription: 'Pushups',
        duration: 10,
      };
      expect(missingRequiredFields(sampleExercise)).toBe(false);
    });
    it('should return true if object is missing any of the required fields', () => {
      const missingUserName = { exerciseDescription: 'Pushups', duration: 10 };
      const missingDescription = { userName: 'aaron', duration: 10 };
      const missingDuration = { userName: 'aaron', exerciseDescription: 'Pushups' };
      expect(missingRequiredFields(missingUserName)).toBe(true);
      expect(missingRequiredFields(missingDescription)).toBe(true);
      expect(missingRequiredFields(missingDuration)).toBe(true);
    });
  });
});

// ***** USE WITH CAUTION ******
// Integration tests on live database
// ***** USE WITH CAUTION ******
import mongoose from 'mongoose';
import { userNameIsTaken, addUser, addExercise } from '../src/ExerciseTracker';
require('dotenv').config();

describe('ExerciseTracker integration tests', () => {
  pending('Integration tests on live database');
  let testUserNameModel, testExerciseModel;
  let currentUser = 'aaron';
  let newUser = 'rhodebeck';

  beforeAll(async done => {
    await mongoose.connect(process.env.MONGO_URI);

    const testUserNameSchema = new mongoose.Schema({
      test: { type: Boolean, default: true, required: true },
      userName: { type: String, required: true, index: true, unique: true },
    });

    const testExerciseSchema = new mongoose.Schema({
      test: { type: Boolean, default: true, required: true },
      userName: { type: String, required: true },
      exerciseDescription: { type: String, required: true },
      duration: { type: Number, required: true },
      date: { type: Date, default: Date.now },
    });

    testUserNameModel = mongoose.model(
      'TESTexerciseTrackerUsersTEST',
      testUserNameSchema,
    );
    testExerciseModel = mongoose.model('TESTexerciseTrackerTEST', testExerciseSchema);

    const newUserName = new testUserNameModel({ userName: currentUser });
    await newUserName.save().catch(err => {
      return; // Ignore error if name already exists in db
    });

    const newExercise = new testExerciseModel({
      userName: currentUser,
      exerciseDescription: 'Run',
      duration: 20,
    });
    await newExercise.save();
    done();
  });

  afterEach(async done => {
    await testUserNameModel.remove({ userName: newUser });
    done();
  });

  describe('MongoDB connection', () => {
    it('should have valid mongoose connection', () => {
      expect(mongoose.connection.readyState).toBe(1);
    });
  });
  describe('userNameIsTaken()', () => {
    it('should accept a string and a Model object and return a boolean', async () => {
      const nameTaken = await userNameIsTaken('a', testUserNameModel);
      expect(nameTaken).toEqual(jasmine.any(Boolean));
    });
    it('should return true if the user name is already in the db', async () => {
      const nameTaken = await userNameIsTaken(currentUser, testUserNameModel);
      expect(nameTaken).toBe(true);
    });
    it('should return false if the user name is not in the db', async () => {
      const nameTaken = await userNameIsTaken(newUser, testUserNameModel);
      expect(nameTaken).toBe(false);
    });
  });
  describe('addUser()', () => {
    it('should accept a string and model object and return an object', async () => {
      expect(await addUser('', testUserNameModel)).toEqual(jasmine.any(Object));
    });
    it('should return an object with two properties', async () => {
      const addUserResult = await addUser('', testUserNameModel);
      expect(Object.keys(addUserResult).length).toBe(2);
    });
    it('should return an object with a success property', async () => {
      const addUserResult = await addUser('', testUserNameModel);
      expect(Object.keys(addUserResult).includes('success')).toBe(true);
    });
    it('should return an object with a message property', async () => {
      const addUserResult = await addUser('', testUserNameModel);
      expect(Object.keys(addUserResult).includes('message')).toBe(true);
    });
    it('should have a success of false when the user name is invalid', async () => {
      const invalidUserNames = ['', 'a@y^', 'me and you'];
      let results = [];
      for (let i in invalidUserNames) {
        results.push(await addUser(invalidUserNames[i], testUserNameModel));
      }
      for (let i in results) {
        expect(results[i].success).toBe(false);
      }
    });
    it('should have a messages of "Invalid user name" when the user name is invalid', async () => {
      const invalidUserNames = ['', 'a@y^', 'me and you'];
      let results = [];
      for (let i in invalidUserNames) {
        results.push(await addUser(invalidUserNames[i], testUserNameModel));
      }
      for (let i in results) {
        expect(results[i].message).toBe('Invalid user name');
      }
    });
    it('should have a success of false when the user name is already taken', async () => {
      const result = await addUser(currentUser, testUserNameModel);
      expect(result.success).toBe(false);
    });
    it('should have a message of "Already a user with that name" when the user name is already taken', async () => {
      const result = await addUser(currentUser, testUserNameModel);
      expect(result.message).toBe('Already a user with that name');
    });
    it('should have a success of true if the user name is new and valid', async () => {
      const result = await addUser(newUser, testUserNameModel);
      expect(result.success).toBe(true);
    });
    it('should have a message of "Success" if the user name is new and valid', async () => {
      const result = await addUser(newUser, testUserNameModel);
      expect(result.message).toBe('Success');
    });
  });
  describe('addExercise()', () => {
    const sampleExercise = {
      userName: currentUser,
      exerciseDescription: 'Pushups',
      duration: 10,
      date: new Date('Feb 12, 2018 17:00'),
    };

    it('should accept an object and a model object and return an object', async () => {
      const result = await addExercise({}, testExerciseModel);
      expect(result).toEqual(jasmine.any(Object));
    });
    it('should return an object with two properties', async () => {
      const result = await addExercise({}, testExerciseModel);
      expect(Object.keys(result).length).toBe(2);
    });
    it('should return an object with a success property', async () => {
      const result = await addExercise({}, testExerciseModel);
      expect(Object.keys(result).includes('success')).toBe(true);
    });
    it('should return an object with a message property', async () => {
      const result = await addExercise({}, testExerciseModel);
      expect(Object.keys(result).includes('message')).toBe(true);
    });
    it('should have a success of false if the exercise object is missing fields', async () => {
      let exercise = sampleExercise;
      const requiredKeys = ['userName', 'exerciseDescription', 'duration'];
      for (let i = 0, len = requiredKeys.length; i < len; i++) {
        exercise = Object.assign({}, sampleExercise);
        delete exercise[requiredKeys[i]];
        const result = await addExercise(exercise, testExerciseModel);
        expect(result.success).toBe(false);
      }
    });
    it('should have a success of true if the exercise object is valid', async () => {
      const result = await addExercise(sampleExercise, testExerciseModel);
      expect(result.success).toBe(true);
    });
  });
});
