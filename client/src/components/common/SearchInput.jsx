import React, { useState, useEffect } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import useDebounce from '../../hooks/useDebounce';

/**
 * Un composant de champ de recherche avec debounce intégré.
 *
 * @param {object} props
 * @param {string} [props.initialValue=''] - La valeur initiale du champ de recherche.
 * @param {function(string): void} props.onSearch - La fonction à appeler avec le terme de recherche "débouncé".
 * @param {string} [props.placeholder='Rechercher...'] - Le placeholder de l'input.
 * @param {number} [props.debounceDelay=500] - Le délai en millisecondes pour le debounce.
 * @returns {JSX.Element}
 */
const SearchInput = ({
  initialValue = '',
  onSearch,
  placeholder = 'Rechercher...',
  debounceDelay = 500
}) => {
  // État pour la valeur instantanée de l'input
  const [searchTerm, setSearchTerm] = useState(initialValue);
  
  // Utiliser notre hook useDebounce pour obtenir la valeur stabilisée
  const debouncedSearchTerm = useDebounce(searchTerm, debounceDelay);

  // useEffect qui écoute les changements de la valeur "débouncée"
  // et appelle la fonction onSearch passée en props.
  useEffect(() => {
    // On appelle la fonction de recherche uniquement si elle est définie
    if (onSearch) {
      onSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, onSearch]);

  return (
    <InputGroup className="mb-3">
      <InputGroup.Text>
        <FaSearch />
      </InputGroup.Text>
      <Form.Control
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </InputGroup>
  );
};

export default SearchInput;