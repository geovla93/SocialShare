import PropTypes from "prop-types";

import PostComment from "./PostComment";

const PostCommentsOverview = ({
	comments,
	postId,
	isModal,
	styles,
	setShowModal,
}) => {
	return (
		<>
			{!isModal && comments.length > 2 && (
				<button
					className="self-start text-gray-700 hover:underline"
					onClick={() => setShowModal(true)}
				>
					View all comments
				</button>
			)}
			<div className={`flex flex-col space-y-2 px-3 ${styles}`}>
				{comments.length > 0 && !isModal
					? comments.map(
							(comment, index) =>
								index < 2 && (
									<PostComment
										key={comment._id}
										comment={comment}
										postId={postId}
									/>
								)
					  )
					: comments.map((comment) => (
							<PostComment
								key={comment._id}
								comment={comment}
								postId={postId}
							/>
					  ))}
			</div>
		</>
	);
};

PostCommentsOverview.propTypes = {
	comments: PropTypes.arrayOf(PropTypes.object),
	postId: PropTypes.string,
	isModal: PropTypes.bool,
	styles: PropTypes.string,
	setShowModal: PropTypes.func,
};

export default PostCommentsOverview;
