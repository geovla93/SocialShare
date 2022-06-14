import { useInfiniteQuery } from "react-query";

import { getPosts } from "@/utils/fetcher";

const usePosts = () => {
  return useInfiniteQuery("posts", ({ pageParam = 1 }) => getPosts(pageParam), {
    getNextPageParam: (lastPage) => lastPage.nextId ?? undefined,
    keepPreviousData: true,
  });
};

export default usePosts;
