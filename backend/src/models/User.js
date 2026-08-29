import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.set("toJSON", {
  transform(_doc, ret) {
    delete ret.passwordHash;
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const User = mongoose.model("User", userSchema);

export default User;