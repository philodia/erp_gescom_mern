import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../services/api';

// Importer les composants UI et communs
import Breadcrumb from '../../components/common/Breadcrumb';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Tabs from '../../components/ui/Tabs';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { FaUser, FaFileInvoice, FaStickyNote, FaEdit } from 'react-icons/fa';

// --- Sous-composants pour chaque onglet ---

const GeneralInfoTab = ({ client }) => (
  <div>
    <h4>Informations de Contact</h4>
    <p><strong>Email :</strong> {client.email || 'Non renseigné'}</p>
    <p><strong>Téléphone :</strong> {client.telephone || 'Non renseigné'}</p>
    <hr />
    <h4>Adresse</h4>
    <p>
        {client.adresse?.rue}<br/>
        {client.adresse?.ville} {client.adresse?.codePostal}<br/>
        {client.adresse?.pays}
    </p>
    <hr />
    <h4>Informations Légales</h4>
    <p><strong>NINEA / RCCM :</strong> {client.numeroTVA || 'Non renseigné'}</p>
  </div>
);

const InvoicesTab = ({ clientId }) => {
    // Dans une vraie application, cet onglet ferait son propre fetch
    // pour récupérer la liste des factures de ce client.
    return <p>Historique des factures pour le client {clientId} (en construction).</p>;
};

const NotesTab = ({ clientId }) => {
    return <p>Notes internes sur le client {clientId} (en construction).</p>;
};


/**
 * Page affichant les détails complets d'un client.
 */
const ClientDetail = () => {
    const { id } = useParams(); // Récupérer l'ID du client depuis l'URL
    const navigate = useNavigate();
    const [client, setClient] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchClient = async () => {
            try {
                const clientData = await api.get(`/clients/${id}`);
                setClient(clientData);
            } catch (error) {
                toast.error("Impossible de charger les détails du client.");
                console.error(error);
                navigate('/clients'); // Rediriger si le client n'est pas trouvé
            } finally {
                setIsLoading(false);
            }
        };

        fetchClient();
    }, [id, navigate]);

    if (isLoading) {
        return <LoadingSpinner asOverlay text="Chargement du client..." />;
    }

    if (!client) {
        return (
            <Card title="Erreur">
                <p>Le client demandé n'a pas pu être trouvé.</p>
                <Button onClick={() => navigate('/clients')}>Retour à la liste</Button>
            </Card>
        );
    }
    
    // Configuration pour notre composant Tabs
    const clientTabs = [
        {
            eventKey: 'general',
            title: 'Infos Générales',
            icon: FaUser,
            content: <GeneralInfoTab client={client} />
        },
        {
            eventKey: 'invoices',
            title: 'Factures',
            icon: FaFileInvoice,
            content: <InvoicesTab clientId={client._id} />
        },
        {
            eventKey: 'notes',
            title: 'Notes',
            icon: FaStickyNote,
            content: <NotesTab clientId={client._id} />
        }
    ];

    const breadcrumbItems = [
        { label: 'Clients', path: '/clients' },
        { label: client.nom } // Page actuelle, non cliquable
    ];

    return (
        <div>
            <Breadcrumb items={breadcrumbItems} />
            
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">{client.nom}</h2>
                <div>
                    <Button 
                        variant="primary" 
                        className="me-2"
                        onClick={() => navigate(`/clients/modifier/${client._id}`)}
                        icon={FaEdit}
                    >
                        Modifier
                    </Button>
                    {/* On pourrait ajouter d'autres actions ici */}
                </div>
            </div>

            <Card>
                <div className="d-flex justify-content-between p-3 border-bottom">
                    <div><strong>Type:</strong> {client.type}</div>
                    <div><strong>Solde:</strong> <span className="fw-bold">{formatCurrency(client.solde)}</span></div>
                    <div><strong>Client depuis:</strong> {formatDate(client.createdAt)}</div>
                </div>
                <Tabs tabs={clientTabs} />
            </Card>
        </div>
    );
};

export default ClientDetail;