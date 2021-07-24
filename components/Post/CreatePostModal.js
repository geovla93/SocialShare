import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { useSession } from "next-auth/client";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon, PhotographIcon } from "@heroicons/react/outline";
import { useForm, useWatch, Controller } from "react-hook-form";

import ProfilePic from "../Shared/ProfilePic";
import Button from "../Shared/Button";

import uploadPic from "@/utils/cloudinary";
import useCreatePost from "@/hooks/useCreatePost";

const Spinner = dynamic(() => import("../Shared/Spinner"));

const CreatePostModal = ({
	isOpen,
	closeModal,
	media,
	setMedia,
	mediaPreview,
	setMediaPreview,
	handleImageChange,
	mediaRef,
}) => {
	const [error, setError] = useState(null);
	const [session] = useSession();
	const router = useRouter();
	const { mutateAsync, isLoading } = useCreatePost();
	const modalRef = useRef();
	const {
		control,
		reset,
		handleSubmit,
		formState: { isSubmitSuccessful },
	} = useForm({ defaultValues: { text: "", location: "" } });

	const text = useWatch({ control, name: "text" });

	useEffect(() => {
		if (isSubmitSuccessful) {
			reset({ text: "", location: "" });
			closeModal();
		}
	}, [closeModal, isSubmitSuccessful, reset]);

	const handleRedirect = () =>
		router.push({
			pathname: "/profile/[username]",
			query: { username: session.user.username },
		});

	const handleDeleteMedia = () => {
		setMedia(null);
		setMediaPreview(null);
	};

	const onSubmit = async (data) => {
		let picUrl;
		if (media !== null) picUrl = await uploadPic(media);
		if (media !== null && !picUrl) {
			setError("Error Uploading Image");
			return;
		}

		try {
			await mutateAsync({
				data,
				picUrl,
			});
		} catch (error) {
			setError(error);
		}

		setMedia(null);
		setMediaPreview(null);
	};

	return (
		<Transition
			appear
			show={isOpen}
			enter="transition duration-100 ease-out"
			enterFrom="transform scale-95 opacity-0"
			enterTo="transform scale-100 opacity-100"
			leave="transition duration-75 ease-out"
			leaveFrom="transform scale-100 opacity-100"
			leaveTo="transform scale-95 opacity-0"
		>
			<Dialog
				initialFocus={modalRef}
				className="fixed inset-0 z-10 overflow-y-auto"
				onClose={closeModal}
			>
				<div className="flex items-center justify-center min-h-screen">
					<Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

					<div className="flex flex-col divide-y divide-gray-300 bg-white shadow rounded w-3/4 md:w-2/3 max-w-screen-sm mx-auto z-50">
						<div className="relative flex items-center justify-center p-3">
							<Dialog.Title>Create Post</Dialog.Title>
							<span
								className="absolute right-2 cursor-pointer rounded-full p-1 hover:bg-blue-500 group transition-colors duration-300 ease-in-out"
								onClick={closeModal}
							>
								<XIcon className="h-8 w-8 text-blue-500 group-hover:text-gray-50 transition-colors duration-300 ease-in-out" />
							</span>
						</div>
						<Dialog.Description
							as="form"
							onSubmit={handleSubmit(onSubmit)}
							className="flex flex-col p-6 space-y-4 divide-y divide-gray-300"
						>
							<div className="flex items-center space-x-4">
								<ProfilePic
									styles="w-10 h-10 cursor-pointer"
									imageSrc={session.user.profilePicUrl}
									imageAlt={session.user.name}
									click
									handleClick={handleRedirect}
								/>
								<Controller
									control={control}
									name="text"
									rules={{
										required: "This field is required.",
										minLength: {
											value: 1,
											message: "Comment must be at least 1 character.",
										},
									}}
									render={({ field }) => (
										<input
											{...field}
											className="flex-1 outline-none rounded-full bg-gray-200 p-2 px-4 hover:bg-gray-300"
											autoComplete="off"
											type="text"
											ref={modalRef}
											placeholder={`${
												session.user.name.split(" ")[0]
											}, what are you thinking?`}
										/>
									)}
								/>
							</div>
							<Controller
								control={control}
								name="location"
								render={({ field }) => (
									<input
										{...field}
										className="outline-none rounded-full bg-gray-200 p-2 px-4 hover:bg-gray-300"
										autoComplete="off"
										type="text"
										placeholder="Want to add a location?"
									/>
								)}
							/>
							<input
								className="hidden"
								type="file"
								accept="image/*"
								onChange={handleImageChange}
								ref={mediaRef}
								name="media"
							/>
							{mediaPreview !== null && (
								<div className="relative w-full h-72 overflow-hidden">
									<div className="border border-blue-500 border-dotted h-full w-full">
										<img
											className="h-full w-full object-contain"
											src={mediaPreview}
											alt="image preview"
										/>
									</div>
									<XIcon
										className="absolute top-2 right-2 h-6 w-6 text-gray-800 cursor-pointer"
										onClick={handleDeleteMedia}
									/>
								</div>
							)}
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
							<Button
								styles="disabled:cursor-not-allowed"
								type="submit"
								disabled={text === "" || isLoading}
							>
								{isLoading ? <Spinner styles="text-white mx-auto" /> : "Submit"}
							</Button>
						</Dialog.Description>
					</div>
				</div>
			</Dialog>
		</Transition>
	);
};

CreatePostModal.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	closeModal: PropTypes.func.isRequired,
	media: PropTypes.any,
	setMedia: PropTypes.func,
	mediaPreview: PropTypes.string,
	setMediaPreview: PropTypes.func,
	handleImageChange: PropTypes.func.isRequired,
	mediaRef: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.shape({ current: PropTypes.any }),
	]),
};

export default CreatePostModal;
