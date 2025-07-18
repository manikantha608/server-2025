const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const conversationSchema = new Schema({
  participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
  messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
});

const Conversation = model("Conversation", conversationSchema);

module.exports = Conversation;
