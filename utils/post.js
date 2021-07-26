import axios from "axios";
import { request, gql } from "graphql-request";

const SubmitPostMutation = gql`
	mutation SubmitPostMutation(
		$text: String!
		$location: String
		$picUrl: String
	) {
		submitPost(text: $text, location: $location, picUrl: $picUrl) {
			_id
			user {
				_id
				name
				email
				username
				bio
				profilePicUrl
				role
			}
			text
			location
			picUrl
			likes {
				user
			}
			comments {
				_id
				text
				user {
					_id
					name
					email
					username
					bio
					profilePicUrl
					role
				}
				date
			}
			createdAt
		}
	}
`;

const DeletePostMutation = gql`
	mutation DeletePostMutation($postId: String!) {
		deletePost(postId: $postId)
	}
`;

const LikePostMutation = gql`
	mutation LikePostMutation($postId: String!) {
		likePost(postId: $postId) {
			user
		}
	}
`;

const UnlikePostMutation = gql`
	mutation UnlikePostMutation($postId: String!) {
		unlikePost(postId: $postId)
	}
`;

const SubmitCommentMutation = gql`
	mutation SubmitCommentMutation($postId: String!, $text: String!) {
		submitComment(postId: $postId, text: $text)
	}
`;

const DeleteCommentMutation = gql`
	mutation DeleteCommentMutation($postId: String!, $commentId: String!) {
		deleteComment(postId: $postId, commentId: $commentId)
	}
`;

export const submitPost = async ({ data, picUrl }) => {
	try {
		const post = await request("/api/graphql", SubmitPostMutation, {
			...data,
			picUrl,
		});
		return post;
	} catch (error) {
		console.error(error);
	}
};

export const deletePost = async ({ postId }) => {
	try {
		await request("/api/graphql", DeletePostMutation, { postId });
	} catch (error) {
		console.error(error);
	}
};

export const likePost = async ({ postId, isLiked }) => {
	try {
		if (isLiked) {
			await request("/api/graphql", UnlikePostMutation, { postId });
		} else {
			await request("/api/graphql", LikePostMutation, { postId });
		}
	} catch (error) {
		console.error(error);
	}
};

export const submitComment = async ({ postId, text }) => {
	try {
		await request("/api/graphql", SubmitCommentMutation, { postId, text });
	} catch (error) {
		console.error(error);
	}
};

export const deleteComment = async ({ postId, commentId }) => {
	try {
		await request("/api/graphql", DeleteCommentMutation, { postId, commentId });
	} catch (error) {
		console.error(error);
	}
};
