const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      match: [/.+@.+\..+/, "Must use a valid email address"],
      trim: true,
    },
    password: {
      type: String,
      required: function () {
        return !this.githubId; //password required if no GitHub account
      },
    },
    githubId: {
      type: String,
      unique: true,
      sparse: true, //allows null values but ensures uniqueness when present
    },
  },
  { timestamps: true } //automatically add createdAt and updatedAt fields
);

//password hashing middleware; only for local auth
userSchema.pre("save", async function (next) {
  if (this.isModified("password") && this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

////custom method to compare and validate password for logging in
userSchema.methods.isCorrectPassword = function (password) {
  return bcrypt.compare(password, this.password);
};

//compile and export model
module.exports = mongoose.model("User", userSchema);
