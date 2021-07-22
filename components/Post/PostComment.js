import { XIcon } from "@heroicons/react/outline";
import { useSession } from "next-auth/client";
import PropTypes from "prop-types";

import ProfilePic from "../Shared/ProfilePic";

const PostComment = ({ comment }) => {
	const [session] = useSession();

	const handleDeleteComment = async () => {};

	return (
		<div className="flex items-center space-x-4">
			<ProfilePic
				styles="w-8 h-8 self-start"
				imageSrc={comment.user.profilePicUrl}
				imageAlt={comment.user.name}
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
};

export default PostComment;
