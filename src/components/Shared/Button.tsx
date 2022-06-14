import type { ButtonHTMLAttributes, FC, PropsWithChildren } from "react";
import cn from "classnames";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  style?: string;
};

const Button: FC<PropsWithChildren<ButtonProps>> = ({
  children,
  style,
  ...otherProps
}) => {
  return (
    <button
      {...otherProps}
      className={cn(
        "outline-none p-2 bg-blue-500 text-gray-50 rounded hover:bg-blue-400 transition-colors duration-300 ease-in-out",
        style
      )}
    >
      {children}
    </button>
  );
};

export default Button;
