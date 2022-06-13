import { signIn, SignInResponse } from "next-auth/react";
import { request, gql } from "graphql-request";

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

export const registerUser = async (
  user: {
    name: string;
    email: string;
    password: string;
    username: string;
    bio: string;
  },
  profilePicUrl?: string
) => {
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

export const loginUser = async (user: { email: string; password: string }) => {
  try {
    const res = await signIn<"credentials">("credentials", {
      redirect: false,
      email: user.email,
      password: user.password,
    });

    return res;
  } catch (error) {
    throw error;
  }
};

type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> &
      Partial<Record<Exclude<Keys, K>, undefined>>;
  }[Keys];
