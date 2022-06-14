import { Dispatch, FC, SetStateAction } from "react";
import cn from "classnames";

import PostComment from "./PostComment";
import useComments from "@/hooks/useComments";

type PostCommentsOverviewProps = {
  postId: string;
  isModal?: boolean;
  style?: string;
  setShowModal: Dispatch<SetStateAction<boolean>>;
};

const PostCommentsOverview: FC<PostCommentsOverviewProps> = ({
  postId,
  isModal,
  style,
  setShowModal,
}) => {
  const { data: comments } = useComments(postId);
  if (!comments) return <></>;

  return (
    <>
      {!isModal && comments?.length > 2 && (
        <button
          className="self-start text-gray-700 hover:underline"
          onClick={() => setShowModal(true)}
        >
          View all comments
        </button>
      )}
      <div className={cn("flex flex-col space-y-2 px-3", style)}>
        {comments.length > 0 && !isModal
          ? comments.map(
              (comment, index) =>
                index < 2 && (
                  <PostComment
                    key={comment.id}
                    comment={comment}
                    postId={postId}
                  />
                )
            )
          : comments.map((comment) => (
              <PostComment key={comment.id} comment={comment} postId={postId} />
            ))}
      </div>
    </>
  );
};

export default PostCommentsOverview;
