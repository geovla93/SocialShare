import { useMutation, useQueryClient } from "react-query";

import { submitComment } from "@/utils/post";

const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation(submitComment, {
    onSuccess: () => {
      queryClient.invalidateQueries("posts");
    },
  });
};

export default useCreateComment;
