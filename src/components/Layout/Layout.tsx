import type { FC, PropsWithChildren } from "react";
import Head from "next/head";
import { ToastContainer } from "react-toastify";

import Header from "./Header";

const Layout: FC<PropsWithChildren<{}>> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden bg-gray-200">
      <Head>
        <title>SocialShare</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta
          name="description"
          content="Communicate with people and friends"
        />
        <meta httpEquiv="Content-Type" content="text/html;charset=UTF-8" />
        <meta name="author" content="George Vlassis" />
      </Head>

      <Header />
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={true}
      />
      <main className="flex-1 my-8 w-11/12 mx-auto">{children}</main>
    </div>
  );
};

export default Layout;
