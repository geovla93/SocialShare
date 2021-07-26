import gql from "graphql-tag";

export const typeDefs = gql`
	type Query {
		posts: [Post!]
	}

	type Mutation {
		submitPost(text: String!, location: String, picUrl: String): Post
		deletePost(postId: String!): String
		likePost(postId: String!): Like
		unlikePost(postId: String!): String
		submitComment(postId: String!, text: String!): String
		deleteComment(postId: String!, commentId: String!): String
	}

	scalar Date

	enum Role {
		user
		admin
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
