import { useState, useRef, FC } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import { XIcon, ThumbUpIcon, ChatAltIcon } from "@heroicons/react/outline";

import Card from "../Shared/Card";
import ProfilePic from "../Shared/ProfilePic";
import CommentInputField from "./CommentInputField";
import PostCommentsOverview from "./PostCommentsOverview";
import PostStatsBar from "./PostStatsBar";
import calculateDate from "@/utils/calculateDate";
import useDeletePost from "@/hooks/useDeletePost";
import useLikePost from "@/hooks/useLikePost";
import useCreateComment from "@/hooks/useCreateComment";
import { Post } from "@/models";

const PostModal = dynamic(() => import("./PostModal"));

type CartPostProps = {
  post: Post;
};

const CardPost: FC<CartPostProps> = ({ post }) => {
  const [errorMessage, setErrorMessage] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { data: session } = useSession();
  const deleteMutation = useDeletePost();
  const likeMutation = useLikePost();
  const commentMutation = useCreateComment();
  const commentRef = useRef<HTMLInputElement>(null);

  const postDate = calculateDate(post.createdAt);
  const isLiked =
    post.likesCount > 0 &&
    !!post.likes?.find((like) => like.userId === session?.user.id);

  const handleDeletePost = async () => {
    try {
      await deleteMutation.mutateAsync({ postId: post.id });
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  const handleLikePost = async () => {
    try {
      // TODO: fetch likes from server
      // await likeMutation.mutateAsync({ postId: post.id, isLiked });
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  const handleSubmitComment = async (text: string) => {
    try {
      await commentMutation.mutateAsync({ postId: post.id, text });
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  return (
    <Card>
      <div className="flex flex-col space-y-2">
        <div className="flex items-center space-x-4">
          <Link href={`/profile/${post.user?.username}`}>
            <ProfilePic
              style="w-10 h-10 cursor-pointer"
              src={post.user?.image ?? ""}
              alt={post.user?.name ?? ""}
            />
          </Link>
          <div className="flex-1">
            <Link href={`/profile/${post.user?.username}`}>
              <a className="text-blue-500 text-xl font-semibold cursor-pointer">
                {post.user?.name}
              </a>
            </Link>
            <p className="text-gray-400 italic font-light">{postDate}</p>
          </div>
          {session?.user.role === "admin" ||
            (session?.user.id === post.user?.id && (
              <span
                className="p-2 rounded-full hover:bg-gray-300 transition-colors duration-300 ease-in-out cursor-pointer"
                onClick={handleDeletePost}
              >
                <XIcon className="w-6 h-6" />
              </span>
            ))}
        </div>
        <p className="text-gray-800 text-lg">{post.text}</p>
        {post.image && (
          <div
            className="relative w-full h-full cursor-pointer"
            onClick={() => setShowModal(true)}
          >
            <Image
              className="object-cover object-center"
              src={post.image}
              alt={`Post photo from ${post.user?.name}`}
              width={500}
              height={500}
              layout="responsive"
            />
          </div>
        )}
        <PostModal
          showModal={showModal}
          setShowModal={setShowModal}
          post={post}
          isLiked={isLiked}
          onAddComment={handleSubmitComment}
          onLikePost={handleLikePost}
        />
        <PostStatsBar
          isLiked={isLiked}
          likesCount={post.likesCount}
          commentsCount={post.commentsCount}
        />
        <div className="bg-gray-400 h-px" />
        <div className="flex items-center space-x-4">
          <div
            className="flex-1 flex items-center justify-center space-x-2 py-1 rounded hover:bg-gray-700 cursor-pointer transition-colors duration-300 ease-in-out group"
            onClick={handleLikePost}
          >
            <ThumbUpIcon
              className={`w-6 h-6 ${
                isLiked ? "text-blue-400" : "text-gray-700"
              } group-hover:text-blue-400 transition-colors duration-300 ease-in-out`}
            />
            <p
              className={`text-lg ${
                isLiked ? "text-blue-400" : "text-gray-700"
              } group-hover:text-blue-400 transition-colors duration-300 ease-in-out`}
            >
              Like!
            </p>
          </div>
          <div
            className="flex-1 flex items-center justify-center space-x-2 py-1 rounded hover:bg-gray-700 cursor-pointer transition-colors duration-300 ease-in-out group"
            onClick={() => commentRef.current?.focus()}
          >
            <ChatAltIcon className="w-6 h-6 text-gray-700 group-hover:text-blue-400 transition-colors duration-300 ease-in-out" />
            <p className="text-lg text-gray-700 group-hover:text-blue-400 transition-colors duration-300 ease-in-out">
              Comment
            </p>
          </div>
        </div>
        <div className="bg-gray-400 h-px" />
        <PostCommentsOverview postId={post.id} setShowModal={setShowModal} />
        <CommentInputField
          ref={commentRef}
          onAddComment={handleSubmitComment}
        />
      </div>
    </Card>
  );
};

export default CardPost;
