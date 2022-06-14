import {
  useState,
  useEffect,
  useRef,
  useCallback,
  ChangeEventHandler,
} from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import {
  UserIcon,
  InboxIcon,
  EyeIcon,
  CheckIcon,
  XCircleIcon,
  BookOpenIcon,
} from "@heroicons/react/outline";
import { request, gql } from "graphql-request";
import { toast } from "react-toastify";

import FormInput from "@/components/Shared/FormInput";
import Button from "@/components/Shared/Button";
import ImageDropDiv from "@/components/Shared/ImageDropDiv";
import Spinner from "@/components/Shared/Spinner";
import uploadPic from "@/utils/cloudinary";
import { registerUser } from "@/utils/user";
import IsEmail from "isemail";

const CheckUsernameQuery = gql`
  query CheckUsernameQuery($username: String!) {
    isUsernameAvailable(username: $username)
  }
`;

type FormValues = {
  username: string;
  email: string;
  password: string;
  name: string;
  bio: string;
};

const SignupPage: NextPage = () => {
  const [usernameAvailable, setUsernameAvailable] = useState(false);
  const [usernameLoading, setUsernameLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [media, setMedia] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [highlighted, setHighlighted] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    control,
    reset,
    handleSubmit,
    formState: { isSubmitSuccessful },
  } = useForm<FormValues>();

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
      const { isUsernameAvailable } = await request(
        "/api/graphql",
        CheckUsernameQuery,
        {
          username,
        }
      );

      if (isUsernameAvailable) {
        setUsernameAvailable(true);
      } else {
        setUsernameAvailable(false);
      }
    } catch (error) {
      toast.error("Username Not Available");
      setUsernameAvailable(false);
    }

    setUsernameLoading(false);
  }, [username]);

  useEffect(() => {
    username === "" ? setUsernameAvailable(false) : checkUsername();
  }, [checkUsername, username]);

  useEffect(() => {
    if (isSubmitSuccessful)
      reset({ name: "", username: "", email: "", password: "", bio: "" });
  }, [isSubmitSuccessful, reset]);

  const handleImageChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const { name, files } = event.target;

    if (name === "media" && files) {
      setMedia(files[0]);
      setMediaPreview(URL.createObjectURL(files[0]));
    }
  };

  useEffect(() => {
    router.prefetch("/auth/signin");
  }, [router]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setFormLoading(true);

    let profilePicUrl;
    if (media !== null) {
      profilePicUrl = await uploadPic(media);
    }

    if (media !== null && !profilePicUrl) {
      setFormLoading(false);
      toast.error("Error uploading image");
      return;
    }

    await registerUser(data, profilePicUrl);

    setFormLoading(false);
    router.push("/auth/signin");
  };

  return (
    <div className="flex-1 flex items-center justify-center w-11/12 md:w-3/5 lg:w-1/2 max-w-screen-lg mx-auto">
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
            controller={{
              control,
              name: "name",
              rules: { required: "Name is required." },
            }}
            type="text"
            placeholder="Name"
            Icon={<UserIcon className="w-6 h-6 text-blue-400" />}
          />
          <FormInput
            controller={{
              control,
              name: "username",
              rules: {
                required: "Username is required.",
                minLength: {
                  value: 1,
                  message: "Username must be at least 1 character.",
                },
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
                <Spinner style="text-blue-400" />
              )
            }
          />
        </div>
        <div className="flex flex-col md:flex-row space-y-6 w-full md:space-y-0 md:space-x-4">
          <FormInput
            controller={{
              control,
              name: "email",
              rules: {
                required: "Email is required.",
                validate: (value) => IsEmail.validate(value),
              },
            }}
            type="email"
            placeholder="Email"
            Icon={<InboxIcon className="w-6 h-6 text-blue-400" />}
          />
          <FormInput
            controller={{
              control,
              name: "password",
              rules: {
                required: "Password is required.",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters.",
                },
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
          controller={{
            control,
            name: "bio",
            rules: { required: "Bio is required." },
          }}
          type="text"
          placeholder="Bio"
          Icon={<BookOpenIcon className="w-6 h-6 text-blue-400" />}
        />
        <Button
          type="submit"
          style="disabled:cursor-not-allowed"
          disabled={submitDisabled || !usernameAvailable}
        >
          {formLoading ? <Spinner style="text-gray-50 mx-auto" /> : "Register"}
        </Button>
      </form>
    </div>
  );
};

export default SignupPage;
