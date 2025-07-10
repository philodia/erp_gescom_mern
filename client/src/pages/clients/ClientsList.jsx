import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

// Importer les actions et les hooks
import { fetchClients, deleteClient } from '../../store/slices/clientsSlice';
import { useAuth } from '../../hooks/useAuth';
import useModal from '../../hooks/useModal';
import useDebounce from '../../hooks/useDebounce';

// Importer les constantes et utilitaires
import { PERMISSIONS } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';

// Importer les composants UI et communs
import Breadcrumb from '../../components/common/Breadcrumb';
import DataTable from '../../components/common/DataTable';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Alert from '../../components/ui/Alert';
import { FaUserPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';

const ClientsList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { can } = useAuth(); // Utiliser notre hook unifié pour les permissions

  const { isOpen, openModal, closeModal, modalData } = useModal();
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [filters, setFilters] = useState({ page: 1, limit: 10, search: '' });
  const debouncedSearch = useDebounce(filters.search, 500);

  // Utiliser la variable 'error' pour un feedback utilisateur
  const { items: clients, pagination, status, error } = useSelector((state) => state.clients);

  useEffect(() => {
    // La dépendance sur `debouncedSearch` est correcte car elle déclenche le fetch
    // uniquement après que l'utilisateur a fini de taper.
    dispatch(fetchClients({ page: filters.page, limit: filters.limit, search: debouncedSearch }));
  }, [dispatch, filters.page, filters.limit, debouncedSearch]);


  // --- Colonnes et Actions mémorisées ---

  const handleDeleteClick = useCallback((client) => {
    openModal(client);
  }, [openModal]);

  const renderRowActions = useCallback((client) => (
    <div className="text-nowrap">
        <Button variant="outline-info" size="sm" className="me-2" onClick={() => navigate(`/clients/${client._id}`)}><FaEye /></Button>
        {can(PERMISSIONS.CAN_MANAGE_SALES) && (
            <Button variant="outline-primary" size="sm" className="me-2" onClick={() => navigate(`/clients/modifier/${client._id}`)}><FaEdit /></Button>
        )}
        {can(PERMISSIONS.CAN_MANAGE_SETTINGS) && (
            <Button variant="outline-danger" size="sm" onClick={() => handleDeleteClick(client)}><FaTrash /></Button>
        )}
    </div>
  ), [navigate, can, handleDeleteClick]);

  const columns = useMemo(() => [
    { Header: 'Nom', accessor: 'nom', sortable: true },
    { Header: 'Email', accessor: 'email' },
    { Header: 'Type', accessor: 'type', Cell: ({ row }) => <Badge>{row.type}</Badge> },
    { Header: 'Solde', accessor: 'solde', sortable: true, Cell: ({ row }) => formatCurrency(row.solde) },
  ], []);


  // --- Gestion de la suppression ---
  const handleConfirmDelete = async () => {
    if (!modalData) return;
    setIsDeleting(true);
    try {
      await dispatch(deleteClient(modalData._id)).unwrap();
      toast.success(`Le client "${modalData.nom}" a été désactivé.`);
      closeModal();
    } catch (err) {
      toast.error(err.message || 'Erreur lors de la suppression.');
    } finally {
      setIsDeleting(false);
    }
  };

  // --- Rendu JSX ---
  if (status === 'failed') {
      return <Alert variant="danger">Erreur de chargement des données : {error}</Alert>;
  }
  
  return (
    <>
      <Breadcrumb items={[{ label: 'Clients' }]} />
      
      <DataTable
        columns={columns}
        data={clients}
        isLoading={status === 'loading'}
        renderRowActions={renderRowActions}
        actionButton={
          can(PERMISSIONS.CAN_MANAGE_SALES) && (
            <Button onClick={() => navigate('/clients/ajouter')} icon={FaUserPlus}>
                Nouveau Client
            </Button>
          )
        }
        pagination={{ 
          ...pagination, 
          onPageChange: (page) => setFilters(prev => ({ ...prev, page })) 
        }}
        search={{
          value: filters.search,
          onChange: (e) => setFilters(prev => ({...prev, search: e.target.value, page: 1}))
        }}
      />
      
      <ConfirmDialog
        isOpen={isOpen}
        onClose={closeModal}
        onConfirm={handleConfirmDelete}
        title="Confirmer la Désactivation"
        variant="danger"
        confirmText="Désactiver"
        isConfirming={isDeleting}
      >
        <p>Êtes-vous sûr de vouloir désactiver le client <strong>"{modalData?.nom}"</strong> ?</p>
        <p className="text-muted small">Le client sera masqué mais son historique sera conservé.</p>
      </ConfirmDialog>
    </>
  );
};

export default ClientsList;