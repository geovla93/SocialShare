/* eslint-disable no-unused-vars */
import { Dispatch, FC, SetStateAction, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Dialog, Transition } from "@headlessui/react";
import { ThumbUpIcon, ChatAltIcon, XIcon } from "@heroicons/react/outline";
import cn from "classnames";

import PostCommentsOverview from "./PostCommentsOverview";
import CommentInputField from "./CommentInputField";
import PostStatsBar from "./PostStatsBar";
import calculateDate from "@/utils/calculateDate";
import { Post } from "@/models";

type PostModalProps = {
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  post: Post;
  isLiked: boolean;
  onAddComment: (comment: string) => void;
  onLikePost: () => void;
};

const PostModal: FC<PostModalProps> = ({
  showModal,
  setShowModal,
  post,
  isLiked,
  onAddComment,
  onLikePost,
}) => {
  const commentRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLParagraphElement>(null);
  const time = calculateDate(post.createdAt.toString());

  return (
    <Transition
      show={showModal}
      enter="transition duration-100 ease-out"
      enterFrom="transform scale-95 opacity-0"
      enterTo="transform scale-100 opacity-100"
      leave="transition duration-75 ease-out"
      leaveFrom="transform scale-100 opacity-100"
      leaveTo="transform scale-95 opacity-0"
    >
      <Dialog
        open={showModal}
        onClose={() => setShowModal(false)}
        className="fixed z-10 inset-0 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-50" />
          <div
            className={cn(
              "relative flex w-4/5 mx-auto bg-white border shadow-md rounded md:space-x-4",
              {
                "flex-col md:flex-row max-w-screen-2xl": !!post.image,
                "flex-col max-w-screen-sm": !post.image,
              }
            )}
          >
            {post.image && (
              <div className="flex-1 w-[500px] h-[500px] relative">
                <Image
                  className="rounded-t md:rounded-tr-none md:rounded-l"
                  src={post.image}
                  alt="PostImage"
                  layout="fill"
                  objectFit="contain"
                />
              </div>
            )}
            <span
              className="absolute top-2 right-2 cursor-pointer p-2 hover:bg-gray-200 hover:bg-opacity-50 transition-colors duration-200 ease-in-out rounded-full"
              onClick={() => setShowModal(false)}
            >
              <XIcon className="h-6 w-6 text-blue-500" />
            </span>
            <div className="flex-1">
              <div className="p-2 flex flex-col space-y-3">
                <div className="flex justify-around items-center space-x-3">
                  <span className="relative w-10 h-10 flex">
                    {post.user && (
                      <Image
                        className="rounded-full"
                        src={post.user.image}
                        alt={post.user.name}
                        width={100}
                        height={100}
                      />
                    )}
                  </span>
                  <div className="flex-1 flex flex-col -space-y-1">
                    <Dialog.Title className="text-xl md:text-2xl text-blue-400 outline-none">
                      <Link href={`/profile/${post.user?.username}`}>
                        <a className="font-bold">{post.user?.name}</a>
                      </Link>
                    </Dialog.Title>
                    <span className="text-gray-400 italic text-sm">
                      {time}
                      {post.location && ` - ${post.location}`}
                    </span>
                  </div>
                  {/* {(session.user.role === "root" ||
								post.user._id === session.user._id) && (
								<TrashIcon
									className="h-6 w-6 text-red-600 cursor-pointer"
									onClick={handleDeletePost}
								/>
							)} */}
                  {/* {(session.user.role === "root" ||
						post.user._id === session.user._id) && (
						<div>
							<h4>Are you sure?</h4>
							<p>This action is irreversible</p>
							<button>Delete</button>
						</div>
					)} */}
                </div>
                <Dialog.Description className="text-gray-800">
                  {post.text}
                </Dialog.Description>
                <PostStatsBar
                  isLiked={isLiked}
                  likesCount={post.likesCount}
                  commentsCount={post.commentsCount}
                />
                <div className="bg-gray-400 h-px" />
                <div className="flex items-center space-x-4">
                  <div
                    className="flex-1 flex items-center justify-center space-x-2 py-1 rounded hover:bg-gray-700 cursor-pointer transition-colors duration-300 ease-in-out group"
                    onClick={onLikePost}
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
                      ref={modalRef}
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
                <PostCommentsOverview
                  postId={post.id}
                  isModal={showModal}
                  style="overflow-y-scroll h-40 md:h-24 lg:h-32 xl:h-40 2xl:h-48 py-3 max-h-full"
                  setShowModal={setShowModal}
                />
                <CommentInputField
                  onAddComment={onAddComment}
                  ref={commentRef}
                />
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default PostModal;
