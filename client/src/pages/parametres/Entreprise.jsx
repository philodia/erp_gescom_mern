import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Image } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import useForm from '../../hooks/useForm';
// Importer le schéma de validation depuis sa source unique
import { parametresValidationSchema } from '../../utils/validators';
import api from '../../services/api';

// Importer nos composants UI personnalisés
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import TextArea from '../../components/ui/TextArea';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Breadcrumb from '../../components/common/Breadcrumb';

const Entreprise = () => {
    const [isLoadingPage, setIsLoadingPage] = useState(true);
    const [logoPreview, setLogoPreview] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    // Fonction de soumission pour le hook useForm
    const handleSave = async (data) => {
        try {
            // L'API retourne maintenant directement les données mises à jour
            const { data: updatedSettings } = await api.put('/parametres', data);
            setFormData(updatedSettings); // Mettre à jour l'état du formulaire
            toast.success('Paramètres enregistrés avec succès !');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Erreur lors de l\'enregistrement.');
        }
    };
    
    // Initialisation de notre hook useForm
    const {
        formData,
        setFormData,
        errors,
        isSubmitting,
        handleChange,
        handleSubmit,
    } = useForm(
        { // S'assurer que la structure initiale correspond au modèle, même si vide
            nomEntreprise: '',
            adresse: { rue: '', ville: '', codePostal: '', pays: 'Sénégal' },
            telephone: '', email: '', siteWeb: '', numeroTVA: '', mentionsLegales: '',
        }, 
        parametresValidationSchema, // Utiliser le schéma importé
        handleSave
    );

    // Effet pour charger les données initiales
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                // L'API retourne un objet { success, message, data }
                const response = await api.get('/parametres');
                const settingsData = response.data || {};
                
                if (Object.keys(settingsData).length > 0) {
                    setFormData(settingsData);
                    setLogoPreview(settingsData.logoUrl);
                }
            } catch (error) {
                toast.error("Impossible de charger les paramètres de l'entreprise.");
            } finally {
                setIsLoadingPage(false);
            }
        };
        fetchSettings();
    }, [setFormData]); // setFormData est stable et ne causera pas de re-fetch

    // Gérer l'upload du logo
    const handleLogoChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadFormData = new FormData();
        uploadFormData.append('logo', file);
        
        setIsUploading(true);
        try {
            const response = await api.put('/parametres/logo', uploadFormData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setLogoPreview(response.data.logoUrl);
            toast.success('Logo mis à jour avec succès !');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Erreur lors de l\'upload du logo.');
        } finally {
            setIsUploading(false);
        }
    };
    
    if (isLoadingPage) {
        return <LoadingSpinner asOverlay text="Chargement des paramètres..." />;
    }

    return (
        <>
            <Breadcrumb items={[{ label: 'Paramètres' }, { label: 'Entreprise' }]} />
            <Row>
                <Col md={4} className="mb-3">
                    <Card title="Logo de l'entreprise">
                        <div className="text-center">
                            <Image src={logoPreview || '/default_logo.png'} alt="Logo de l'entreprise" fluid thumbnail className="mb-3" style={{ height: '150px', objectFit: 'contain' }}/>
                            <Form.Group controlId="formFile" className="mb-3">
                                <Form.Control type="file" onChange={handleLogoChange} disabled={isUploading} accept="image/png, image/jpeg, image/gif" />
                            </Form.Group>
                            {isUploading && <LoadingSpinner text="Upload en cours..." />}
                        </div>
                    </Card>
                </Col>
                <Col md={8}>
                    <Card title="Informations de l'entreprise">
                        <Form noValidate onSubmit={handleSubmit}>
                            <Row>
                                <Col md={6}>
                                    <Input label="Nom de l'entreprise" name="nomEntreprise" value={formData.nomEntreprise || ''} onChange={handleChange} error={errors.nomEntreprise} required />
                                </Col>
                                <Col md={6}>
                                    <Input label="NINEA / RCCM" name="numeroTVA" value={formData.numeroTVA || ''} onChange={handleChange} />
                                </Col>
                                <Col md={6}>
                                    <Input label="Email de contact" name="email" type="email" value={formData.email || ''} onChange={handleChange} error={errors.email} />
                                </Col>
                                <Col md={6}>
                                    <Input label="Téléphone" name="telephone" value={formData.telephone || ''} onChange={handleChange} />
                                </Col>
                            </Row>
                            <hr />
                            <h5>Adresse</h5>
                            <Input label="Rue" name="adresse.rue" value={formData.adresse?.rue || ''} onChange={handleChange} />
                            <Row>
                                <Col md={6}><Input label="Ville" name="adresse.ville" value={formData.adresse?.ville || ''} onChange={handleChange} /></Col>
                                <Col md={6}><Input label="Pays" name="adresse.pays" value={formData.adresse?.pays || ''} onChange={handleChange} /></Col>
                            </Row>
                            <hr />
                            <h5>Informations pour les documents</h5>
                            <TextArea label="Mentions légales (bas de page)" name="mentionsLegales" value={formData.mentionsLegales || ''} onChange={handleChange} rows={3} />

                            <div className="text-end mt-3">
                                <Button type="submit" isLoading={isSubmitting}>Enregistrer les modifications</Button>
                            </div>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default Entreprise;