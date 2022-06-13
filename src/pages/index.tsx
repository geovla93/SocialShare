import type { GetServerSideProps, NextPage } from "next";
import { getSession } from "next-auth/react";

import CreatePost from "@/components/Post/CreatePost";
import PostsOverview from "@/components/Post/PostsOverview";

const HomePage: NextPage = () => {
  return (
    <div className="flex flex-col space-y-6 md:w-2/3 lg:w-1/2 max-w-screen-xl mx-auto">
      <CreatePost />

      <PostsOverview />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);
  if (!session) {
    return { redirect: { destination: "/auth/signin", permanent: false } };
  }

  return {
    props: {
      session,
    },
  };
};

export default HomePage;
