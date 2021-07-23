import Image from "next/image";
import { useRouter } from "next/router";
import { useState, useRef } from "react";
import { useSession } from "next-auth/client";
import { XIcon, ThumbUpIcon, ChatAltIcon } from "@heroicons/react/outline";
import { ThumbUpIcon as ThumpUpSolidIcon } from "@heroicons/react/solid";

import Card from "../Shared/Card";
import ProfilePic from "../Shared/ProfilePic";
import CommentInputField from "./CommentInputField";
import PostCommentsOverview from "./PostCommentsOverview";

import calculateDate from "@/utils/calculateDate";
import useDeletePost from "@/hooks/useDeletePost";
import useLikePost from "@/hooks/useLikePost";
import useCreateComment from "@/hooks/useCreateComment";

const CardPost = ({ post }) => {
	const [errorMessage, setErrorMessage] = useState(false);
	const [session] = useSession();
	const router = useRouter();
	const deleteMutation = useDeletePost();
	const likeMutation = useLikePost();
	const commentMutation = useCreateComment();
	const commentRef = useRef();

	const postDate = calculateDate(post.createdAt);
	const likeByUser =
		post.likes.length > 0 &&
		post.likes.find((like) => like.user === session.user._id);
	const isLiked =
		post.likes.length > 0 &&
		post.likes.filter((like) => like.user === session.user._id).length > 0;

	const handleProfilePrefetch = (username) =>
		router.prefetch(`/profile/${username}`);
	const handleProfileRedirect = () =>
		router.push(`/profile/${post.user.username}`);

	const handleDeletePost = async () => {
		try {
			await deleteMutation.mutateAsync({ postId: post._id });
		} catch (error) {
			setErrorMessage(error);
		}
	};

	const handleLikePost = async () => {
		try {
			await likeMutation.mutateAsync({ postId: post._id, isLiked });
		} catch (error) {
			setErrorMessage(error);
		}
	};

	const handleSubmitComment = async (text) => {
		try {
			await commentMutation.mutateAsync({ postId: post._id, text });
		} catch (error) {
			setErrorMessage(error);
		}
	};

	return (
		<Card>
			<div className="flex flex-col space-y-2">
				<div className="flex items-center space-x-4">
					<ProfilePic
						styles="w-10 h-10 cursor-pointer"
						imageSrc={post.user.profilePicUrl}
						imageAlt={post.user.name}
						click
						handleClick={handleProfileRedirect}
						hover
						handleHover={handleProfilePrefetch}
					/>
					<div className="flex-1">
						<h3 className="text-blue-500 text-xl font-semibold">
							{post.user.name}
						</h3>
						<p className="text-gray-400 italic font-light">{postDate}</p>
					</div>
					{session.user.role === "admin" ||
						(session.user._id === post.user._id && (
							<span
								className="p-2 rounded-full hover:bg-gray-300 transition-colors duration-300 ease-in-out cursor-pointer"
								onClick={handleDeletePost}
							>
								<XIcon className="w-6 h-6" />
							</span>
						))}
				</div>
				<p className="text-gray-800 text-lg">{post.text}</p>
				{post.picUrl && (
					<div className="relative w-full h-full">
						<Image
							className="object-cover object-center"
							src={post.picUrl}
							alt={`Post photo from ${post.user.name}`}
							width={500}
							height={500}
							layout="responsive"
						/>
					</div>
				)}
				<div className="flex items-center justify-between">
					<span className="text-gray-700 font-light flex items-center space-x-2">
						<span className="p-1 rounded-full bg-blue-500">
							<ThumpUpSolidIcon className="w-3 h-3 text-gray-50" />
						</span>
						<span>
							{likeByUser
								? post.likes.length === 1
									? "You"
									: `You and ${post.likes.length - 1} more`
								: post.likes.length}
						</span>
						{/* {post.likes.length} {post.likes.length === 1 ? "like" : "likes"} */}
					</span>
					<p className="text-gray-700">
						{post.comments.length}{" "}
						{post.comments.length === 1 ? "comment" : "comments"}
					</p>
				</div>
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
						onClick={() => commentRef.current.focus()}
					>
						<ChatAltIcon className="w-6 h-6 text-gray-700 group-hover:text-blue-400 transition-colors duration-300 ease-in-out" />
						<p className="text-lg text-gray-700 group-hover:text-blue-400 transition-colors duration-300 ease-in-out">
							Comment
						</p>
					</div>
				</div>
				<div className="bg-gray-400 h-px" ref={commentRef} />
				<PostCommentsOverview comments={post.comments} postId={post._id} />
				<CommentInputField
					ref={commentRef}
					onAddComment={handleSubmitComment}
				/>
			</div>
		</Card>
	);
};

export default CardPost;
