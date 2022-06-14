import { FC } from "react";

import Card from "../Shared/Card";

const PostSkeleton: FC = () => {
  return (
    <Card>
      <div className="flex flex-col space-y-4 animate-pulse">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 rounded-full bg-gray-400" />
          <div className="w-full h-6 rounded-full bg-gray-400" />
        </div>
        <div className="w-full h-40 rounded bg-gray-400" />
        <div className="w-1/3 h-6 rounded-full bg-gray-400" />
      </div>
    </Card>
  );
};

export default PostSkeleton;
