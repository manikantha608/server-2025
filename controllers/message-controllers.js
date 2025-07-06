

const Conversation = require("../models/conversations.js");
const User = require("../models/user.js");
const { uploadToS3 } = require("../services/aws.service.js");
const catchAsync = require("../utilities/catchAsync.js")

// GET ME
const getUser = catchAsync(async (req, res, next) => {
    res.status(200).json({
        status: "success",
        message: "User Info found successfully!",
        data: {
            user: req.user,
        },
    });
});

// GET USERS
const allUsers = catchAsync(async (req, res, next) => {
    const { _id } = req.user;
    const other_users = await User.find({ _id: { $ne: _id } }).select(
        "name _id avatar"
    );

    res.status(200).json({
        success: "true",
        message: "Users found successfully!",
        data: { other_users },
    });
});

// START CONVERSATION
const startConversation = catchAsync(async (req, res, next) => {
    const { userId } = req.body;
    const { _id } = req.user;

    let conversation = await Conversation.findOne({
        participants: { $all: [userId, _id] },
    })
        .populate("messages")
        .populate("participants");

    if (conversation) {
        return res.json(new apiResponse(200, { conversation }, "success"));
    } else {
        let newConversation = await Conversation.create({
            participants: [userId, _id],
        });

        newConversation = await Conversation.findById(newConversation._id)
            .populate("messages")
            .populate("participants");

        return res
            .status(201)
            .json({
                success: "true",
                message: "success",
                data: { conversation: newConversation },
            });
    }
});

// GET CONVERSATIONS
const getConversations = catchAsync(async (req, res, next) => {
    const { _id } = req.user;

    const conversations = await Conversation.find({
        participants: { $in: [_id] },
    })
        .populate("messages")
        .populate("participants");
// console.log(conversations,"my conversations")
    return res
        .status(200)
        .json({ success: "true", message: "success", data: { conversations } });
});

// UPLOAD MEDIA FILES
const uploadMediaFiles = catchAsync(async (req, res) => {
    console.log(req.files,"my files")
    if (!req.files || req.files.length === 0) {
        return res
            .status(400)
            .json({ success: false, message: "No files uploaded." });
    }

    const uploadedFiles = await Promise.all(
        req.files.map((file) =>
            uploadToS3(file, `projects/${file.originalname}`)
        )
    );

    console.log(uploadedFiles,"filleess")

    res.status(201).json({
        success: true,
        message: "Files uploaded successfully.",
        files: uploadedFiles,
    });
});

module.exports = {
    getUser,
    allUsers,
    startConversation,
    getConversations,
    uploadMediaFiles,
};
