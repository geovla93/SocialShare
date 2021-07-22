import Image from "next/image";

const ProfilePic = ({
	imageSrc,
	imageAlt,
	styles,
	hover,
	click,
	handleClick,
	handleHover,
}) => {
	return (
		<span className={`${styles}`}>
			<Image
				className="rounded-full"
				src={imageSrc}
				alt={imageAlt}
				width={100}
				height={100}
				onClick={click && handleClick}
				onMouseEnter={hover && handleHover}
			/>
		</span>
	);
};

export default ProfilePic;
