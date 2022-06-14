/* eslint-disable no-undef */
import type { InputHTMLAttributes } from "react";
import {
  FieldValues,
  useController,
  UseControllerProps,
} from "react-hook-form";

type FormInputProps<T> = Omit<InputHTMLAttributes<HTMLInputElement>, "name"> & {
  Icon?: JSX.Element;
  controller: UseControllerProps<T>;
};

const FormInput = <T extends FieldValues>({
  controller,
  Icon,
  ...otherProps
}: FormInputProps<T>) => {
  const {
    field,
    fieldState: { error },
  } = useController<T>(controller);

  return (
    <div className="relative flex-1">
      <div className="flex items-center space-x-4 border rounded p-2">
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
