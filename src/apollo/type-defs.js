import gql from "graphql-tag";

export const typeDefs = gql`
	type Query {
		posts(pageNumber: Int!): [Post!]
		isUsernameAvailable(username: String!): Boolean!
		users(name: String!): [User!]
	}

	type Mutation {
		submitPost(text: String!, location: String, picUrl: String): Post
		deletePost(postId: String!): String
		likePost(postId: String!): Like
		unlikePost(postId: String!): String
		submitComment(postId: String!, text: String!): String
		deleteComment(postId: String!, commentId: String!): String
		signUp(user: UserInfo!, profilePicUrl: String): User
	}

	scalar Date

	enum Role {
		user
		admin
	}

	input UserInfo {
		name: String!
		email: String!
		password: String!
		username: String!
		bio: String!
	}

	type User {
		_id: ID!
		name: String!
		email: String!
		username: String!
		bio: String
		profilePicUrl: String!
		role: Role!
		createdAt: Date!
	}

	type Post {
		_id: ID!
		user: User!
		text: String!
		location: String
		picUrl: String
		likes: [Like!]
		comments: [Comment!]
		createdAt: Date!
	}

	type Like {
		_id: ID!
		user: String!
	}

	type Comment {
		_id: ID!
		user: User!
		text: String!
		date: Date!
	}
`;
