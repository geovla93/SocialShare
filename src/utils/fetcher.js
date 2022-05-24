import { request, gql } from "graphql-request";

const PostsQuery = gql`
	query PostsQuery($pageNumber: Int!) {
		posts(pageNumber: $pageNumber) {
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

const UsersQuery = gql`
	query UsersQuery($name: String!) {
		users(name: $name) {
			_id
			name
			username
			profilePicUrl
		}
	}
`;

export const getPosts = async (pageNumber) => {
	const { posts } = await request("/api/graphql", PostsQuery, {
		pageNumber,
	});

	return {
		posts,
		nextId: posts.length > 0 ? pageNumber + 1 : undefined,
	};
};

export const getUsers = async (name) => {
	if (name.length === 0) return;
	const { users } = await request("/api/graphql", UsersQuery, { name });
	return users;
};
