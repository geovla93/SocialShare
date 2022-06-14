import { FC } from "react";
import Link from "next/link";
import { XIcon } from "@heroicons/react/outline";
import { useSession } from "next-auth/react";

import ProfilePic from "../Shared/ProfilePic";
import useDeleteComment from "@/hooks/useDeleteComment";
import { Comment } from "@/models";

type PostCommentProps = {
  comment: Comment;
  postId: string;
};

const PostComment: FC<PostCommentProps> = ({ comment, postId }) => {
  const { data: session } = useSession();
  const { mutateAsync } = useDeleteComment();

  const handleDeleteComment = async () => {
    await mutateAsync({ postId, commentId: comment.id });
  };

  return (
    <div className="flex items-center space-x-4">
      <Link href={`/profile/${comment.user?.username}`}>
        <a>
          {comment.user && (
            <ProfilePic
              style="w-8 h-8 self-start cursor-pointer"
              src={comment.user.image}
              alt={comment.user.name}
            />
          )}
        </a>
      </Link>
      <div className="flex flex-col border border-gray-200 rounded-2xl px-4 py-1 bg-gray-200">
        <h3 className="font-medium text-blue-500 hover:underline cursor-pointer">
          {comment.user?.name}
        </h3>
        <p>{comment.text}</p>
      </div>
      {session?.user.role === "admin" ||
        (session?.user.id === comment.user?.id && (
          <span
            className="rounded-full p-1 bg-red-500 cursor-pointer"
            onClick={handleDeleteComment}
          >
            <XIcon className="w-4 h-4 text-gray-50" />
          </span>
        ))}
    </div>
  );
};

export default PostComment;
