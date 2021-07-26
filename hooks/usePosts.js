import { useQuery } from "react-query";
import { getPosts } from "@/utils/fetcher";

const usePosts = () => {
	return useQuery("posts", getPosts);
};

export default usePosts;
