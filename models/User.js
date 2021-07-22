import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true, select: false },
		username: { type: String, required: true, unique: true, trim: true },
		bio: { type: String, required: true },
		profilePicUrl: { type: String },
		role: { type: String, default: "user", enum: ["user", "admin"] },
	},
	{ timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
