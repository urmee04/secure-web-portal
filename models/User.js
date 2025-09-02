const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

//user schema supporting both local and GitHub OAuth authentication
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true, //ensure usernames are unique
      trim: true, //remove whitespace from both ends
      minlength: 3, //minimum username length
      maxlength: 50, //maximum username length
    },
    email: {
      type: String,
      unique: true,
      sparse: true, //allow null/undefined values while maintaining uniqueness for non-null values
      lowercase: true, // Convert email to lowercase for consistency
      trim: true, //remove whitespace
      match: [/^.+@.+\..+$/, "Must use a valid email address"], // Basic email format validation
    },
    password: {
      type: String,
      //required only for local accounts (not required for GitHub OAuth users)
      required: function () {
        return !this.githubId; //password required if no GitHub ID exists
      },
      select: false, //exclude password from queries by default for security
    },
    githubId: {
      type: String,
      unique: true,
      sparse: true, //allow null/undefined for non-GitHub users
    },
  },
  { timestamps: true } //automatically add createdAt and updatedAt fields
);

//pre-save middleware to hash password before saving
userSchema.pre("save", async function (next) {
  //only hash password if it has been modified and is present
  if (this.isModified("password") && this.password) {
    //hash password with salt rounds of 10
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

//instance method to compare provided password with hashed password
userSchema.methods.isCorrectPassword = function (password) {
  //when using this method, ensure password field is selected in query
  //since it's excluded by default (select: false)
  return bcrypt.compare(password, this.password);
};

module.exports = model("User", userSchema);
