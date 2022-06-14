import { useMutation, useQueryClient } from "react-query";

import { deleteComment } from "@/utils/post";

const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation(deleteComment, {
    onSuccess: () => {
      queryClient.invalidateQueries("posts");
    },
  });
};

export default useDeleteComment;
