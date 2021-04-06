const express = require("express");

const propertiesController = require("../controllers/properties-controller");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

// /api/property/propertyId => GET
router.get("/property/:propertyId", propertiesController.getPropertyById);

// /api/properties => GET
router.get("/properties", propertiesController.getProperties); //checkAuth was here

// /api/properties/booking => GET
router.get("/properties/booking", propertiesController.getBooking);

// /api/properties/booking => Post
router.post("/properties/booking", propertiesController.createBooking);

// /api/properties/booking => GET
router.delete("/properties/booking", propertiesController.deleteBookingItem);

// /api/properties/userId => GET
router.get("properties/:userId", propertiesController.getPropertiesByUserId);

module.exports = router;
