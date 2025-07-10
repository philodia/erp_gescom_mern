import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';

// Importer l'action Redux et les composants nécessaires
import { addNewClient } from '../../store/slices/clientsSlice';
import ClientForm from '../../components/forms/ClientForm';
import Card from '../../components/ui/Card';
import Breadcrumb from '../../components/common/Breadcrumb';
import { FaUserPlus } from 'react-icons/fa';

/**
 * Page pour l'ajout d'un nouveau client.
 * Elle agit comme un conteneur pour le ClientForm en mode création.
 */
const ClientAdd = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  /**
   * Fonction de callback pour la sauvegarde, passée au ClientForm.
   * Elle est appelée par le hook useForm lorsque la validation est réussie.
   * @param {object} clientData - Les données du formulaire validées.
   */
  const handleSaveClient = async (clientData) => {
    // Le `unwrap()` de Redux Toolkit permet de transformer le résultat
    // du dispatch en une promesse qui peut être 'await'.
    // Elle se résoudra en cas de succès et lèvera une erreur en cas d'échec.
    try {
      await dispatch(addNewClient(clientData)).unwrap();
      toast.success('Client ajouté avec succès !');
      // Rediriger vers la liste des clients après la création
      navigate('/clients');
    } catch (error) {
      // Afficher une notification d'erreur si l'API échoue
      toast.error(error.message || 'Erreur lors de l\'ajout du client.');
      // L'erreur sera aussi gérée par le hook useForm si on la relance
      throw error;
    }
  };

  const breadcrumbItems = [
    { label: 'Clients', path: '/clients' },
    { label: 'Ajouter un client' }
  ];

  return (
    <div>
      <Breadcrumb items={breadcrumbItems} />
      <Card title="Ajouter un nouveau Client" icon={FaUserPlus}>
        <ClientForm
          // On ne passe pas d'initialData, le formulaire sera en mode création
          onSave={handleSaveClient}
          onCancel={() => navigate('/clients')}
        />
      </Card>
    </div>
  );
};

export default ClientAdd;