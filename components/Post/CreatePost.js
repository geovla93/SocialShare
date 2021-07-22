import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/client";
import { PhotographIcon } from "@heroicons/react/outline";

import Card from "../Shared/Card";
import CreatePostModal from "./CreatePostModal";
import ProfilePic from "../Shared/ProfilePic";

const CreatePost = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [media, setMedia] = useState(null);
	const [mediaPreview, setMediaPreview] = useState(null);
	const [session] = useSession();
	const router = useRouter();
	const mediaRef = useRef();

	useEffect(() => {
		session && router.prefetch(`/profile/${session.user.username}`);
	}, [router, session]);

	const openModal = () => setIsOpen(true);
	const closeModal = () => setIsOpen(false);
	const handleRedirect = () => router.push(`/profile/${session.user.username}`);

	const handleImageChange = (event) => {
		const { name, files } = event.target;

		if (name === "media") {
			setMedia(files[0]);
			setMediaPreview(URL.createObjectURL(files[0]));
			setIsOpen(true);
		}
	};

	return (
		<Card>
			<div className="flex flex-col space-y-2 divide-y divide-gray-300">
				<div className="flex items-center space-x-4">
					<ProfilePic
						styles="w-8 h-8 cursor-pointer"
						imageSrc={session.user.profilePicUrl}
						imageAlt={session.user.name}
						click
						handleClick={handleRedirect}
					/>
					<p
						className="flex-1 outline-none rounded-full bg-gray-200 p-2 px-4 hover:bg-gray-300 text-gray-500 cursor-pointer"
						onClick={openModal}
					>
						{session.user.name.split(" ")[0]}, what are you thinking?
					</p>
					<CreatePostModal
						isOpen={isOpen}
						closeModal={closeModal}
						media={media}
						setMedia={setMedia}
						mediaPreview={mediaPreview}
						setMediaPreview={setMediaPreview}
						handleImageChange={handleImageChange}
						mediaRef={mediaRef}
					/>
				</div>
				<input
					className="hidden"
					type="file"
					accept="image/*"
					onChange={handleImageChange}
					ref={mediaRef}
					name="media"
				/>
				<div className="pt-2 w-full">
					<div
						className="flex items-center justify-center space-x-4 p-2 border border-blue-500 hover:bg-blue-500 rounded cursor-pointer transition-colors duration-300 ease-in-out group"
						onClick={() => mediaRef.current.click()}
					>
						<PhotographIcon className="w-6 h-6 text-blue-500 group-hover:text-gray-50 transition-colors duration-300 ease-in-out" />
						<p className="text-blue-500 group-hover:text-gray-50 transition-colors duration-300 ease-in-out">
							Upload photo
						</p>
					</div>
				</div>
			</div>
		</Card>
	);
};

export default CreatePost;
