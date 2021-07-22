import PropTypes from "prop-types";

import PostComment from "./PostComment";

const PostCommentsOverview = ({ comments, postId }) => {
	return (
		<>
			{comments.length > 3 && (
				<button className="self-start text-gray-700 hover:underline">
					View all comments
				</button>
			)}
			<div className="flex flex-col space-y-2 px-3">
				{comments.length > 0 &&
					comments.map(
						(comment, index) =>
							index < 3 && (
								<PostComment
									key={comment._id}
									comment={comment}
									postId={postId}
								/>
							)
					)}
			</div>
		</>
	);
};

PostCommentsOverview.propTypes = {
	comments: PropTypes.arrayOf(PropTypes.object),
};

export default PostCommentsOverview;
