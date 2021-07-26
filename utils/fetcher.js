import axios from "axios";
import { request, gql } from "graphql-request";

const PostsQuery = gql`
	query {
		posts {
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
				date
			}
			createdAt
		}
	}
`;

export const getPosts = async () => {
	const { posts } = await request("/api/graphql", PostsQuery);
	return posts;
};
