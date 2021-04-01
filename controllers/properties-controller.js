const Property = require("../models/property");
const HttpError = require("../models/http-error");
const Booking = require("../models/booking");

// @route GET api/properties
// @desc To retrieve all properties
// @access Public
const getProperties = (req, res, next) => {
  Property.findAll()
    .then((properties) => {
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

// @route GET api/properties/userId
// @desc To retrieve the properties created by a particular user
// @access Private
const getPropertiesByUserId = (req, res, next) => {
  const userId = req.params.userId;

  Property.findAll({ where: { creator: userId } })
    .then((properties) => {
      if (!properties || properties.length === 0) {
        // return next(
        //   new HttpError(
        //     "Could not find property(s) for the provided user id.",
        //     404
        //   )
        // );
        const error = new Error(
          "Could not find property(s) for the provided user id."
        );
        error.code = 404;
        return next(error);
      }
      // console.log(properties);
      return properties;
    })
    .then((result) => {
      console.log(result);
      res.status(200).json({
        status: "Success",
        msg: "Properties created by this user",
        properties: result,
      });
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      // next(error); Having this returns an error [cannot set headers after they are sent to the client] called next() twice.
    });
};

// @route GET api/properties/id
// @desc To retrieve a single property with a particular id
// @access Public
const getPropertiesById = (req, res, next) => {
  const propertyId = req.params.propertyId;
  Property.findByPk(propertyId)
    .then((property) => {
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

// @route GET api/properties/booking
// @desc To retrieve our booked properties
// @access Public
const getBooking = (req, res, next) => {
  console.log(req.user.booking);
  req.user
    .getBooking()
    .then((booking) => {
      console.log(booking);
      booking
        .getProperties()
        .then((properties) => {
          console.log(properties);
          res.status(200).json({
            status: "Successful",
            msg: "Booked Properties",
            properties: properties,
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
};

// @route POST api/properties/booking
// @desc To add booking-item to booking
// @access Public
const createBooking = (req, res, next) => {
  const propertyId = req.body.propertyId;
  console.log(propertyId);
  let fetchedBooking;
  // let newQuantity = 1;
  req.user
    .getBooking()
    .then((booking) => {
      console.log(booking);
      fetchedBooking = booking;
      return booking.getProperties({ where: { id: propertyId } });
    })
    .then((properties) => {
      console.log(properties);
      let property;
      if (properties.length > 0) {
        property = properties[0];
      }
      return Property.findByPk(propertyId)
        .then((property) => {
          console.log(property);
          // return fetchedBooking.addProperty(property, {
          //   through: { quantity: newQuantity },
          // });
          return fetchedBooking.addProperty(property);
        })
        .catch((error) => {
          if (!error.statusCode) {
            error.statusCode = 500;
          }
          next(error);
        });
    })
    .then((booking) => {
      console.log(booking);
      res.status(200).json({
        status: "Successful",
        msg: "SIngle Booking Item Created",
        booking: booking,
      });
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
};

// @route DELETE api/properties/booking
// @desc To add booking-item to booking
// @access Public
const deleteBookingItem = (req, res, next) => {
  const propertyId = req.body.propertyId;
  req.user
    .getBooking()
    .then((booking) => {
      return booking.getProperties({ where: { id: propertyId } });
    })
    .then((properties) => {
      const property = properties[0];
      return property.bookingItem.destroy();
    })
    .then((result) => {
      res.status(200).json({
        status: "Successful",
        msg: "Booking Item Deleted",
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

exports.getProperties = getProperties;
exports.getPropertiesByUserId = getPropertiesByUserId;
exports.getPropertiesById = getPropertiesById;
exports.getBooking = getBooking;
exports.createBooking = createBooking;
exports.deleteBookingItem = deleteBookingItem;
