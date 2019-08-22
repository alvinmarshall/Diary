const localStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const userModel = mongoose.model("users");
const bcrypt = require("bcryptjs");

module.exports = passport => {
  passport.use(
    new localStrategy((username, password, done) => {
      userModel.findOne({ username: username }).then(user => {
        if (!user) {
          return done(null, false, { message: "username not found" });
        }

        const isMatch = bcrypt.compareSync(password, user.password);

        if (!isMatch) {
          return done(null, false, { message: "invalid password" });
        }
        return done(null, user);
      });

      passport.serializeUser((user, done) => {
        done(null, user.id);
      });

      passport.deserializeUser((id, done) => {
        userModel.findById(id, (err, user) => {
          done(err, user);
        });
      });
    })
  );
};
