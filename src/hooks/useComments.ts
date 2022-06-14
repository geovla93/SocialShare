import { useQuery } from "react-query";

import { getPostComments } from "@/utils/post";

const useComments = (postId?: string) => {
  return useQuery(["comments", postId], () => getPostComments(postId!), {
    enabled: !!postId,
  });
};

export default useComments;
