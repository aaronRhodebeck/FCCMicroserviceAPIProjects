export function getExerciseTrackerModel(dbConnection) {
  const exerciseSchema = new dbConnection.Schema({
    userName: { type: String, required: true },
    exerciseDescription: { type: String, required: true },
    duration: { type: Number, required: true },
    date: { type: Date, default: Date.now },
  });
  return dbConnection.model('ExerciseTracker', exerciseSchema);
}

export function isValidUserName(userName) {
  let invalid = /[^a-z0-9]/i.test(userName);
  return invalid || userName.length < 1 ? false : true;
}

export async function userNameIsTaken(userName, model) {
  let userNameTaken;
  try {
    userNameTaken = await model.findOne({ userName });
  } catch (err) {
    console.log(err);
    return false;
  }
  return userNameTaken ? true : false;
}

export function missingRequiredFields(exercise) {
  const requiredFields = ['userName', 'exerciseDescription', 'duration'];
  const exerciseFields = Object.keys(exercise);

  let allFieldsPresent = true;
  for (let i = 0, len = requiredFields.length; i < len; i++) {
    if (exerciseFields.includes(requiredFields[i]) !== true) {
      allFieldsPresent = false;
    }
  }
  return allFieldsPresent ? false : true;
}

export function getUserNameModel(dbConnection) {
  const userNameSchema = new dbConnection.Schema({
    userName: { type: String, required: true, index: true, unique: true },
  });
  return dbConnection.model('ExerciseTrackerUsers', userNameSchema);
}

export async function addUser(userName, model) {
  let response = { success: null, message: '' };
  if (isValidUserName(userName) === false) {
    response.success = false;
    response.message = 'Invalid user name';
  } else if (await userNameIsTaken(userName, model)) {
    response.success = false;
    response.message = 'Already a user with that name';
  } else {
    try {
      response.success = await addUserToCollection(userName, model);
    } catch (err) {
      console.log(err);
      response.success = false;
    }
    response.message = response.success ? 'Success' : 'Database problem';
  }
  return response;
}

async function addUserToCollection(userName, model) {
  const newUser = new model({ userName });
  try {
    const success = await newUser.save();
  } catch (err) {
    console.log(err);
    throw err;
  }
  return true;
}

export async function addExercise(exercise, model) {
  let response = { success: null, message: '' };
  if (missingRequiredFields(exercise)) {
    response.success = false;
    response.message = 'Missing required field';
  } else {
    try {
      response.success = await addExerciseToCollection(exercise, model);
    } catch (err) {
      console.log(err);
      response.success = false;
    }
    response.message = response.success ? 'Success' : 'Database problem';
  }
  return response;
}

async function addExerciseToCollection(exercise, model) {
  const newExercise = new model(exercise);
  try {
    await newExercise.save();
  } catch (err) {
    throw err;
  }
  return true;
}

export async function getExerciseLog(model, userName, from, to, limit) {
  const optionKeys = ['from', 'to', 'limit'];
  const options = { from, to, limit };
  const query = model.find({ userName });

  optionKeys.forEach(option => {
    if (option === 'from' && options.from) {
      query.where('date').gt(from);
    } else if (option === 'to' && options.to) {
      query.where('date').lt(to);
    } else if (option === 'limit' && options.limit) {
      query.limit(limit);
    }
  });

  let result = { success: true, log: [] };
  try {
    result.log = await query.exec();
  } catch (err) {
    console.log(err);
    result = { success: false, log: [] };
  }
  return result;
}
