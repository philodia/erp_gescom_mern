import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Row, Col, Alert, Spinner } from 'react-bootstrap';
import api from '../../services/api';

const Entreprise = () => {
  // État pour stocker les données du formulaire, initialisé pour correspondre à la structure du modèle
  const [settings, setSettings] = useState({
    nomEntreprise: '',
    adresse: { rue: '', ville: '', codePostal: '', pays: 'Sénégal' },
    telephone: '',
    email: '',
    siteWeb: '',
    numeroTVA: '', // NINEA / RCCM
    mentionsLegales: '',
    logoUrl: '',
  });

  // États pour gérer l'expérience utilisateur
  const [loading, setLoading] = useState(true); // Pour le chargement initial des données
  const [saving, setSaving] = useState(false);   // Pour l'état de sauvegarde
  const [message, setMessage] = useState({ type: '', text: '' }); // Pour les notifications

  // useEffect pour charger les paramètres au montage du composant
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get('/parametres');
        // Si des données existent, on les charge dans l'état.
        if (data && Object.keys(data).length > 0) {
            // On s'assure que la structure est préservée même si certains champs sont absents
            setSettings(prev => ({ ...prev, ...data, adresse: { ...prev.adresse, ...data.adresse } }));
        }
      } catch (error) {
        console.error("Erreur lors du chargement des paramètres :", error);
        setMessage({ type: 'danger', text: 'Impossible de charger les paramètres de l\'entreprise.' });
      } finally {
        setLoading(false); // On a fini de charger
      }
    };
    fetchSettings();
  }, []); // Le tableau vide [] signifie que cet effet ne s'exécute qu'une fois.

  // Gère les changements dans les champs du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Gestion spéciale pour les champs d'adresse imbriqués
    if (name.startsWith('adresse.')) {
        const field = name.split('.')[1];
        setSettings(prev => ({ ...prev, adresse: { ...prev.adresse, [field]: value } }));
    } else {
        setSettings(prev => ({ ...prev, [name]: value }));
    }
  };

  // Gère la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
        const response = await api.put('/parametres', settings);
        setMessage({ type: 'success', text: response.data.message || 'Paramètres enregistrés avec succès !' });
    } catch (error) {
        console.error("Erreur lors de l'enregistrement :", error);
        setMessage({ type: 'danger', text: error.response?.data?.message || 'Une erreur est survenue.' });
    } finally {
        setSaving(false);
    }
  };

  // Affiche un spinner pendant le chargement initial
  if (loading) {
    return <div className="d-flex justify-content-center mt-5"><Spinner animation="border" /></div>;
  }

  return (
    <Container className="mt-4">
      <Card className="shadow-sm">
        <Card.Header as="h4">Paramètres de l'entreprise</Card.Header>
        <Card.Body>
          {message.text && <Alert variant={message.type} onClose={() => setMessage({ type: '', text: ''})} dismissible>{message.text}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <h5>Informations Générales</h5>
            <hr/>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nom de l'entreprise</Form.Label>
                  <Form.Control type="text" name="nomEntreprise" value={settings.nomEntreprise} onChange={handleChange} required />
                </Form.Group>
              </Col>
               <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>NINEA / RCCM</Form.Label>
                  <Form.Control type="text" name="numeroTVA" value={settings.numeroTVA} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Téléphone</Form.Label>
                  <Form.Control type="tel" name="telephone" value={settings.telephone} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Adresse email</Form.Label>
                  <Form.Control type="email" name="email" value={settings.email} onChange={handleChange} />
                </Form.Group>
              </Col>
            </Row>

            <h5 className="mt-4">Adresse</h5>
            <hr/>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Rue</Form.Label>
                  <Form.Control type="text" name="adresse.rue" value={settings.adresse.rue} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Ville</Form.Label>
                  <Form.Control type="text" name="adresse.ville" value={settings.adresse.ville} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Pays</Form.Label>
                  <Form.Control type="text" name="adresse.pays" value={settings.adresse.pays} onChange={handleChange} />
                </Form.Group>
              </Col>
            </Row>
            
            <h5 className="mt-4">Informations pour les documents</h5>
            <hr/>
            <Form.Group className="mb-3">
              <Form.Label>Mentions légales (bas de page)</Form.Label>
              <Form.Control as="textarea" rows={3} name="mentionsLegales" value={settings.mentionsLegales} onChange={handleChange} />
            </Form.Group>

            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? <><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true"/> Enregistrement...</> : 'Enregistrer les modifications'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Entreprise;