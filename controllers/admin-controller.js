const User = require("../models/user");
const Property = require("../models/property");
const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");

// @route POST api/admin/property
// @desc To create a new property
// @access Public
const createProperty = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your fields.", 422)
    );
  }
  // This check is for image upload check
  if (!req.file) {
    return next(new HttpError("No image provided.", 422));
  }
  const name = req.body.name;
  const slug = req.body.slug;
  const location = req.body.location;
  const amount = req.body.amount;
  const completion = req.body.completion;
  const description = req.body.description;
  const creator = req.body.creator;
  const image = req.file.path;
  const userId = req.body.creator;
  console.log(image);

  Property.create({
    name: name,
    slug: slug,
    location: location,
    amount: amount,
    completion: completion,
    description: description,
    creator: creator,
    image: image,
    userId: userId,
  })
    .then((property) => {
      res.status(201).json({
        status: "Successful",
        msg: "Property Created",
        property: property,
      });
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
};

// @route GET api/admin/properties
// @desc To retrieve the data of all properties
// @access Public
const getProperties = (req, res, next) => {
  Property.findAll({ include: [User] })
    .then((properties) => {
      if (!properties || properties.length === 0) {
        const error = new Error("No properties found.");
        error.code = 404;
        return next(error);
      }
      res.status(200).json({
        status: "Successful",
        msg: "All Properties",
        properties: properties,
      });
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
};
// @route GET api/admin/properties/id
// @desc To retrieve the data of a single property
// @access Public
const getPropertiesById = (req, res, next) => {
  const propertyId = req.params.propertyId;
  Property.findByPk(propertyId)
    .then((property) => {
      if (!property) {
        const error = new Error("Property not found for this particular id."); // Error handling with only error middleware
        error.code = 404;
        return next(error);
      }
      res.status(200).json({
        status: "Successful",
        msg: "Single Property",
        property: property,
      });
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
};

// @route PUT api/admin/properties/id
// @desc To update the data of a single property
// @access Public
const updatePropertiesById = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your fields.", 422)
    );
  }

  // // This check is for image upload check
  // if (!req.file) {
  //   return next(new HttpError("No image provided.", 422));
  // }

  const propertyId = req.params.propertyId;
  const { name, slug, location, amount, completion, description } = req.body;
  // const image = req.file.path;

  Property.findByPk(propertyId)
    .then((property) => {
      if (!property) {
        return next(
          new HttpError("No property found for this particular id.", 404)
        );
      }
      return property;
    })
    .then((updatedProperty) => {
      updatedProperty.name = name;
      updatedProperty.slug = slug;
      updatedProperty.location = location;
      updatedProperty.amount = amount;
      updatedProperty.completion = completion;
      updatedProperty.description = description;
      // updatedProperty.image = image;
      return updatedProperty.save();
    })
    .then((updatedProperty) => {
      res.status(200).json({
        status: "Successful",
        msg: "Property updated",
        property: updatedProperty,
      });
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
  // .catch((err) => console.log(err));
};

// @route PATCH api/admin/properties/id
// @desc To update the image of a single property
// @access Private
const updatePropertiesImage = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your fields.", 422)
    );
  }

  // This check is for image upload check
  if (!req.file) {
    return next(new HttpError("No image provided.", 422));
  }

  const propertyId = req.params.propertyId;

  const image = req.file.path;

  Property.findByPk(propertyId)
    .then((property) => {
      if (!property) {
        return next(
          new HttpError("No property found for this particular id.", 404)
        );
      }
      return property;
    })
    .then((updatedProperty) => {
      updatedProperty.image = image;
      return updatedProperty.save();
    })
    .then((updatedProperty) => {
      res.status(200).json({
        status: "Successful",
        msg: "Property image updated",
        property: updatedProperty,
      });
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
};

// @route DELETE api/admin/properties/id
// @desc To delete the data of a single property
// @access Private
const deletePropertiesById = (req, res, next) => {
  const propertyId = req.params.propertyId;
  Property.findByPk(propertyId)
    .then((property) => {
      // console.log(property);
      if (!property) {
        const error = new Error("Property not found for this particular id.");
        error.code = 404;
        return next(error);
      }
      return property;
    })
    .then((property) => {
      return property.destroy();
    })
    .then((result) => {
      res.status(200).json({
        status: "Successful",
        msg: "Property Deleted",
        user: result,
      });
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
};

// @route GET api/admin/users
// @desc To retrieve the data of all users
// @access Private
const getUsers = (req, res, next) => {
  User.findAll({ include: Property })
    .then((users) => {
      if (!users || users.length === 0) {
        const error = new Error("No users record found.");
        error.code = 404;
        return next(error);
      }
      return users;
    })
    .then((users) => {
      res.status(200).json({
        status: "Successful",
        msg: "All users",
        users: users,
      });
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
  // .catch((error) => next(error));
};

// @route GeT api/admin/users/id
// @desc To retrieve the data of a single user by id
// @access Public
const getUserById = (req, res, next) => {
  const userId = req.params.userId;
  User.findByPk(userId)
    .then((user) => {
      if (!user) {
        return next(new HttpError("User not found for this specific id.", 404)); // Error handling with both error model and error middleware
      }
      res.status(200).json({
        status: "Successful",
        msg: "Single user",
        user: user,
      });
    })
    // User.findAll({ where: { Id: userId } })
    //   .then((product) => {
    //     res.status(200).json({
    //       message: "Single user",
    //       user: product[0],
    //     });
    //   })
    //   .catch((err) => console.log(err));
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
};

// @route DELETE api/admin/property
// @desc To delete a user with a particular id
// @access Public
const deleteUserById = (req, res, next) => {
  const userId = req.params.userId;
  User.findByPk(userId)
    .then((user) => {
      if (!user) {
        const error = new Error("User for this particular id does not exist.");
        error.code = 404;
        return next(error);
      }
      return user;
    })
    .then((user) => {
      console.log(user);
      return user.destroy();
    })
    .then((result) => {
      res.status(200).json({
        status: "Successful",
        msg: "User Deleted",
        user: result,
      });
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
};
//
//
//
//
//

// @route POST api/users/id
// @desc To retrieve the data of all properties
// @access Public
const getUpdateUser = (req, res, next) => {
  const userId = req.params.userId;

  User.findByPk(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          status: "Unsuccessful",
          msg: "No user found",
        }); // Error handling  directly on code
      }
      res.status(201).json({
        status: "Successful",
        msg: "User updated",
        user: user,
      });
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
};

// @route POST api/admin/property
// @desc To retrieve the data of all properties
// @access Public
const updateUser = (req, res, next) => {
  const userId = req.params.userId;
  const { name, email, password } = req.body;

  User.findByPk(userId)
    .then((updatedUser) => {
      updatedUser.name = name;
      updatedUser.email = email;
      updatedUser.password = password;
      return updatedUser.save();
    })
    .then((updatedUser) => {
      res.status(200).json({
        status: "Successful",
        msg: "User updated",
        user: updatedUser,
      });
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
};

// Node way of exporting multiple methods in a single file
exports.createProperty = createProperty;
exports.getProperties = getProperties;
exports.getPropertiesById = getPropertiesById;
exports.updatePropertiesById = updatePropertiesById;
exports.updatePropertiesImage = updatePropertiesImage;
exports.deletePropertiesById = deletePropertiesById;
exports.getUsers = getUsers;
exports.getUserById = getUserById;
exports.editUser = updateUser;
exports.deleteUserById = deleteUserById;
