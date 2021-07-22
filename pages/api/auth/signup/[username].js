import dbConnect from "@/lib/db/dbConnect";
import User from "@/models/User";

const regexUserName = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/;

export default async function handler(req, res) {
	if (req.method === "GET") {
		const { username } = req.query;

		try {
			if (username.length < 1) {
				res.status(400).json("Invalid username");
				return;
			}

			if (!regexUserName.test(username)) {
				res.status(400).json("Invalid username");
				return;
			}

			await dbConnect();

			const user = await User.findOne({ username: username.toLowerCase() });
			if (user) {
				res.status(400).json("Username already taken");
				return;
			}

			res.status(200).json("Available");
			return;
		} catch (error) {
			console.log(error);
			res.status(500).json("Server error:", error);
			return;
		}
	}
}
