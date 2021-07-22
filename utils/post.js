import axios from "axios";

export const submitPost = async (data, picUrl, setError) => {
	try {
		await axios.post("/api/posts", { ...data, picUrl });
	} catch (error) {
		setError(error);
		console.error(error);
	}
};

export const deletePost = async (postId, setErrorMessage) => {
	try {
		await axios.delete(`/api/posts/${postId}`);
	} catch (error) {
		setErrorMessage(error);
		console.error(error);
	}
};

export const likePost = async (postId, isLiked, setErrorMessage) => {
	try {
		if (isLiked) {
			await axios.patch(`/api/posts/${postId}/unlike`);
		} else {
			await axios.patch(`/api/posts/${postId}/like`);
		}
	} catch (error) {
		setErrorMessage(error);
		console.error(error);
	}
};

export const submitComment = async (postId, text, setErrorMessage) => {
	try {
		await axios.post(`/api/posts/${postId}/comment`, { text });
	} catch (error) {
		setErrorMessage(error);
		console.error(error);
	}
};

export const deleteComment = async (postId, commentId, setErrorMessage) => {
	try {
		await axios.delete(`/api/posts/${postId}/${commentId}`);
	} catch (error) {
		setErrorMessage(error);
		console.error(error);
	}
};
