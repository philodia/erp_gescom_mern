import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';

// Importer l'action Redux et les composants nécessaires
import { updateClient } from '../../store/slices/clientsSlice';
import api from '../../services/api'; // Pour charger les données initiales
import ClientForm from '../../components/forms/ClientForm';
import Card from '../../components/ui/Card';
import Breadcrumb from '../../components/common/Breadcrumb';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import { FaUserEdit } from 'react-icons/fa';

/**
 * Page pour la modification d'un client existant.
 * Elle charge les données du client et les passe au ClientForm.
 */
const ClientEdit = () => {
    const { id: clientId } = useParams(); // Renommer 'id' en 'clientId' pour plus de clarté
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [initialData, setInitialData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Effet pour charger les données du client à modifier
    useEffect(() => {
        const fetchClient = async () => {
            try {
                const clientData = await api.get(`/clients/${clientId}`);
                setInitialData(clientData);
            } catch (err) {
                setError('Impossible de trouver le client demandé.');
                toast.error('Client non trouvé.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchClient();
    }, [clientId]);

    /**
     * Fonction de callback pour la sauvegarde, passée au ClientForm.
     * @param {object} formData - Les données du formulaire mises à jour.
     */
    const handleSaveClient = async (formData) => {
        try {
            // Le thunk updateClient a besoin de l'ID, on s'assure qu'il est bien dans les données
            const dataToUpdate = { ...formData, _id: clientId };
            await dispatch(updateClient(dataToUpdate)).unwrap();
            toast.success('Client mis à jour avec succès !');
            navigate('/clients'); // Rediriger vers la liste après la modification
        } catch (err) {
            toast.error(err.message || 'Erreur lors de la mise à jour.');
            throw err; // Relancer l'erreur pour que useForm puisse la gérer
        }
    };

    const breadcrumbItems = [
        { label: 'Clients', path: '/clients' },
        { label: `Modifier: ${initialData?.nom || '...'}` }
    ];

    if (isLoading) {
        return <LoadingSpinner asOverlay text="Chargement des informations du client..." />;
    }

    if (error) {
        return (
            <Card title="Erreur">
                <Alert variant="danger">{error}</Alert>
                <Button onClick={() => navigate('/clients')}>Retour à la liste</Button>
            </Card>
        );
    }
    
    return (
        <div>
            <Breadcrumb items={breadcrumbItems} />
            <Card title="Modifier le Client" icon={FaUserEdit}>
                {/* On ne rend le formulaire que si on a les données initiales */}
                {initialData && (
                    <ClientForm
                        initialData={initialData}
                        onSave={handleSaveClient}
                        onCancel={() => navigate('/clients')}
                    />
                )}
            </Card>
        </div>
    );
};

export default ClientEdit;