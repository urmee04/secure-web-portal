const { Schema, model } = require("mongoose");

//define the Bookmark schema with validation and options
const bookmarkSchema = new Schema(
  {
    title: {
      type: String,
      required: true, //title is mandatory
      trim: true, //remove whitespace from both ends
      maxlength: 200, //prevent excessively long titles
    },
    url: {
      type: String,
      required: true, //URL is mandatory
      trim: true, //remove whitespace from both ends
      match: [
        /^https?:\/\/.+/i, // Regex to validate URL format (http:// or https://)
        "URL must start with http(s)://", //custom error message
      ],
    },
    user: {
      type: Schema.Types.ObjectId, //reference to User model
      ref: "User", //enables population of user data
      required: true, //every bookmark must belong to a user
    },
  },
  {
    timestamps: true, //automatically add createdAt and updatedAt fields
  }
);

//create and export the Bookmark model
module.exports = model("Bookmark", bookmarkSchema);
