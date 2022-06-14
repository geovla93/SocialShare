import { useMutation, useQueryClient } from "react-query";

import { submitComment } from "@/utils/post";

const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation(submitComment, {
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries("posts");
      queryClient.invalidateQueries(["comments", variables.postId]);
    },
  });
};

export default useCreateComment;
