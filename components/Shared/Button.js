const Button = ({ children, styles, ...otherProps }) => {
	return (
		<button
			{...otherProps}
			className={`${styles} outline-none p-2 bg-blue-500 text-gray-50 rounded hover:bg-blue-400 transition-colors duration-300 ease-in-out`}
		>
			{children}
		</button>
	);
};

export default Button;
