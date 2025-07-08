import React from 'react';
import { Form } from 'react-bootstrap';

/**
 * Un composant TextArea personnalisé qui encapsule le Form.Control de react-bootstrap
 * avec un rendu `as="textarea"`.
 * Il partage la même logique que le composant Input pour les labels et les erreurs.
 *
 * @param {object} props
 * @param {string} props.name - Le nom du champ.
 * @param {string} props.label - Le texte à afficher au-dessus du champ.
 * @param {string} props.value - La valeur actuelle du champ.
 * @param {function} props.onChange - La fonction à appeler lors d'un changement de valeur.
 * @param {string} [props.placeholder] - Le placeholder du champ.
 * @param {number} [props.rows=3] - Le nombre de lignes visibles par défaut.
 * @param {string} [props.error] - Le message d'erreur à afficher.
 * @param {boolean} [props.required=false] - Si true, ajoute un astérisque au label.
 * @returns {JSX.Element}
 */
const TextArea = ({
  name,
  label,
  value,
  onChange,
  placeholder,
  rows = 3, // Prop par défaut spécifique au textarea
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
      <Form.Control
        as="textarea" // L'élément clé qui le différencie de Input
        rows={rows}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder || label}
        isInvalid={!!error}
        {...rest}
      />
      <Form.Control.Feedback type="invalid">
        {error}
      </Form.Control.Feedback>
    </Form.Group>
  );
};

export default TextArea;