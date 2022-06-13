import { Fragment, useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import useInfiniteScroll from "react-infinite-scroll-hook";

import PostSkeleton from "./PostSkeleton";
import CardPost from "./CardPost";

import usePosts from "@/hooks/usePosts";
import { useQueryClient } from "react-query";

const PostsOverview = () => {
  const {
    data,
    isLoading,
    isError,
    error,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = usePosts();
  const queryClient = useQueryClient();

  // const fetchDataOnScroll = async () => {
  // 	try {
  // 		const posts = await getPosts(pageNumber);

  // 		if (posts.length === 0) {
  // 			setHasMore(false);
  // 		}

  // 		queryClient.setQueryData("posts", (prevPosts) => [
  // 			...prevPosts,
  // 			...posts,
  // 		]);
  // 		setPageNumber((prevNum) => prevNum + 1);
  // 	} catch (error) {
  // 		alert("Error fetching posts");
  // 	}
  // };

  if (isError)
    return <p>Something went wrong please refresh. {error.message}</p>;

  if (isLoading)
    return (
      <>
        {Array(4)
          .fill()
          .map((_, index) => (
            <PostSkeleton key={index + Math.random()} />
          ))}
      </>
    );

  const dataLength = data.pages.reduce((counter, page) => {
    return counter + page.posts.length;
  }, 0);

  console.log(dataLength);

  return (
    <InfiniteScroll
      dataLength={dataLength}
      next={fetchNextPage}
      hasMore={hasNextPage}
      loader={Array(4)
        .fill()
        .map((_, index) => (
          <PostSkeleton key={index + Math.random()} />
        ))}
      className="flex flex-col space-y-4"
    >
      {data.pages.map(
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
