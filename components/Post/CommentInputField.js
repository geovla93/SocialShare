import { useState, useRef } from "react";
import { useSession } from "next-auth/client";
import { PencilAltIcon } from "@heroicons/react/outline";

import ProfilePic from "@/components/Shared/ProfilePic";
import Spinner from "../Shared/Spinner";

const CommentInputField = () => {
	const [text, setText] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [session] = useSession();
	const inputRef = useRef();

	const handleTextChange = (event) => setText(event.target.value);

	return (
		<div className="flex space-x-4 items-center px-3">
			<ProfilePic
				styles="w-8 h-8"
				imageSrc={session.user.profilePicUrl}
				imageAlt={session.user.name}
			/>
			<div className="flex items-center flex-1 p-2 px-3 border rounded-full">
				<input
					className="flex-1 outline-none text-gray-600 placeholder-gray-400"
					type="text"
					placeholder="Add comment"
					name="text"
					value={text}
					onChange={handleTextChange}
					ref={inputRef}
				/>
				{isSubmitting ? (
					<Spinner styles="text-blue-500" />
				) : (
					<PencilAltIcon
						className="w-6 h-6 text-blue-500"
						onClick={() => inputRef.current.focus()}
					/>
				)}
			</div>
		</div>
	);
};

export default CommentInputField;
