import React from "react";
import PropTypes from "prop-types";

function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  type = "button",
  disabled = false,
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-colors duration-200 focus:outline-none";

  const variants = {
    primary:
      "bg-white text-black font-semibold border-2 border-black drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:bg-black hover:text-white hover:border-white focus:ring-black",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const disabledStyles = disabled
    ? "opacity-50 cursor-not-allowed"
    : "cursor-pointer";

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabledStyles} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(["primary", "secondary", "finish", "danger"]),
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  className: PropTypes.string,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  disabled: PropTypes.bool,
};

export default Button;
