const { Schema, model } = require("mongoose");

//define the Bookmark schema with required fields and user reference
const bookmarkSchema = new Schema(
  {
    title: { type: String, required: true },
    url: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true }, //reference to User model for ownership
  },
  { timestamps: true } //automatically add createdAt and updatedAt fields
);

// Export the Bookmark model
module.exports = mongoose.model("Bookmark", bookmarkSchema);
