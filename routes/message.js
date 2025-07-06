const express = require("express");

// Importing controllers for handling different routes
const {
    getUser,
    allUsers,
    startConversation,
    getConversations,
    uploadMediaFiles
} = require("../controllers/message-controllers.js");

// Importing middlewares
const { protect} = require("../controllers/auth-controllers.js")
const { upload } = require("../middlewares/fileUpload.js");

const router = express.Router();

// Applying authentication middleware to all routes below
router.use(protect );

// Route to get the current logged-in employee's data
router.get("/current-user", getUser);

// Route to get all employees
router.get("/all-users", allUsers);

// Route to start a conversation
router.post("/conversation-start", startConversation);

// Route to get all conversations
router.get("/conversations", getConversations);

// Route to upload media files (max 8 files allowed)
router.post("/files", upload.array("media", 8), uploadMediaFiles);

module.exports = router;
