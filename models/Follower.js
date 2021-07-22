import mongoose from "mongoose";

const Schema = mongoose.Schema;

const FollowerSchema = new Schema({
	user: { type: Schema.Types.ObjectId, ref: "User" },
	followers: [
		{
			user: { type: Schema.Types.ObjectId, ref: "User" },
		},
	],
	following: [
		{
			user: { type: Schema.Types.ObjectId, ref: "User" },
		},
	],
});

export default mongoose.models.Follower ||
	mongoose.model("Follower", FollowerSchema);
