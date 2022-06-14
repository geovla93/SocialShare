import { useState, useEffect, useRef, FC, ChangeEventHandler } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import { PhotographIcon } from "@heroicons/react/outline";

import Card from "../Shared/Card";
import ProfilePic from "../Shared/ProfilePic";

const CreatePostModal = dynamic(() => import("./CreatePostModal"));

const CreatePost: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [media, setMedia] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const { data: session } = useSession();
  const router = useRouter();
  const mediaRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    session && router.prefetch(`/profile/${session.user.username}`);
  }, [router, session]);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleImageChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const { name, files } = event.target;

    if (name === "media" && files) {
      setMedia(files[0]);
      setMediaPreview(URL.createObjectURL(files[0]));
      setIsOpen(true);
    }
  };

  return (
    <Card>
      <div className="flex flex-col space-y-2 divide-y divide-gray-300">
        <div className="flex items-center space-x-4">
          {session && (
            <Link href={`/profile/${session.user.username}`}>
              <a>
                <ProfilePic
                  style="w-8 h-8 cursor-pointer"
                  src={session.user.image}
                  alt={session.user.name}
                />
              </a>
            </Link>
          )}

          <p
            className="flex-1 outline-none rounded-full bg-gray-200 p-2 px-4 hover:bg-gray-300 text-gray-500 cursor-pointer"
            onClick={openModal}
          >
            {session?.user.name.split(" ")[0]}, what are you thinking?
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
            onClick={() => mediaRef.current?.click()}
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
