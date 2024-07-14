import mongoose from "mongoose";

const AuthTokenSchema = new mongoose.Schema(
  {
    spotify_user_id: {
      type: String,
      required: true,
      unique: true,
    },
    access_token: {
      type: String,
      required: true,
      unique: true,
    },
    refresh_token: {
      type: String,
      required: true,
      unique: true,
    },
    valid_until: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const AuthToken =
  (mongoose.models && mongoose.models.tokens) ||
  mongoose.model("tokens", AuthTokenSchema);

export default AuthToken;
