import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { useState, useEffect, useRef, useCallback } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
	UserIcon,
	InboxIcon,
	EyeIcon,
	CheckIcon,
	XCircleIcon,
	BookOpenIcon,
} from "@heroicons/react/outline";
import axios from "axios";

import FormInput from "@/components/Shared/FormInput";
import Button from "@/components/Shared/Button";
import ImageDropDiv from "@/components/Shared/ImageDropDiv";

import uploadPic from "@/utils/cloudinary";
import { registerUser } from "@/utils/user";

const Spinner = dynamic(() => import("@/components/Shared/Spinner"));

const SignupPage = () => {
	const [usernameAvailable, setUsernameAvailable] = useState(false);
	const [usernameLoading, setUsernameLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [errorMessage, setErrorMessage] = useState(null);
	const [formLoading, setFormLoading] = useState(false);
	const [media, setMedia] = useState(null);
	const [mediaPreview, setMediaPreview] = useState(null);
	const [highlighted, setHighlighted] = useState(false);
	const [submitDisabled, setSubmitDisabled] = useState(true);
	const router = useRouter();
	const inputRef = useRef();
	const {
		control,
		reset,
		handleSubmit,
		formState: { isSubmitSuccessful },
	} = useForm();

	const name = useWatch({ control, name: "name", defaultValue: "" });
	const username = useWatch({
		control,
		name: "username",
		defaultValue: "",
	});
	const email = useWatch({ control, name: "email", defaultValue: "" });
	const password = useWatch({ control, name: "password", defaultValue: "" });
	const bio = useWatch({ control, name: "bio", defaultValue: "" });

	useEffect(() => {
		const isUser =
			!(name === "") && !(email === "") && !(password === "") && !(bio === "");
		isUser ? setSubmitDisabled(false) : setSubmitDisabled(true);
	}, [bio, email, name, password]);

	const checkUsername = useCallback(async () => {
		setUsernameLoading(true);

		try {
			const res = await axios(`/api/auth/signup/${username}`);

			if (errorMessage !== null) setErrorMessage(null);

			if (res.data === "Available") {
				setUsernameAvailable(true);
			} else {
				setUsernameAvailable(false);
			}
		} catch (error) {
			setErrorMessage("Username Not Available");
			setUsernameAvailable(false);
		}
		setUsernameLoading(false);
	}, [username, errorMessage]);

	useEffect(() => {
		username === "" ? setUsernameAvailable(false) : checkUsername();
	}, [checkUsername, username]);

	useEffect(() => {
		if (isSubmitSuccessful)
			reset({ name: "", username: "", email: "", password: "", bio: "" });
	}, [isSubmitSuccessful, reset]);

	const handleImageChange = (event) => {
		const { name, files } = event.target;

		if (name === "media") {
			setMedia(files[0]);
			setMediaPreview(URL.createObjectURL(files[0]));
		}
	};

	useEffect(() => {
		router.prefetch("/auth/signin");
	}, [router]);

	const onSubmit = async (data) => {
		setFormLoading(true);

		let profilePicUrl;
		if (media !== null) {
			profilePicUrl = await uploadPic(media);
		}

		if (media !== null && !profilePicUrl) {
			setFormLoading(false);
			setErrorMessage("Error uploading image");
			return;
		}

		try {
			await registerUser(data, profilePicUrl, setErrorMessage);
		} catch (error) {
			setErrorMessage(error);
		}

		setFormLoading(false);
		if (!errorMessage) router.push("/auth/signin");
	};

	return (
		<div className="flex-1 flex items-center justify-center">
			<form
				className="flex-1 flex flex-col space-y-6 p-3 bg-white border rounded shadow"
				onSubmit={handleSubmit(onSubmit)}
			>
				<ImageDropDiv
					highlighted={highlighted}
					setHighlighted={setHighlighted}
					mediaPreview={mediaPreview}
					setMediaPreview={setMediaPreview}
					setMedia={setMedia}
					inputRef={inputRef}
					handleChange={handleImageChange}
				/>
				<div className="flex flex-col md:flex-row space-y-6 w-full md:space-y-0 md:space-x-4">
					<FormInput
						name="name"
						control={control}
						rules={{ required: "Name is required." }}
						type="text"
						placeholder="Name"
						Icon={<UserIcon className="w-6 h-6 text-blue-400" />}
					/>
					<FormInput
						name="username"
						control={control}
						rules={{
							required: "Username is required",
							minLength: {
								value: 1,
								message: "Username must be at least 1 character.",
							},
						}}
						type="text"
						placeholder="Username"
						Icon={
							!usernameLoading ? (
								usernameAvailable ? (
									<CheckIcon className="w-6 h-6 text-blue-400" />
								) : (
									<XCircleIcon className="w-6 h-6 text-blue-400" />
								)
							) : (
								<Spinner styles="text-blue-400" />
							)
						}
					/>
				</div>
				<div className="flex flex-col md:flex-row space-y-6 w-full md:space-y-0 md:space-x-4">
					<FormInput
						name="email"
						control={control}
						rules={{
							required: "Email is required.",
							pattern: {
								value:
									/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
								message: "Email is not valid.",
							},
						}}
						type="email"
						placeholder="Email"
						Icon={<InboxIcon className="w-6 h-6 text-blue-400" />}
					/>
					<FormInput
						name="password"
						control={control}
						rules={{
							required: "Password is required.",
							minLength: {
								value: 8,
								message: "Password must be at least 8 characters.",
								maxLength: {
									value: 16,
									message: "Password must be less than 16 characters.",
								},
							},
						}}
						type={showPassword ? "text" : "password"}
						placeholder="Password"
						Icon={
							<EyeIcon
								onClick={() => setShowPassword((prevValue) => !prevValue)}
								className="w-6 h-6 text-blue-400"
							/>
						}
					/>
				</div>
				<FormInput
					name="bio"
					control={control}
					rules={{ required: "Bio is required." }}
					type="text"
					placeholder="Bio"
					Icon={<BookOpenIcon className="w-6 h-6 text-blue-400" />}
				/>
				<Button
					type="submit"
					styles="disabled:cursor-not-allowed"
					disabled={submitDisabled || !usernameAvailable}
				>
					{formLoading ? <Spinner styles="text-gray-50 mx-auto" /> : "Register"}
				</Button>
			</form>
		</div>
	);
};

export default SignupPage;
