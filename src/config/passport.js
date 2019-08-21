const localStrategy = require("passport-local").Strategy;
module.exports = passport => {
  passport.use(
    new localStrategy((user, password, done) => {
      console.log(password);
    })
  );
};
