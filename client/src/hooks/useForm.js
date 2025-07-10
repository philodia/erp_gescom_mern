import { useReducer, useCallback } from 'react';
import { validateForm } from '../utils/validators';

// --- Définition des Actions pour le Reducer ---
// On les exporte pour qu'elles puissent être utilisées dans le callback de soumission
export const FORM_ACTIONS = {
    UPDATE_FIELD: 'update_field',
    SET_ERRORS: 'set_errors',
    SUBMIT_START: 'submit_start',
    SUBMIT_SUCCESS: 'submit_success',
    SUBMIT_FAILURE: 'submit_failure',
    RESET_FORM: 'reset_form',
};

// --- Le Reducer qui gère l'état ---
const formReducer = (state, action) => {
    switch (action.type) {
        case FORM_ACTIONS.UPDATE_FIELD:
            const { name, value } = action.payload;
            const newFormData = JSON.parse(JSON.stringify(state.formData));
            
            if (name.includes('.')) {
                // ... (logique des champs imbriqués)
            } else {
                newFormData[name] = value;
            }
            
            const newErrors = { ...state.errors };
            delete newErrors[name];
            delete newErrors.submit;

            return { ...state, formData: newFormData, errors: newErrors };

        case FORM_ACTIONS.SET_ERRORS:
            return { ...state, errors: action.payload, isSubmitting: false };

        case FORM_ACTIONS.SUBMIT_START:
            return { ...state, isSubmitting: true, errors: {} };

        case FORM_ACTIONS.SUBMIT_SUCCESS:
            return { ...state, isSubmitting: false };
            
        case FORM_ACTIONS.SUBMIT_FAILURE:
            return { 
                ...state, 
                isSubmitting: false, 
                errors: { ...state.errors, submit: action.payload.error }
            };

        case FORM_ACTIONS.RESET_FORM:
            return {
                formData: action.payload.initialValues,
                errors: {},
                isSubmitting: false,
            };

        default:
            throw new Error(`Action non gérée dans formReducer: ${action.type}`);
    }
};


const useForm = (initialValues, validationSchema, onSubmitCallback) => {
    const initialState = {
        formData: initialValues,
        errors: {},
        isSubmitting: false,
    };
    
    const [state, dispatch] = useReducer(formReducer, initialState);

    const handleChange = useCallback((e) => {
        dispatch({
            type: FORM_ACTIONS.UPDATE_FIELD,
            payload: { name: e.target.name, value: e.target.type === 'checkbox' ? e.target.checked : e.target.value },
        });
    }, []);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        dispatch({ type: FORM_ACTIONS.SUBMIT_START });

        const validationErrors = validateForm(state.formData, validationSchema);
        if (Object.keys(validationErrors).length > 0) {
            dispatch({ type: FORM_ACTIONS.SET_ERRORS, payload: validationErrors });
            return;
        }

        // Le callback est maintenant un `try/catch` qui gère le succès ou l'échec
        try {
            // --- CORRECTION CLÉ ---
            // On passe les données ET la fonction dispatch au callback.
            await onSubmitCallback(state.formData, { dispatch });
            dispatch({ type: FORM_ACTIONS.SUBMIT_SUCCESS });
        } catch (error) {
            // Cette partie n'est plus strictement nécessaire si le callback dispatche lui-même
            // l'erreur, mais c'est une sécurité.
            dispatch({ 
                type: FORM_ACTIONS.SUBMIT_FAILURE, 
                payload: { error: error.message || 'Une erreur de soumission est survenue.' }
            });
        }
    }, [state.formData, validationSchema, onSubmitCallback]);

    const resetForm = useCallback(() => {
        dispatch({ type: FORM_ACTIONS.RESET_FORM, payload: { initialValues } });
    }, [initialValues]);

    return {
        formData: state.formData,
        errors: state.errors,
        isSubmitting: state.isSubmitting,
        setFormData: (newData) => dispatch({ type: FORM_ACTIONS.UPDATE_FIELD, payload: { name: Object.keys(newData)[0], value: Object.values(newData)[0] } }),
        handleChange,
        handleSubmit,
        resetForm,
    };
};

export default useForm;