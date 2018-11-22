const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const Users = require('../mssql/users');

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
},
(email, password, done) => {
  Users.getUserByEmail(email, true, (err, user) => {
     if (err) {
      return done(null, false, {errorCode: 'Failed to identify user'});
    }
     if(!user){
       return done(null, false, {errorCode: 'User not found'});
     }
    if (user.IsEnabled == 0 || user.IsEnabled == "0"){
      return done(null, false, {errorCode: 'This user has been disabled'});
    } 

     Users.comparePassword(password, user.Password, (err, isMatch) =>{
       if (err) {
        return done(null, false, {errorCode: 'Failed to identify user'});
      }
       if(isMatch){
         return done(null, user);
       } else {
         return done(null, false, {errorCode: 'Invalid password.'});
       }
     });
  });
}
));

passport.serializeUser((user, done) => {
  done(null, user.Id);
});

passport.deserializeUser((id, done) => {
  Users.getUserById(id, false, (err, user) => {
    done(err, user);
  });
});

exports.authenticate = (req, res, next, callback) => {
  passport.authenticate('local', callback)(req, res, next);
}