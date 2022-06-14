import { useMutation, useQueryClient } from "react-query";

import { submitPost } from "@/utils/post";

const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation(submitPost, {
    onSuccess: () => {
      queryClient.invalidateQueries("posts");
    },
  });
};

export default useCreatePost;
