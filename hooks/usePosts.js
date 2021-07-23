import { useQuery } from "react-query";
import { getPosts } from "@/utils/fetcher";

const usePosts = () => {
	const { data, error, isLoading } = useQuery("posts", getPosts);

	return {
		posts: data,
		isLoading,
		isError: error,
	};
};

export default usePosts;
