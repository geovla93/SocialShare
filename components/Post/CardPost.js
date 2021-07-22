import Image from "next/image";
import { useRouter } from "next/router";
import { useSession } from "next-auth/client";
import { XIcon } from "@heroicons/react/outline";

import Card from "../Shared/Card";
import ProfilePic from "../Shared/ProfilePic";
import CommentInputField from "./CommentInputField";

import calculateDate from "@/utils/calculateDate";

const CardPost = ({ post }) => {
	const [session] = useSession();
	const router = useRouter();

	const postDate = calculateDate(post.createdAt);

	const handleProfilePrefetch = (username) =>
		router.prefetch(`/profile/${username}`);
	const handleProfileRedirect = () =>
		router.push(`/profile/${post.user.username}`);

	return (
		<Card>
			<div className="flex flex-col space-y-4">
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
					<span className="p-2 rounded-full hover:bg-gray-300 transition-colors duration-300 ease-in-out cursor-pointer">
						<XIcon className="w-6 h-6" />
					</span>
				</div>
				<p className="text-gray-800 text-lg">{post.text}</p>
				{post.picUrl && (
					<div className="w-full h-72 relative overflow-hidden">
						<Image
							src={post.picUrl}
							alt={`Post photo from ${post.user.name}`}
							width={500}
							height={500}
							layout="responsive"
							objectFit="cover"
							objectPosition="center"
						/>
						{/* <div className="bg-gray-400 w-full h-full" /> */}
					</div>
				)}
				<div className="flex items-center space-x-4">
					<p className="text-sm text-gray-700 hover:text-blue-400 transition-colors duration-300 ease-in-out cursor-pointer">
						Like!
					</p>
					<p className="text-sm text-gray-700 hover:text-blue-400 transition-colors duration-300 ease-in-out cursor-pointer">
						Comment
					</p>
				</div>
				<CommentInputField />
			</div>
		</Card>
	);
};

export default CardPost;
