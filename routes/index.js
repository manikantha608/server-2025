const router = require("express").Router();

// Import route modules
const authRoute = require("./auth");
const messageRoute = require("./message");

// Mount routes
router.use("/auth", authRoute);      
router.use("/message", messageRoute);   

module.exports = router;
