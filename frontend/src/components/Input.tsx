import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, ...rest }, ref) => {
    return (
      <div className="form-group">
        <label className="form-label">{label}</label>
        <input
          ref={ref}
          className={`form-input ${error ? 'form-input-error' : ''}`}
          {...rest}
        />
        {error && <span className="form-error">{error}</span>}
      </div>
    );
  }
);

export default Input;
