import axios from "axios";
import { signIn } from "next-auth/client";

export const registerUser = async (user, profilePicUrl, setErrorMessage) => {
	try {
		const res = await axios.post("/api/auth/signup", { user, profilePicUrl });

		const result = res.statusText;
		if (result !== "OK") setErrorMessage(res.data);
	} catch (error) {
		setErrorMessage(error);
	}
};

export const loginUser = async (user, setErrorMessage) => {
	try {
		const res = await signIn("credentials", {
			redirect: false,
			email: user.email,
			password: user.password,
		});

		return res;
	} catch (error) {
		setErrorMessage(error);
		return;
	}
};
