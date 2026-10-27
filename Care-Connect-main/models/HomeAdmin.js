// import mongoose from "mongoose";

// const HomeAdminSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,
//     unique: true,
//     required: true,
//   },
//   password: {
//     type: String,
//     required: true,
//   },
//   home: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Home",
//     required: true, // each homeAdmin is tied to ONE home
//   },
//   role: {
//     type: String,
//     default: "homeAdmin",
//   },
// });

// export default mongoose.models.HomeAdmin ||
//   mongoose.model("HomeAdmin", HomeAdminSchema);

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const HomeAdminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  home: { type: mongoose.Schema.Types.ObjectId, ref: "Home", required: true }
});

// hash password before save
HomeAdminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// method to compare passwords
HomeAdminSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.models.HomeAdmin || mongoose.model("HomeAdmin", HomeAdminSchema);
