import { useMutation, useQueryClient } from "react-query";

import { likePost } from "@/utils/post";

const useLikePost = () => {
  const queryClient = useQueryClient();

  return useMutation(likePost, {
    onSuccess: () => {
      queryClient.invalidateQueries("posts");
    },
  });
};

export default useLikePost;
