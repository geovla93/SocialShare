import mongoose from "mongoose";

const Schema = mongoose.Schema;

const PostSchema = new Schema(
	{
		user: { type: Schema.Types.ObjectId, ref: "User" },
		text: { type: String, required: true },
		location: { type: String },
		picUrl: { type: String },
		likes: [
			{
				user: { type: Schema.Types.ObjectId, ref: "User" },
			},
		],
		comments: [
			{
				user: { type: Schema.Types.ObjectId, ref: "User" },
				text: { type: String, required: true },
				date: { type: Date, default: Date.now },
			},
		],
	},
	{ timestamps: true }
);

export default mongoose.models.Post || mongoose.model("Post", PostSchema);
