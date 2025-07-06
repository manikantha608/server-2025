const mongoose = require("mongoose");
const { Schema, model } = mongoose;

// Schema for attached documents
const documentSchema = new Schema({
  url: { type: String },
  name: { type: String },
  size: { type: Number },
});

// Message schema
const messageSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: "User" },
    content: { type: String },
    media: [
      {
        type: { type: String, enum: ["image", "video"] },
        url: { type: String },
      },
    ],
    document: documentSchema,
    date: { type: Date, default: Date.now },
    type: { type: String, enum: ["Media", "Text", "Document"] },
  },
  { timestamps: true }
);

// Export the model using CommonJS
module.exports = model("Message", messageSchema);
