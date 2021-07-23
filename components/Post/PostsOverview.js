import PostSkeleton from "./PostSkeleton";
import CardPost from "./CardPost";

import usePosts from "@/hooks/usePosts";

const PostsOverview = () => {
	const { posts, isLoading, isError } = usePosts();

	if (isLoading)
		return Array(8)
			.fill()
			.map((_, index) => <PostSkeleton key={index + Math.random()} />);
	if (isError) return <p>Something went wrong please refresh.</p>;

	return (
		<div className="flex flex-col space-y-4">
			{posts.map((post) => (
				<CardPost key={post._id} post={post} />
			))}
		</div>
	);
};

export default PostsOverview;
