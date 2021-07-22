import { useController } from "react-hook-form";

const FormInput = ({ name, control, rules, Icon, ...otherProps }) => {
	const {
		field,
		fieldState: { error },
	} = useController({ name, control, rules, defaultValue: "" });

	return (
		<div className="realtive">
			<div className="flex-1 flex items-center space-x-4 border rounded p-2">
				{Icon && Icon}
				<input
					className="flex-1 outline-none bg-white placeholder-gray-400"
					{...field}
					{...otherProps}
				/>
			</div>
			{error && (
				<span className="absolute text-red-500 text-sm">{error.message}</span>
			)}
		</div>
	);
};

export default FormInput;
