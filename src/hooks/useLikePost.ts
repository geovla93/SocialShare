import { useMutation, useQueryClient } from "react-query";

import { likePost } from "@/utils/post";

const useLikePost = () => {
  const queryClient = useQueryClient();

  return useMutation(likePost, {
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries("posts");
      queryClient.invalidateQueries(["likes", variables.postId]);
    },
  });
};

export default useLikePost;
