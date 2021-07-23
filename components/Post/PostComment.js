import { useRouter } from "next/router";
import { useState } from "react";
import { XIcon } from "@heroicons/react/outline";
import { useSession } from "next-auth/client";
import PropTypes from "prop-types";

import ProfilePic from "../Shared/ProfilePic";

import useDeleteComment from "@/hooks/useDeleteComment";

const PostComment = ({ comment, postId }) => {
	const [errorMessage, setErrorMessage] = useState(null);
	const [session] = useSession();
	const router = useRouter();
	const { mutateAsync } = useDeleteComment();

	const handleProfilePrefetch = (username) =>
		router.prefetch(`/profile/${username}`);
	const handleProfileRedirect = (username) =>
		router.push(`/profile/${username}`);

	const handleDeleteComment = async () => {
		try {
			await mutateAsync({ postId, commentId: comment._id });
		} catch (error) {
			setErrorMessage(error);
		}
	};

	return (
		<div className="flex items-center space-x-4">
			<ProfilePic
				styles="w-8 h-8 self-start cursor-pointer"
				imageSrc={comment.user.profilePicUrl}
				imageAlt={comment.user.name}
				click
				handleClick={handleProfileRedirect.bind(null, comment.user.username)}
				hover
				handleHover={handleProfilePrefetch.bind(null, comment.user.username)}
			/>
			<div className="relative flex flex-col border border-gray-200 rounded-2xl px-4 py-1 bg-gray-200">
				<h3 className="font-medium text-blue-500 hover:underline cursor-pointer">
					{comment.user.name}
				</h3>
				<p>{comment.text}</p>
				{session.user.role === "admin" ||
					(session.user._id === comment.user._id && (
						<span
							className="absolute -top-3 -right-3 rounded-full p-1 bg-red-500 cursor-pointer"
							onClick={handleDeleteComment}
						>
							<XIcon className="w-4 h-4 text-gray-50" />
						</span>
					))}
			</div>
		</div>
	);
};

PostComment.propTypes = {
	comment: PropTypes.object,
	postId: PropTypes.string,
};

export default PostComment;
