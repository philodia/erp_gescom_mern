import React from 'react';
import { Row, Col, Form } from 'react-bootstrap';

// Importer nos hooks et utilitaires
import useForm from '../../hooks/useForm';
import { fournisseurValidationSchema } from '../../utils/validators'; // On créera ce schéma

// Importer nos composants UI personnalisés
import Input from '../ui/Input';
//import TextArea from '../ui/TextArea';
import Button from '../ui/Button';
import Select from '../ui/Select'; // On pourrait en avoir besoin

/**
 * Un formulaire réutilisable pour créer ou modifier un fournisseur.
 *
 * @param {object} props
 * @param {object} [props.initialData] - Les données du fournisseur à modifier.
 * @param {function(object): Promise<void>} props.onSave - La fonction à appeler pour sauvegarder.
 * @param {function} [props.onCancel] - La fonction à appeler lors de l'annulation.
 */
const FournisseurForm = ({ initialData, onSave, onCancel }) => {
  // Valeurs par défaut pour un nouveau fournisseur
  const defaultValues = {
    nom: '',
    email: '',
    telephone: '',
    contactPrincipal: { nom: '', email: '', telephone: '' },
    adresse: { rue: '', ville: '', codePostal: '', pays: 'Sénégal' },
    numeroTVA: '',
    conditionsPaiement: '',
    evaluation: 3, // Par défaut 3 étoiles
    informationsBancaires: { nomBanque: '', iban: '', swift: '' },
  };

  // Fusionner les données initiales avec les valeurs par défaut de manière récursive
  const formInitialData = { 
    ...defaultValues, 
    ...initialData,
    contactPrincipal: { ...defaultValues.contactPrincipal, ...initialData?.contactPrincipal },
    adresse: { ...defaultValues.adresse, ...initialData?.adresse },
    informationsBancaires: { ...defaultValues.informationsBancaires, ...initialData?.informationsBancaires }
  };
  
  const isEditing = !!initialData?._id;

  // Utiliser notre hook de formulaire
  const {
    formData,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
  } = useForm(formInitialData, fournisseurValidationSchema, onSave);

  return (
    <Form noValidate onSubmit={handleSubmit}>
      <Row>
        <Col md={6}>
          <Input label="Nom du Fournisseur" name="nom" value={formData.nom} onChange={handleChange} error={errors.nom} required disabled={isSubmitting}/>
        </Col>
        <Col md={6}>
          <Input label="Email Principal" name="email" type="email" value={formData.email} onChange={handleChange} error={errors.email} disabled={isSubmitting} />
        </Col>
        <Col md={6}>
            <Input label="Téléphone Principal" name="telephone" type="tel" value={formData.telephone} onChange={handleChange} error={errors.telephone} disabled={isSubmitting} />
        </Col>
        <Col md={6}>
            <Input label="NINEA / RCCM" name="numeroTVA" value={formData.numeroTVA} onChange={handleChange} error={errors.numeroTVA} disabled={isSubmitting} />
        </Col>
      </Row>
      
      <hr />
      <h5>Contact Principal</h5>
      <Row>
        <Col md={6}><Input label="Nom du contact" name="contactPrincipal.nom" value={formData.contactPrincipal.nom} onChange={handleChange} /></Col>
        <Col md={6}><Input label="Email du contact" name="contactPrincipal.email" type="email" value={formData.contactPrincipal.email} onChange={handleChange} error={errors['contactPrincipal.email']} /></Col>
      </Row>

      <hr />
      <h5>Adresse</h5>
      <Input label="Rue" name="adresse.rue" value={formData.adresse.rue} onChange={handleChange} />
      <Row>
        <Col md={6}><Input label="Ville" name="adresse.ville" value={formData.adresse.ville} onChange={handleChange} /></Col>
        <Col md={6}><Input label="Pays" name="adresse.pays" value={formData.adresse.pays} onChange={handleChange} /></Col>
      </Row>
      
      <hr />
      <h5>Informations d'Achat</h5>
       <Row>
        <Col md={6}>
          <Input label="Conditions de paiement" name="conditionsPaiement" placeholder="Ex: Net 30 jours, Paiement à la commande" value={formData.conditionsPaiement} onChange={handleChange} />
        </Col>
        <Col md={6}>
          <Select label="Évaluation interne" name="evaluation" value={formData.evaluation} onChange={handleChange} options={[
              { value: 1, label: '★☆☆☆☆ - Mauvais' },
              { value: 2, label: '★★☆☆☆ - Passable' },
              { value: 3, label: '★★★☆☆ - Moyen' },
              { value: 4, label: '★★★★☆ - Bon' },
              { value: 5, label: '★★★★★ - Excellent' },
          ]} />
        </Col>
      </Row>

      <div className="text-end mt-4">
        {onCancel && (
          <Button type="button" variant="secondary" className="me-2" onClick={onCancel} disabled={isSubmitting}>Annuler</Button>
        )}
        <Button type="submit" isLoading={isSubmitting}>
          {isEditing ? 'Enregistrer les modifications' : 'Créer le Fournisseur'}
        </Button>
      </div>
    </Form>
  );
};

export default FournisseurForm;