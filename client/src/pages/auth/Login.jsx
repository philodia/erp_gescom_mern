import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';

// --- Hooks et Contextes ---
import { useAuth } from '../../hooks/useAuth';
import useForm, { FORM_ACTIONS } from '../../hooks/useForm'; // Importer les actions du formulaire
import { loginValidationSchema } from '../../utils/validators';

// --- Composants UI ---
import { Container, Form } from 'react-bootstrap';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Alert from '../../components/ui/Alert';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  /**
   * Fonction de callback pour la soumission du formulaire.
   * Elle reçoit les données et la fonction `dispatch` du hook useForm.
   */
  const handleLogin = async (credentials, { dispatch }) => {
    try {
      await login(credentials.email, credentials.password);
      navigate(from, { replace: true });
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Email ou mot de passe incorrect.';
      // Au lieu d'un état local, on dispatche une action d'échec
      // que le reducer de notre hook useForm va gérer.
      dispatch({
          type: FORM_ACTIONS.SUBMIT_FAILURE,
          payload: { error: errorMessage }
      });
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
    { email: '', password: '' },
    loginValidationSchema,
    handleLogin
  );
  
  // --- Rendu JSX ---
  return (
    <Container 
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}
    >
      <div className="w-100" style={{ maxWidth: '400px' }}>
        <Card title="Connexion">
          {/* L'erreur de soumission est maintenant lue depuis errors.submit */}
          {errors.submit && <Alert variant="danger">{errors.submit}</Alert>}
          
          <Form noValidate onSubmit={handleSubmit}>
            <Input
              label="Adresse Email"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="exemple@email.com"
              disabled={isSubmitting}
            />
            <Input
              label="Mot de passe"
              name="password"
              type="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="Votre mot de passe"
              disabled={isSubmitting}
            />
            <Button type="submit" isLoading={isSubmitting} className="w-100 mt-3">
              Se connecter
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