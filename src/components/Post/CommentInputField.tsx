import {
  useState,
  forwardRef,
  FormEventHandler,
  ChangeEventHandler,
} from "react";
import { useSession } from "next-auth/react";
import { PencilAltIcon } from "@heroicons/react/outline";

import ProfilePic from "@/components/Shared/ProfilePic";

type CommentInputFieldProps = {
  // eslint-disable-next-line no-unused-vars
  onAddComment: (text: string) => void;
};

// eslint-disable-next-line react/display-name
const CommentInputField = forwardRef<HTMLInputElement, CommentInputFieldProps>(
  ({ onAddComment }, ref) => {
    const [text, setText] = useState("");
    const { data: session } = useSession();

    const handleTextChange: ChangeEventHandler<HTMLInputElement> = (event) =>
      setText(event.target.value);

    const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
      event.preventDefault();

      onAddComment(text);
      setText("");
    };

    return (
      <div className="flex space-x-4 items-center px-3">
        <ProfilePic
          style="w-8 h-8 cursor-pointer"
          src={session?.user.image ?? ""}
          alt={session?.user.name ?? ""}
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
  }
);

export default CommentInputField;
