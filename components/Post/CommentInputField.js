import { useState, forwardRef } from "react";
import { useSession } from "next-auth/client";
import { PencilAltIcon } from "@heroicons/react/outline";

import ProfilePic from "@/components/Shared/ProfilePic";

// eslint-disable-next-line react/display-name
const CommentInputField = forwardRef(({ onAddComment }, ref) => {
	const [text, setText] = useState("");
	const [session] = useSession();

	const handleTextChange = (event) => setText(event.target.value);

	const handleSubmit = (event) => {
		event.preventDefault();

		onAddComment(text);
		setText("");
	};

	return (
		<div className="flex space-x-4 items-center px-3">
			<ProfilePic
				styles="w-8 h-8 cursor-pointer"
				imageSrc={session.user.profilePicUrl}
				imageAlt={session.user.name}
			/>
			<form
				onSubmit={handleSubmit}
				className="flex items-center flex-1 p-2 px-3 border rounded-full"
			>
				<input
					className="flex-1 outline-none text-gray-600 placeholder-gray-400"
					type="text"
					placeholder="Add comment"
					name="text"
					value={text}
					onChange={handleTextChange}
					autoComplete="off"
					ref={ref}
				/>
				<PencilAltIcon className="w-6 h-6 text-blue-500" />
			</form>
		</div>
	);
});

export default CommentInputField;
