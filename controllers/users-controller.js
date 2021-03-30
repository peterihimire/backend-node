const HttpError = require("../models/http-error");
const User = require("../models/user");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// @route POST api/user/signup
// @desc To create or signup a user
// @access Public
const signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your fields.", 422)
    );
  }
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const admincode = req.body.admincode;

  if (!name || !email || !password) {
    return next(new HttpError("Input missing required fields.", 400));
  }
  User.findOne({ where: { email: email } })
    .then((user) => {
      if (user) {
        return next(
          new HttpError("User exists already , please login instead .", 422)
        ); //422 code is used for invalid inputs
      } else {
        return bcrypt
          .hash(password, 12) //salt 12 round
          .then((hashedPw) => {
            console.log(hashedPw);
            if (admincode !== "secrete123") {
              return User.create({
                name: name,
                email: email,
                password: hashedPw,
              })
                .then((createdUser) => {
                  res.status(201).json({
                    status: "Successful",
                    msg: "User Signedup !",
                    user: createdUser,
                  });
                })
                .catch((error) => {
                  if (!error.statusCode) {
                    error.statusCode = 500;
                  }
                  next(error);
                });
            }
            User.create({
              name: name,
              email: email,
              password: hashedPw,
              isAdmin: true,
            })
              .then((createdUser) => {
                res.status(201).json({
                  status: "Successful",
                  msg: "User Signedup !",
                  user: createdUser,
                });
              })
              .catch((error) => {
                if (!error.statusCode) {
                  error.statusCode = 500;
                }
                next(error);
              });
          })
          .catch((error) => {
            if (!error.statusCode) {
              error.statusCode = 500;
            }
            next(error);
          });
      }
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
};

// const HttpError = require("../models/http-error");
// const User = require("../models/user");
// const { validationResult } = require("express-validator");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

// // @route POST api/user/signup
// // @desc To create or signup a user
// // @access Public
// const signup = (req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return next(
//       new HttpError("Invalid inputs passed, please check your fields.", 422)
//     );
//   }
//   const name = req.body.name;
//   const email = req.body.email;
//   const password = req.body.password;

//   if (!name || !email || !password) {
//     return next(new HttpError("Input missing required fields.", 400));
//   }
//   User.findOne({ where: { email: email } })
//     .then((user) => {
//       if (user) {
//         return next(
//           new HttpError("User exists already , please login instead .", 422)
//         ); //422 code is used for invalid inputs
//       } else {
//         return bcrypt
//           .hash(password, 12) //salt 12 round
//           .then((hashedPw) => {
//             console.log(hashedPw);
//             User.create({
//               name: name,
//               email: email,
//               password: hashedPw,
//             })
//               .then((createdUser) => {
//                 res.status(201).json({
//                   status: "Successful",
//                   msg: "User Signedup !",
//                   user: createdUser,
//                 });
//               })
//               .catch((error) => {
//                 if (!error.statusCode) {
//                   error.statusCode = 500;
//                 }
//                 next(error);
//               });
//           })
//           .catch((error) => {
//             if (!error.statusCode) {
//               error.statusCode = 500;
//             }
//             next(error);
//           });
//       }
//     })
//     .catch((error) => {
//       if (!error.statusCode) {
//         error.statusCode = 500;
//       }
//       next(error);
//     });
// };

// @route POST api/user/login
// @desc To authenticate or login an already registered  user
// @access Public
const login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ where: { email: email } })
    .then((existingUser) => {
      if (!existingUser) {
        return next(
          new HttpError(
            "User does not exist, please signup for an account! .",
            401
          )
        );
      }
      return existingUser;
    })
    .then((existingUser) => {
      // console.log(existingUser);
      return bcrypt
        .compare(password, existingUser.password)
        .then((doMatch) => {
          //domatch or the result here is a boolean true or false

          if (doMatch) {
            const token = jwt.sign(
              { email: existingUser.email, userId: existingUser.id },
              "ihimireeromoselepeter",
              { expiresIn: "1h" }
            );

            return res.status(200).json({
              status: "Successful",
              msg: "Now you are logged in",
              token: token,
              userId: existingUser.id,
              userName: existingUser.name,
              admin: existingUser.isAdmin
              // user: user,
            });
          }
          return next(new HttpError("Login failed, Password error .", 401));
        })
        .catch((error) => {
          if (!error.statusCode) {
            error.statusCode = 500;
          }
          next(error);
        });
    })

    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
};

exports.signup = signup;
exports.login = login;

// Authentication and Authorization. Authenticaion is about verifying the user, while Authorization is about not allowing the authenticated user to have access to everything.
