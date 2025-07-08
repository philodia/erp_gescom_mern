import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api'; // On réutilise la même instance Axios

// --- THUNKS ASYNCHRONES POUR LES FOURNISSEURS ---

// Thunk pour RÉCUPÉRER tous les fournisseurs
export const fetchFournisseurs = createAsyncThunk(
  'fournisseurs/fetchFournisseurs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/fournisseurs'); // Endpoint de l'API pour les fournisseurs
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Thunk pour CRÉER un nouveau fournisseur
export const addNewFournisseur = createAsyncThunk(
  'fournisseurs/addNewFournisseur',
  async (fournisseurData, { rejectWithValue }) => {
    try {
      const response = await api.post('/fournisseurs', fournisseurData);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Thunk pour METTRE À JOUR un fournisseur
export const updateFournisseur = createAsyncThunk(
  'fournisseurs/updateFournisseur',
  async ({ id, ...fournisseurData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/fournisseurs/${id}`, fournisseurData);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Thunk pour SUPPRIMER (désactiver) un fournisseur
export const deleteFournisseur = createAsyncThunk(
  'fournisseurs/deleteFournisseur',
  async (fournisseurId, { rejectWithValue }) => {
    try {
      await api.delete(`/fournisseurs/${fournisseurId}`);
      return fournisseurId;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);


// --- DÉFINITION DU SLICE FOURNISSEURS ---
const fournisseursSlice = createSlice({
  name: 'fournisseurs',
  initialState: {
    items: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers(builder) {
    builder
      // Cas pour fetchFournisseurs
      .addCase(fetchFournisseurs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchFournisseurs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchFournisseurs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.message || 'Erreur inconnue';
      })

      // Cas pour addNewFournisseur
      .addCase(addNewFournisseur.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      
      // Cas pour updateFournisseur
      .addCase(updateFournisseur.fulfilled, (state, action) => {
        const updatedFournisseur = action.payload;
        const existingIndex = state.items.findIndex(item => item._id === updatedFournisseur._id);
        if (existingIndex !== -1) {
          state.items[existingIndex] = updatedFournisseur;
        }
      })
      
      // Cas pour deleteFournisseur
      .addCase(deleteFournisseur.fulfilled, (state, action) => {
        const fournisseurId = action.payload;
        state.items = state.items.filter(item => item._id !== fournisseurId);
      });
  }
});

export default fournisseursSlice.reducer;