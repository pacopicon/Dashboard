const Users = require('../mssql/users');
const utils = require('../helpers/utils')
const auth_helper = require('../helpers/auth_helper')
const jwt    = require('jsonwebtoken');
const crypto = require('crypto');
const config = require('../config');

exports.getToken = (req, res, next) => {
	if (utils.isEmpty(req.body) || utils.isEmpty(req.body.email) || utils.isEmpty(req.body.password)) {
    let error = 'No credentials were sent'
    return res.send(error);
  }

  req.body.password = crypto.createHash('md5').update(req.body.password).digest('hex');

	auth_helper.authenticate(req, res, next, (err, user, info) => {

    if (err || !user) {
    	console.log(err, user, info);
      return res.send(error);
    }

    // login the user
    req.logIn(user, (err) => {
      if (err){
        console.log(err)
        return res.send(err);
      }

      user.Password = undefined;
      let token = jwt.sign(user, config.secret, {
        expiresIn: parseInt(process.env.TOKEN_EXPIRATION)
      });

      return res.status(200).json({ success: true, data: { token: token, profile: user } })

    });

  });
}

// GET user profile
exports.checkMail = async (req, res) => {
  let mail = req.query.mail;
  let invalidData = false;

  if(!mail) invalidData = true;

  if(invalidData){
    let error = 'Invalid input data'
    return res.send(error);
  }

  Users.checkMail(mail, (err, exists) => {
    if (err){
      let error = 'Error checking User Mail'
      return res.send(error);
    }

    return res.status(200).json({ success: true, data: { mailExists: exists } });
  });
};

exports.createUser = async (req, res) => {
	if (utils.isEmpty(req.body) ||
		( utils.isEmpty(req.body.firstName) && utils.isEmpty(req.body.lastName) && utils.isEmpty(req.body.email) )) {
    let error = 'Invalid input data'
    return res.send(error);
  }

  let FirstName = req.body.firstName;
  let LastName = req.body.lastName;
  let Mail = req.body.mail;
  let Password = req.body.password;
  let Fund = req.body.Fund;
  
  if(FirstName == undefined)
    FirstName = '';

  if(LastName == undefined)
    LastName = '';

  if(Mail == undefined)
    Mail = '';

  if(Password == undefined)
    Password = '';

  if(Fund == undefined)
    Fund = '';

  Password = req.body.password = crypto.createHash('md5').update(Password).digest('hex');

  let params = {
  	FirstName,
  	LastName,
  	Mail,
    Password,
  	Fund
  };

  params.userId = req.currentUser.Id;

  Users.createUser(params, (err) => {
    if (err){
    	console.log(err)
      return res.send(err);
    }

    return res.status(200).json({ success: true, data: { userId, type, HCorSCid } });
  });
};

let _getUserById = async function(userId, getPassword) {
	let error = null;
	let user = null;
	let disabledError = null;

	await Users.getUserById(userId, getPassword, function(err, response) {
    if (err){
      error = 'Could not get User'
    }
    if(!response){
      error = 'Token failed'
    }

    user = response;
  });

	// add error for disabled account
	if (user && !user.IsEnabled) {
  	disabledError = 'This user has been disabled'
  }

  return {error, user, disabledError};
}

exports.getUser = function(req, res) {
  let response = await _getUserById (req.currentUser.Id, false);
	if (response.error){
    return res.send(response.error);
  }
  return res.status(200).json({ success: true, data: { profile: response.user } });
};

exports.updateUser = async function(req, res) {
  if (utils.isEmpty(req.body) || utils.isEmpty(req.body.id) ) {
    let error = 'Invalid input data'
    return res.send(error);
  }

  let Id = req.body.id;
  let FirstName = req.body.firstName;
  let LastName = req.body.lastName;
  let Mail = req.body.mail;
  let Password = req.body.password;
  let Fund = req.body.Fund;
  let IsEnabled = req.body.isEnabled;
  
  if(FirstName == undefined)
    FirstName = '';

  if(LastName == undefined)
    LastName = '';

  if(Mail == undefined)
    Mail = '';

  if(Password == undefined)
    Password = '';

  if(Fund == undefined)
    Fund = '';

  if(IsEnabled == undefined)
    IsEnabled = 1;

  Password = req.body.password = crypto.createHash('md5').update(Password).digest('hex');

  let params = {
    Id,
    FirstName,
    LastName,
    Mail,
    Password,
    Fund,
    IsEnabled
  };

  Users.updateUser(params, (err) => {
    if (err){
    	console.log(err)
      return res.send(err);
    }

    return res.status(200).json({ success: true, data: { userId, type, HCorSCid } });
  });
};



