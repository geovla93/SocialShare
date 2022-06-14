import { useMutation, useQueryClient } from "react-query";

import { deletePost } from "@/utils/post";

const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation(deletePost, {
    onSuccess: () => {
      queryClient.invalidateQueries("posts");
    },
  });
};

export default useDeletePost;
