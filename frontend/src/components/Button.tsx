import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  fullWidth = false,
  isLoading = false,
  ...rest
}) => {
  return (
    <button
      className={`btn btn-${variant} ${fullWidth ? 'btn-block' : ''}`}
      disabled={isLoading}
      {...rest}
    >
      {isLoading ? 'Carregando...' : children}
    </button>
  );
};

export default Button;
