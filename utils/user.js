import { signIn } from "next-auth/client";
import { request, gql } from "graphql-request";
import { toast } from "react-toastify";

const SignUpMutation = gql`
	mutation SignUpMutation(
		$name: String!
		$email: String!
		$password: String!
		$username: String!
		$bio: String!
		$profilePicUrl: String
	) {
		signUp(
			user: {
				name: $name
				email: $email
				password: $password
				username: $username
				bio: $bio
			}
			profilePicUrl: $profilePicUrl
		) {
			_id
			name
			email
			createdAt
		}
	}
`;

export const registerUser = async (user, profilePicUrl) => {
	try {
		const response = await request("/api/graphql", SignUpMutation, {
			...user,
			profilePicUrl,
		});

		return response;
	} catch (error) {
		return JSON.parse(JSON.stringify(error, null, 2));
	}
};

export const loginUser = async (user) => {
	try {
		const res = await signIn("credentials", {
			redirect: false,
			email: user.email,
			password: user.password,
		});

		return res;
	} catch (error) {
		return error;
	}
};
