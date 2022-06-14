import type { FC } from "react";
import Image, { ImageProps } from "next/image";
import cn from "classnames";

type ProfilePicProps = ImageProps & {
  style?: string;
  alt: string;
};

const ProfilePic: FC<ProfilePicProps> = ({ style, alt, ...props }) => {
  return (
    <div className={cn("relative", style)}>
      <Image
        {...props}
        className="rounded-full"
        alt={alt}
        layout="fill"
        objectFit="cover"
      />
    </div>
  );
};

export default ProfilePic;
