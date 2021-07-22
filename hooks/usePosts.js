import useSWR from "swr";
import { fetcher } from "@/utils/fetcher";

const usePosts = () => {
	const { data, error } = useSWR("/api/posts", fetcher);

	return {
		posts: data,
		isLoading: !data && !error,
		isError: error,
	};
};

export default usePosts;
