import { useQuery } from "react-query";

import { getPostLikes } from "@/utils/post";

const useLikes = (postId?: string) => {
  return useQuery(["likes", postId], () => getPostLikes(postId!), {
    enabled: !!postId,
  });
};

export default useLikes;
