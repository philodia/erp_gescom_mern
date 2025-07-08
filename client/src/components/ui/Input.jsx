import React from 'react';
import { Form } from 'react-bootstrap';

/**
 * A custom Input component that encapsulates the Form.Control from react-bootstrap.
 * It manages the display of the label, icon, helper text, and validation error messages in a standardized way.
 *
 * @param {object} props
 * @param {string} props.name - The field's name, used for the `name` attribute and label's `htmlFor`.
 * @param {string} props.label - The text to display above the field.
 * @param {string} props.value - The current value of the field (controlled from a parent state).
 * @param {function} props.onChange - The function to call when the field value changes.
 * @param {string} [props.placeholder] - The field's placeholder text.
 * @param {string} [props.type='text'] - The input type (text, email, password, number, etc.).
 * @param {string} [props.error] - The error message to display if validation fails.
 * @param {boolean} [props.required=false] - If true, adds an asterisk to the label.
 * @param {React.ComponentType} [props.icon] - An icon to display (not implemented in this basic version but prepared).
 * @param {React.ReactNode} [props.as] - The type of component to render (e.g., 'textarea').
 * @returns {JSX.Element}
 */
const Input = ({
  name,
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  error,
  required = false,
  as,
  ...rest // For passing other props like `rows` for textarea, etc.
}) => {
  return (
    <Form.Group controlId={name} className="mb-3">
      {label && (
        <Form.Label>
          {label} {required && <span className="text-danger">*</span>}
        </Form.Label>
      )}
      <Form.Control
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder || label} // Use label as default placeholder
        isInvalid={!!error} // Show error styling if the 'error' prop is present
        as={as}
        {...rest}
      />
      {/* Display error message below the field */}
      {error && (
        <Form.Control.Feedback type="invalid">
          {error}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
};

export default Input;
