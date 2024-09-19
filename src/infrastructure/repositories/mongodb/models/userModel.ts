import mongoose, { Schema, Document } from "mongoose";
interface Iuser extends Document {
  email: string;
  password: string;
  isActive: boolean;
  role: string;
  gender: string;
  Username: string;
  refreshToken?:string
}
const userSchema: Schema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  role: { type: String, default: "user" },
  gender: { type: String, required: true },
  refreshToken: { type: String, required: true },
});

const userModel = mongoose.model<Iuser>("User", userSchema);
export default userModel;
