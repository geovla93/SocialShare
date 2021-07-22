import axios from "axios";

export const fetcher = async (...args) => {
	const res = await axios.get(args[0]);
	return res.data;
};
