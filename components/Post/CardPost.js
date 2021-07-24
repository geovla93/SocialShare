import Image from "next/image";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { useState, useRef } from "react";
import { useSession } from "next-auth/client";
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

const PostModal = dynamic(() => import("./PostModal"));

const CardPost = ({ post }) => {
	const [errorMessage, setErrorMessage] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [session] = useSession();
	const router = useRouter();
	const deleteMutation = useDeletePost();
	const likeMutation = useLikePost();
	const commentMutation = useCreateComment();
	const commentRef = useRef();

	const postDate = calculateDate(post.createdAt);
	const isLiked =
		post.likes.length > 0 &&
		!!post.likes.find((like) => like.user === session.user._id);
	const handleProfilePrefetch = (username) =>
		router.prefetch(`/profile/${username}`);
	const handleProfileRedirect = (username) =>
		router.push(`/profile/${username}`);

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
						handleClick={handleProfileRedirect.bind(null, post.user.username)}
						hover
						handleHover={handleProfilePrefetch.bind(null, post.user.username)}
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
					<div
						className="relative w-full h-full cursor-pointer"
						onClick={() => setShowModal(true)}
					>
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
					likes={post.likes}
					comments={post.comments}
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
						onClick={() => commentRef.current.focus()}
					>
						<ChatAltIcon className="w-6 h-6 text-gray-700 group-hover:text-blue-400 transition-colors duration-300 ease-in-out" />
						<p className="text-lg text-gray-700 group-hover:text-blue-400 transition-colors duration-300 ease-in-out">
							Comment
						</p>
					</div>
				</div>
				<div className="bg-gray-400 h-px" />
				<PostCommentsOverview
					comments={post.comments}
					postId={post._id}
					setShowModal={setShowModal}
				/>
				<CommentInputField
					ref={commentRef}
					onAddComment={handleSubmitComment}
				/>
			</div>
		</Card>
	);
};

export default CardPost;
