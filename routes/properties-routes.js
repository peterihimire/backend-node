const express = require("express");

const propertiesController = require("../controllers/properties-controller");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

// /api/properties/booking => GET
router.get("/booking", propertiesController.getBooking);

// /api/properties/booking => Post
router.post("/booking", propertiesController.createBooking);

// /api/properties/booking => GET
router.delete("/booking", propertiesController.deleteBookingItem);

// /api/properties => GET
router.get("/", checkAuth, propertiesController.getProperties); //checkAuth was here

// /api/properties/propertyId => GET
router.get("/:propertyId", propertiesController.getPropertiesById);

module.exports = router;
