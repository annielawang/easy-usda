const { Schema, model } = require("mongoose");
// const { foodSchema } = require("./Food");
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
      required: true,
      unique: true,
      match: [/.+@.+\..+/, "Must use a valid email address"],
    },
    password: {
      type: String,
      required: true,

      minlength: 5,
    },

    // // set savedFoods to be an array of data that adheres to the foodSchema
    //  savedFood: [foodSchema],
    // // set this to use virtual below
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

// set up pre-save middleware to create password
userSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

// compare the incoming password with the hashed password
userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// userSchema.virtual("foodCount").get(function () {
//   return this.savedFood.length;
// });

const User = model("User", userSchema);

module.exports = User;
