import React, { useState, useMemo } from 'react';
import { Table, Form, InputGroup, Row, Col, Spinner } from 'react-bootstrap';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import Pagination from './Pagination';
// import Button from '../ui/Button'; // <-- CORRECTION: Import non utilisé, on le supprime.

// --- CORRECTION: Importer le hook usePagination ---
import usePagination from '../../hooks/usePagination';

/**
 * Un composant DataTable générique et réutilisable.
 *
 * @param {object} props
 * @param {Array<object>} props.columns - Configuration des colonnes. { Header, accessor, sortable, Cell? }
 * @param {Array<object>} props.data - Le tableau complet des données à afficher.
 * @param {boolean} [props.isLoading=false] - Si true, affiche un spinner de chargement.
 * @param {React.ReactNode} [props.actionButton] - Un bouton ou un élément d'action à afficher en haut à droite.
 * @param {function(object): React.ReactNode} [props.renderRowActions] - Fonction pour rendre les actions de chaque ligne.
 * @param {boolean} [props.pagination=true] - Activer/désactiver la pagination.
 * @returns {JSX.Element}
 */
const DataTable = ({
  columns,
  data,
  isLoading = false,
  actionButton,
  renderRowActions,
  pagination = true,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  // 1. Filtrer les données en fonction du terme de recherche
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter(item =>
      columns.some(column => {
        // Gérer le cas où l'accessor est une fonction
        const value = typeof column.accessor === 'function' 
          ? column.accessor(item) 
          : item[column.accessor];
        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  }, [data, searchTerm, columns]);

  // 2. Trier les données filtrées
  const sortedData = useMemo(() => {
    let sortableItems = [...filteredData];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        // Gérer le cas où l'accessor est une fonction pour le tri aussi
        const valA = typeof sortConfig.key === 'function' ? sortConfig.key(a) : a[sortConfig.key];
        const valB = typeof sortConfig.key === 'function' ? sortConfig.key(b) : b[sortConfig.key];

        if (valA < valB) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (valA > valB) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredData, sortConfig]);
  
  // 3. Appliquer la pagination sur les données triées et filtrées
  const {
    paginatedData,
    currentPage,
    totalPages,
    goToPage
  } = usePagination(sortedData); // <-- CORRECTION: 'usePagination' est maintenant défini

  // Données finales à afficher
  const dataToDisplay = pagination ? paginatedData : sortedData;

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort className="ms-1" />;
    if (sortConfig.direction === 'ascending') return <FaSortUp className="ms-1" />;
    return <FaSortDown className="ms-1" />;
  };

  const renderTableBody = () => {
    if (isLoading) {
      return (
        <tr>
          <td colSpan={columns.length + (renderRowActions ? 1 : 0)} className="text-center p-5">
            <Spinner animation="border" />
            <p className="mt-2">Chargement des données...</p>
          </td>
        </tr>
      );
    }
    if (dataToDisplay.length === 0) {
      return (
        <tr>
          <td colSpan={columns.length + (renderRowActions ? 1 : 0)} className="text-center p-5">
            Aucune donnée à afficher.
          </td>
        </tr>
      );
    }
    return dataToDisplay.map((row, index) => (
      <tr key={row._id || index}>
        {columns.map((col) => {
          const cellValue = typeof col.accessor === 'function' ? col.accessor(row) : row[col.accessor];
          return (
            <td key={col.accessor.toString() + index}>
              {col.Cell ? col.Cell({ row, value: cellValue }) : cellValue}
            </td>
          );
        })}
        {renderRowActions && <td>{renderRowActions(row)}</td>}
      </tr>
    ));
  };

  return (
    <div>
      <Row className="mb-3 align-items-center">
        <Col md={6}>
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Rechercher dans la liste..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={6} className="text-end">
          {actionButton}
        </Col>
      </Row>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.accessor.toString()}
                onClick={() => col.sortable && requestSort(col.accessor)}
                style={{ cursor: col.sortable ? 'pointer' : 'default' }}
              >
                {col.Header}
                {col.sortable && getSortIcon(col.accessor)}
              </th>
            ))}
            {renderRowActions && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {renderTableBody()}
        </tbody>
      </Table>
      
      {pagination && totalPages > 1 && (
        <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
        />
      )}
    </div>
  );
};

export default DataTable;