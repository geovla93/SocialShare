import { FC, PropsWithChildren } from "react";

const Card: FC<PropsWithChildren<{}>> = ({ children }) => {
  return (
    <div className="border rounded-md shadow-md bg-white p-2">{children}</div>
  );
};

export default Card;
