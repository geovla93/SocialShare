import PropTypes from "prop-types";
import { ThumbUpIcon } from "@heroicons/react/solid";

const PostStatsBar = ({ isLiked, likes, comments }) => {
	return (
		<div className="flex items-center justify-between">
			<span className="text-gray-700 font-light flex items-center space-x-2">
				<span className="p-1 rounded-full bg-blue-500">
					<ThumbUpIcon className="w-3 h-3 text-gray-50" />
				</span>
				<span>
					{isLiked
						? likes.length === 1
							? "You"
							: `You and ${likes.length - 1} more`
						: likes.length}
				</span>
				{/* {likes.length} {likes.length === 1 ? "like" : "likes"} */}
			</span>
			<p className="text-gray-700">
				{comments.length} {comments.length === 1 ? "comment" : "comments"}
			</p>
		</div>
	);
};

PostStatsBar.propTypes = {
	isLiked: PropTypes.bool,
	likes: PropTypes.arrayOf(PropTypes.object),
	comments: PropTypes.arrayOf(PropTypes.object),
};

export default PostStatsBar;
