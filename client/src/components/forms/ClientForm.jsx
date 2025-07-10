import React from 'react';
import { Row, Col, Form } from 'react-bootstrap';

// Importer nos hooks et utilitaires
import useForm from '../../hooks/useForm';
import { clientValidationSchema } from '../../utils/validators';

// Importer nos composants UI personnalisés
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

/**
 * Un formulaire réutilisable pour créer ou modifier un client.
 *
 * @param {object} props
 * @param {object} [props.initialData] - Les données du client à modifier. Si non fournies, le formulaire est en mode création.
 * @param {function(object): Promise<void>} props.onSave - La fonction à appeler pour sauvegarder les données.
 * @param {function} [props.onCancel] - La fonction à appeler lors de l'annulation.
 */
const ClientForm = ({ initialData, onSave, onCancel }) => {
  // Définir les valeurs par défaut pour un nouveau client
  const defaultValues = {
    nom: '',
    type: 'Client', // Valeur par défaut pour le select
    email: '',
    telephone: '',
    adresse: {
      rue: '',
      ville: '',
      codePostal: '',
      pays: 'Sénégal',
    },
    numeroTVA: '',
  };

  // Fusionner les données initiales avec les valeurs par défaut
  const formInitialData = { ...defaultValues, ...initialData, adresse: { ...defaultValues.adresse, ...initialData?.adresse } };
  
  const isEditing = !!initialData?._id; // Le formulaire est en mode édition si un ID est présent

  // Utiliser notre hook de formulaire
  const {
    formData,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
  } = useForm(formInitialData, clientValidationSchema, onSave);

  return (
    // `noValidate` désactive la validation HTML5 native, on utilise la nôtre.
    <Form noValidate onSubmit={handleSubmit}>
      <Row>
        <Col md={6}>
          <Input
            label="Nom du Client / Prospect"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            error={errors.nom}
            required
            disabled={isSubmitting}
          />
        </Col>
        <Col md={6}>
          <Select
            label="Type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            error={errors.type}
            options={[
              { value: 'Client', label: 'Client' },
              { value: 'Prospect', label: 'Prospect' },
            ]}
            required
            disabled={isSubmitting}
          />
        </Col>
      </Row>
      
      <Row>
        <Col md={6}>
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              disabled={isSubmitting}
            />
        </Col>
        <Col md={6}>
             <Input
              label="Téléphone"
              name="telephone"
              type="tel"
              value={formData.telephone}
              onChange={handleChange}
              error={errors.telephone}
              disabled={isSubmitting}
            />
        </Col>
      </Row>
      
      <hr />
      <h5>Adresse</h5>
      
      <Input
        label="Rue"
        name="adresse.rue"
        value={formData.adresse.rue}
        onChange={handleChange}
        error={errors['adresse.rue']} // Accès à l'erreur pour champ imbriqué
        disabled={isSubmitting}
      />
      <Row>
        <Col md={6}>
          <Input
            label="Ville"
            name="adresse.ville"
            value={formData.adresse.ville}
            onChange={handleChange}
            error={errors['adresse.ville']}
            disabled={isSubmitting}
          />
        </Col>
        <Col md={6}>
          <Input
            label="Pays"
            name="adresse.pays"
            value={formData.adresse.pays}
            onChange={handleChange}
            error={errors['adresse.pays']}
            disabled={isSubmitting}
          />
        </Col>
      </Row>

      <hr />
      <h5>Informations Légales</h5>
      <Input
        label="NINEA / RCCM"
        name="numeroTVA"
        value={formData.numeroTVA}
        onChange={handleChange}
        error={errors.numeroTVA}
        disabled={isSubmitting}
      />
      
      {/* Pied de page du formulaire avec les boutons d'action */}
      <div className="text-end mt-4">
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            className="me-2"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Annuler
          </Button>
        )}
        <Button type="submit" isLoading={isSubmitting}>
          {isEditing ? 'Enregistrer les modifications' : 'Créer le Client'}
        </Button>
      </div>
    </Form>
  );
};

export default ClientForm;