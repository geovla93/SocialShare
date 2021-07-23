import axios from "axios";

export const getPosts = async () => {
	const res = await axios.get("/api/posts");
	return res.data;
};

export const getPostComments = async (postId) => {
	const res = await axios.get(`/api/posts/${postId}/comments`);
	return res.data;
};
