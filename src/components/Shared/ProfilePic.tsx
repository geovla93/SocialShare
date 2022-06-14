import type { FC } from "react";
import Image, { ImageProps } from "next/image";
import cn from "classnames";

type ProfilePicProps = ImageProps & {
  style?: string;
  alt: string;
};

const ProfilePic: FC<ProfilePicProps> = ({ style, alt, ...props }) => {
  return (
    <span className={cn(style)}>
      <Image
        {...props}
        className="rounded-full"
        alt={alt}
        width={100}
        height={100}
      />
    </span>
  );
};

export default ProfilePic;
