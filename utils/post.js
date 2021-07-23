import axios from "axios";

export const submitPost = async ({ data, picUrl }) => {
	try {
		await axios.post("/api/posts", {
			...data,
			picUrl,
		});
	} catch (error) {
		console.error(error);
	}
};

export const deletePost = async ({ postId }) => {
	try {
		await axios.delete(`/api/posts/${postId}`);
	} catch (error) {
		console.error(error);
	}
};

export const likePost = async ({ postId, isLiked }) => {
	try {
		if (isLiked) {
			await axios.patch(`/api/posts/${postId}/unlike`);
		} else {
			await axios.patch(`/api/posts/${postId}/like`);
		}
	} catch (error) {
		console.error(error);
	}
};

export const submitComment = async ({ postId, text }) => {
	try {
		await axios.post(`/api/posts/${postId}/comments`, { text });
	} catch (error) {
		console.error(error);
	}
};

export const deleteComment = async ({ postId, commentId }) => {
	try {
		await axios.delete(`/api/posts/${postId}/${commentId}`);
	} catch (error) {
		console.error(error);
	}
};
