import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// --- THUNKS ASYNCHRONES POUR LES FOURNISSEURS ---

/**
 * Thunk pour RÉCUPÉRER une page de fournisseurs.
 * @param {object} [args] - Arguments { page, limit, search }.
 */
export const fetchFournisseurs = createAsyncThunk(
  'fournisseurs/fetchFournisseurs',
  async (args = {}, { rejectWithValue }) => {
    try {
      // Notre api.get retourne maintenant directement les données.
      const data = await api.get('/fournisseurs', { params: args });
      // L'API retourne un objet { fournisseurs: [...], pagination: {...} }
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Erreur de chargement des fournisseurs.');
    }
  }
);

/**
 * Thunk pour CRÉER un nouveau fournisseur.
 */
export const addNewFournisseur = createAsyncThunk(
  'fournisseurs/addNewFournisseur',
  async (fournisseurData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/fournisseurs', fournisseurData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

/**
 * Thunk pour METTRE À JOUR un fournisseur.
 */
export const updateFournisseur = createAsyncThunk(
  'fournisseurs/updateFournisseur',
  async (fournisseurData, { rejectWithValue }) => {
    const { _id, ...updateData } = fournisseurData;
    try {
      const { data } = await api.put(`/fournisseurs/${_id}`, updateData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

/**
 * Thunk pour SUPPRIMER (désactiver) un fournisseur.
 */
export const deleteFournisseur = createAsyncThunk(
  'fournisseurs/deleteFournisseur',
  async (fournisseurId, { rejectWithValue }) => {
    try {
      await api.delete(`/fournisseurs/${fournisseurId}`);
      return fournisseurId;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);


// --- DÉFINITION DU SLICE FOURNISSEURS ---
const fournisseursSlice = createSlice({
  name: 'fournisseurs',
  // --- État initial mis à jour pour inclure la pagination ---
  initialState: {
    items: [],
    pagination: {
      total: 0,
      limit: 10,
      currentPage: 1,
      totalPages: 1,
    },
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers(builder) {
    builder
      // --- Cas pour fetchFournisseurs mis à jour ---
      .addCase(fetchFournisseurs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchFournisseurs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.fournisseurs; // Mettre à jour la liste
        state.pagination = action.payload.pagination; // Mettre à jour la pagination
      })
      .addCase(fetchFournisseurs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Erreur inconnue';
      })

      // --- Cas pour les autres thunks (similaires à clientsSlice) ---
      .addCase(addNewFournisseur.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        state.pagination.total += 1;
      })
      .addCase(updateFournisseur.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.items.findIndex(item => item._id === updated._id);
        if (index !== -1) {
          state.items[index] = updated;
        }
      })
      .addCase(deleteFournisseur.fulfilled, (state, action) => {
        const id = action.payload;
        state.items = state.items.filter(item => item._id !== id);
        state.pagination.total -= 1;
      });
  }
});

export default fournisseursSlice.reducer;