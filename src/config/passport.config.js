const passport = require("passport");
const local = require("passport-local");

const UserModel = require("../dao/models/user.model.js"); //UserModel y las funciones de bcrypt
const { createHash, isValidPassword } = require("../utils/hashBcrypt.js");

const GitHubStrategy = require("passport-github2"); //Passport con GitHub
const LocalStrategy = local.Strategy;
// 1
const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;
        try {
          let user = await UserModel.findOne({ email });
          if (user) return done(null, false);
          const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            role: "user",
          };

          let result = await UserModel.create(newUser);
          return done(null, result);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const user = await UserModel.findOne({ email });
          if (!user) {
            console.log("Este usuario no existeeee ahhh");
            return done(null, false);
          }
          if (!isValidPassword(password, user)) return done(null, false);
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await UserModel.findById({ _id: id });
    done(null, user);
  });

  // //////////////////////////////////Estategia GitHub
  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: "Iv1.48e7a6e65207a327",
        clientSecret: "0baaa5e04267f8258e99087058d7b92d782a446a",
        callbackURL: "http://localhost:8080/api/session/githubcallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log("Profile: ", profile);
        try {
          let user = await UserModel.findOne({
            email: profile._json.email,
          });

          if (!user) {
            let newUser = {
              first_name: profile._json.name,
              last_name: "",
              age: 38,
              email: profile._json.email,
              password: "",
            };

            let result = await UserModel.create(newUser);
            done(null, result);
          } else {
            done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};

module.exports = initializePassport;
