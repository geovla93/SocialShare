import {
  ChangeEventHandler,
  Dispatch,
  DragEventHandler,
  FC,
  RefObject,
  SetStateAction,
} from "react";
import { PhotographIcon } from "@heroicons/react/outline";

type ImageDropDivProps = {
  highlighted: boolean;
  setHighlighted: Dispatch<SetStateAction<boolean>>;
  mediaPreview: string | null;
  setMediaPreview: Dispatch<SetStateAction<string | null>>;
  setMedia: Dispatch<SetStateAction<File | null>>;
  inputRef: RefObject<HTMLInputElement>;
  handleChange: ChangeEventHandler<HTMLInputElement>;
};

const ImageDropDiv: FC<ImageDropDivProps> = ({
  highlighted,
  setHighlighted,
  inputRef,
  handleChange,
  mediaPreview,
  setMediaPreview,
  setMedia,
}) => {
  const handleAddImage: DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
    setHighlighted(true);
    const droppedFile = Array.from(event.dataTransfer.files);
    setMedia(droppedFile[0]);
    setMediaPreview(URL.createObjectURL(droppedFile[0]));
  };

  return (
    <div className="w-full h-72 overflow-hidden">
      <input
        className="hidden"
        type="file"
        accept="image/*"
        onChange={handleChange}
        ref={inputRef}
        name="media"
      />
      <div
        className="h-full w-full"
        onDragOver={(event) => {
          event.preventDefault();
          setHighlighted(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setHighlighted(false);
        }}
        onDrop={handleAddImage}
        onClick={() => inputRef.current?.click()}
      >
        {mediaPreview === null ? (
          <div
            className={`h-full w-full flex flex-col items-center justify-center space-y-4 cursor-pointer border rounded-md py-4 ${
              highlighted ? "border-blue-400" : "border-gray-400"
            }`}
          >
            <PhotographIcon className="w-12 h-12 text-blue-400" />
            <p className="text-center text-blue-400">
              Drag and Drop <br /> or <br /> Click to Upload Image
            </p>
          </div>
        ) : (
          <div className="border border-blue-400 h-full w-full">
            <img
              className="h-full w-full object-contain"
              src={mediaPreview}
              alt="image preview"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageDropDiv;
