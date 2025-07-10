import React from 'react';
import { Table, Form, InputGroup, Row, Col, Spinner } from 'react-bootstrap';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import Pagination from './Pagination'; // Notre composant de pagination

/**
 * Un composant DataTable de présentation pure, conçu pour la pagination et la recherche côté serveur.
 *
 * @param {object} props
 * @param {Array<object>} props.columns - Configuration des colonnes.
 * @param {Array<object>} props.data - Le tableau des données pour la page ACTUELLE.
 * @param {boolean} [props.isLoading=false] - Affiche un état de chargement.
 * @param {React.ReactNode} [props.actionButton] - Bouton d'action principal.
 * @param {function(object): React.ReactNode} [props.renderRowActions] - Fonction pour rendre les actions de chaque ligne.
 * @param {object} [props.pagination] - Objet de configuration pour la pagination côté serveur.
 * @param {object} [props.search] - Objet de configuration pour la recherche.
 * @param {object} [props.sort] - Objet de configuration pour le tri.
 * @returns {JSX.Element}
 */
const DataTable = ({
  columns,
  data,
  isLoading = false,
  actionButton,
  renderRowActions,
  pagination,
  search,
  sort,
}) => {
  
  const getSortIcon = (key) => {
    if (!sort || sort.key !== key) return <FaSort className="ms-1 text-muted" />;
    if (sort.direction === 'ascending') return <FaSortUp className="ms-1" />;
    return <FaSortDown className="ms-1" />;
  };

  const renderTableBody = () => {
    if (isLoading) {
      return (
        <tr>
          <td colSpan={columns.length + (renderRowActions ? 1 : 0)} className="text-center p-5">
            <Spinner animation="border" />
            <p className="mt-2">Chargement...</p>
          </td>
        </tr>
      );
    }
    if (!data || data.length === 0) {
      return (
        <tr>
          <td colSpan={columns.length + (renderRowActions ? 1 : 0)} className="text-center p-5 text-muted">
            Aucune donnée à afficher.
          </td>
        </tr>
      );
    }
    return data.map((row, index) => (
      <tr key={row._id || index}>
        {columns.map((col) => {
          const cellValue = typeof col.accessor === 'function' ? col.accessor(row) : row[col.accessor];
          return (
            <td key={col.accessor.toString() + index}>
              {col.Cell ? col.Cell({ row, value: cellValue }) : cellValue}
            </td>
          );
        })}
        {renderRowActions && <td className="text-end">{renderRowActions(row)}</td>}
      </tr>
    ));
  };

  return (
    <div>
      <Row className="mb-3 align-items-center">
        <Col md={6}>
          {search && (
            <InputGroup>
              <Form.Control
                type="text"
                placeholder={search.placeholder || "Rechercher..."}
                value={search.value}
                onChange={search.onChange}
              />
            </InputGroup>
          )}
        </Col>
        <Col md={6} className="text-end">
          {actionButton}
        </Col>
      </Row>

      <div className="table-responsive">
        <Table striped bordered hover>
            <thead>
            <tr>
                {columns.map((col) => (
                <th
                    key={col.accessor.toString()}
                    onClick={() => sort && col.sortable && sort.onSort(col.accessor)}
                    style={{ cursor: sort && col.sortable ? 'pointer' : 'default' }}
                >
                    {col.Header}
                    {sort && col.sortable && getSortIcon(col.accessor)}
                </th>
                ))}
                {renderRowActions && <th>Actions</th>}
            </tr>
            </thead>
            <tbody>
            {renderTableBody()}
            </tbody>
        </Table>
      </div>
      
      {pagination && pagination.totalPages > 1 && (
        <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={pagination.onPageChange}
        />
      )}
    </div>
  );
};

export default DataTable;