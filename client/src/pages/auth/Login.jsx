// --- Imports ---
import React, { useState } from 'react'; // Importer useState pour gérer l'erreur de soumission
import { useNavigate, Link } from 'react-router-dom';

// --- Hooks et Contextes ---
import { useAuth } from '../../context/AuthContext'; // CORRECTION: Importer depuis le contexte
import useForm from '../../hooks/useForm'; // Votre excellent hook de formulaire
import { loginValidationSchema } from '../../utils/validators'; // Schéma de validation

// --- Composants UI ---
import { Container, Form } from 'react-bootstrap';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Alert from '../../components/ui/Alert';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  // État local pour gérer UNIQUEMENT les erreurs venant de l'API après soumission
  const [submissionError, setSubmissionError] = useState(null);

  // --- Fonction de soumission ---
  // Elle est maintenant définie à l'intérieur du composant pour pouvoir utiliser `setSubmissionError`.
  const handleLogin = async (credentials) => {
    try {
      // Réinitialiser l'erreur de soumission à chaque nouvelle tentative
      setSubmissionError(null);
      
      // La validation a déjà été faite par le hook.
      await login(credentials); // Le contexte login attend probablement un seul objet
      navigate('/dashboard');
    } catch (err) {
      // Capturer l'erreur de l'API (ex: 401 Unauthorized) et la mettre dans notre état local
      const errorMessage = err.response?.data?.message || 'Email ou mot de passe incorrect.';
      setSubmissionError(errorMessage);
    }
  };

  // --- Initialisation du hook useForm ---
  const {
    formData,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
  } = useForm(
    { email: '', password: '' }, // Valeurs initiales
    loginValidationSchema,      // Schéma de validation
    handleLogin                 // Callback de soumission
  );
  
  // --- Rendu JSX ---
  return (
    <Container 
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: '100vh', backgroundColor: 'var(--bs-light)' }} // Utiliser une variable Bootstrap
    >
      <div className="w-100" style={{ maxWidth: '400px' }}>
        <Card title="Connexion">
          {/* L'alerte affiche l'erreur de soumission de l'API */}
          {submissionError && <Alert variant="danger">{submissionError}</Alert>}
          
          <Form noValidate onSubmit={handleSubmit}>
            <Input
              id="email"
              label="Adresse Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email} // Affiche les erreurs de validation du champ
              placeholder="exemple@email.com"
            />
            <Input
              id="password"
              label="Mot de passe"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password} // Affiche les erreurs de validation du champ
              placeholder="Votre mot de passe"
            />
            {/* CORRECTION: La prop s'appelle `loading` dans notre composant Button */}
            <Button type="submit" loading={isSubmitting} className="w-100 mt-3">
              {isSubmitting ? 'Connexion...' : 'Se connecter'}
            </Button>
          </Form>

          <div className="w-100 text-center mt-3">
            <Link to="/forgot-password">Mot de passe oublié ?</Link>
          </div>
        </Card>
        
        <div className="w-100 text-center mt-2">
          Pas encore de compte ? <Link to="/register">Créez-en un ici</Link>
        </div>
      </div>
    </Container>
  );
};

export default Login;