import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import { InboxIcon, EyeIcon } from "@heroicons/react/outline";
import { toast } from "react-toastify";

import FormInput from "@/components/Shared/FormInput";
import Button from "@/components/Shared/Button";
import Spinner from "@/components/Shared/Spinner";
import { loginUser } from "@/utils/user";

type FormValues = {
  email: string;
  password: string;
};

const SigninPage: NextPage = () => {
  const [formLoading, setFormLoading] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const {
    control,
    reset,
    formState: { isSubmitSuccessful },
    handleSubmit,
  } = useForm<FormValues>();

  const email = useWatch({ control, name: "email" });
  const password = useWatch({ control, name: "password" });

  useEffect(() => {
    const isUser = !(email === "") && !(password === "");
    isUser ? setSubmitDisabled(false) : setSubmitDisabled(true);
  }, [email, password]);

  useEffect(() => {
    if (isSubmitSuccessful) reset({ email: "", password: "" });
  }, [isSubmitSuccessful, reset]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setFormLoading(true);

    const userData = { ...data };

    const result = await loginUser(userData);

    if (result?.error) {
      toast.error(result.error);
      setFormLoading(false);
      return;
    } else {
      setFormLoading(false);
      router.replace("/");
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center w-11/12 md:w-3/5 lg:w-1/2 max-w-screen-lg mx-auto">
      <form
        className="flex-1 flex flex-col space-y-6 p-3 bg-white border rounded shadow"
        onSubmit={handleSubmit(onSubmit)}
      >
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
        <Button
          type="submit"
          styles="disabled:cursor-not-allowed"
          disabled={submitDisabled}
        >
          {formLoading ? <Spinner styles="text-gray-50 mx-auto" /> : "Log In"}
        </Button>
      </form>
    </div>
  );
};

export default SigninPage;
