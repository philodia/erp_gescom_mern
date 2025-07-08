import React from 'react';
import { Form } from 'react-bootstrap';

/**
 * Un composant Select personnalisé qui encapsule le Form.Select de react-bootstrap.
 * Il standardise l'affichage du label, de l'aide textuelle et des messages d'erreur.
 *
 * @param {object} props
 * @param {string} props.name - Le nom du champ, utilisé pour l'attribut `name` et le `htmlFor` du label.
 * @param {string} props.label - Le texte à afficher au-dessus du champ.
 * @param {string|number} props.value - La valeur actuellement sélectionnée.
 * @param {function} props.onChange - La fonction à appeler lors d'un changement de sélection.
 * @param {Array<{value: string|number, label: string}>} props.options - Un tableau d'objets pour peupler les options du select.
 * @param {string} [props.placeholder] - Le texte pour la première option, généralement désactivée.
 * @param {string} [props.error] - Le message d'erreur à afficher si la validation échoue.
 * @param {boolean} [props.required=false] - Si true, ajoute un astérisque au label.
 * @returns {JSX.Element}
 */
const Select = ({
  name,
  label,
  value,
  onChange,
  options = [],
  placeholder = "Sélectionnez une option...",
  error,
  required = false,
  ...rest // Pour passer d'autres props comme `disabled`
}) => {
  return (
    <Form.Group controlId={name} className="mb-3">
      {label && (
        <Form.Label>
          {label} {required && <span className="text-danger">*</span>}
        </Form.Label>
      )}
      <Form.Select
        name={name}
        value={value}
        onChange={onChange}
        isInvalid={!!error}
        {...rest}
      >
        {/* Option placeholder (non sélectionnable) */}
        {placeholder && <option value="">{placeholder}</option>}

        {/* Itération sur le tableau d'options fourni */}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Form.Select>
      
      {/* Affichage du message d'erreur */}
      <Form.Control.Feedback type="invalid">
        {error}
      </Form.Control.Feedback>
    </Form.Group>
  );
};

export default Select;