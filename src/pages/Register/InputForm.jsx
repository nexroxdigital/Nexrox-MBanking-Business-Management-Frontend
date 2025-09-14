import { HiEye, HiEyeOff } from "react-icons/hi";

const InputForm = ({
  label = "",
  inputName = "",
  type = "",
  value = "",
  onChange,
  placeholder = "",
  error = null,
  children,
  onClick,
  showPassword,
  showConfirmPassword,
}) => {
  return (
    <div>
      <label
        htmlFor={inputName}
        className="block text-sm font-medium text-slate-700 dark:text-slate-400 mb-2"
      >
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {children}
        </div>
        <input
          type={type}
          id={inputName}
          name={inputName}
          value={value}
          onChange={onChange}
          className={`block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors dark:bg-dark-clr dark:text-slate-300 ${
            error ? "border-red-300 bg-red-50" : "border-slate-300 bg-white"
          }`}
          placeholder={placeholder}
        />

        {(inputName === "password" || inputName === "confirmPassword") && (
          <button
            type="button"
            onClick={onClick}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {showPassword || showConfirmPassword ? (
              <HiEyeOff className="h-5 w-5 text-slate-400 hover:text-slate-600" />
            ) : (
              <HiEye className="h-5 w-5 text-slate-400 hover:text-slate-600" />
            )}
          </button>
        )}
      </div>
      {error && error}
    </div>
  );
};

export default InputForm;
