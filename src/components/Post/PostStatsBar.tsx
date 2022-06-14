import { FC } from "react";
import { ThumbUpIcon } from "@heroicons/react/solid";

type PostStatsBarProps = {
  isLiked: boolean;
  likesCount: number;
  commentsCount: number;
};

const PostStatsBar: FC<PostStatsBarProps> = ({
  isLiked,
  likesCount,
  commentsCount,
}) => {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-700 font-light flex items-center space-x-2">
        <span className="p-1 rounded-full bg-blue-500">
          <ThumbUpIcon className="w-3 h-3 text-gray-50" />
        </span>
        <span>
          {isLiked
            ? likesCount === 1
              ? "You"
              : `You and ${likesCount - 1} more`
            : likesCount}
        </span>
        {/* {likesCount} {likesCount === 1 ? "like" : "likes"} */}
      </span>
      <p className="text-gray-700">
        {commentsCount} {commentsCount === 1 ? "comment" : "comments"}
      </p>
    </div>
  );
};

export default PostStatsBar;
