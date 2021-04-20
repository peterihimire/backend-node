const path = require("path");

const express = require("express");
const { check } = require("express-validator");

const usersController = require("../controllers/users-controller");

const router = express.Router();

// /api/users/signup => POST
router.post(
  "/signup",
  [
    check("name").not().isEmpty(),
    check("email")
      .normalizeEmail()
      .isEmail()
      .withMessage("Please enter a valid email address."),
    check("password")
      .isAlphanumeric()
      .trim()
      .isLength({ min: 6 })
      .withMessage("Password must be minimum of 6 char."),
    // Added this for admin check
    check("admincode").not().isEmpty().withMessage("Enter admin secrete code."),
  ],
  usersController.signup
);

// /api/users/login => POST
router.post("/login", usersController.login);

// /api/users/userId => PUT
router.put("/:userId", usersController.updateUserById);

// /api/users/userId => PATCH
router.patch("/:userId", usersController.updateUserImage);

module.exports = router;
//
//
//
//
//
// // /api/users => GET
// router.get("/", usersController.getUsers);

// // /api/users/userId => GET
// router.get("/:userId", usersController.getUserById);

// // /api/users/userId => PUT
// router.put("/:userId", usersController.editUser);

// // /api/users/signup => DELETE
// router.delete("/:userId", usersController.deleteUser);
