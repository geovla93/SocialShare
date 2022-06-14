import { FC, Fragment } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import PostSkeleton from "./PostSkeleton";
import CardPost from "./CardPost";
import usePosts from "@/hooks/usePosts";

const PostsOverview: FC = () => {
  const { data, isLoading, isError, hasNextPage, fetchNextPage } = usePosts();

  if (isError) return <p>Something went wrong please refresh.</p>;

  if (isLoading)
    return (
      <Fragment>
        {Array(4)
          .fill(undefined)
          .map((_, index) => (
            <PostSkeleton key={index + Math.random()} />
          ))}
      </Fragment>
    );

  const dataLength = data?.pages.reduce((counter, page) => {
    return counter + page.posts.length;
  }, 0);

  return (
    <InfiniteScroll
      dataLength={dataLength || 0}
      next={fetchNextPage}
      hasMore={!!hasNextPage}
      loader={Array(4)
        .fill(undefined)
        .map((_, index) => (
          <PostSkeleton key={index + Math.random()} />
        ))}
      className="flex flex-col space-y-4"
    >
      {data?.pages.map(
        (page) =>
          page.nextId && (
            <Fragment key={page.nextId}>
              {page.posts.map((post) => (
                <CardPost key={post._id} post={post} />
              ))}
            </Fragment>
          )
      )}
    </InfiniteScroll>
  );
};

export default PostsOverview;
