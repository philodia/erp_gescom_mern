import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// --- THUNKS ASYNCHRONES ---

/**
 * Thunk pour RÉCUPÉRER une page de clients.
 * Accepte maintenant des arguments pour la pagination et la recherche.
 * @param {object} [args] - Arguments { page, limit, search }.
 */
export const fetchClients = createAsyncThunk(
  'clients/fetchClients',
  async (args = {}, { rejectWithValue }) => {
    try {
      // Notre service API retourne maintenant directement les données.
      const data = await api.get('/clients', { params: args });
      return data; // Retourne l'objet complet { clients: [...], pagination: {...} }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Erreur de chargement des clients.');
    }
  }
);

/**
 * Thunk pour CRÉER un nouveau client.
 */
export const addNewClient = createAsyncThunk(
  'clients/addNewClient',
  async (clientData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/clients', clientData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

/**
 * Thunk pour METTRE À JOUR un client.
 */
export const updateClient = createAsyncThunk(
  'clients/updateClient',
  async (clientData, { rejectWithValue }) => {
    const { _id, ...updateData } = clientData;
    try {
      const { data } = await api.put(`/clients/${_id}`, updateData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

/**
 * Thunk pour SUPPRIMER (désactiver) un client.
 */
export const deleteClient = createAsyncThunk(
  'clients/deleteClient',
  async (clientId, { rejectWithValue }) => {
    try {
      await api.delete(`/clients/${clientId}`);
      return clientId;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);


// --- DÉFINITION DU SLICE ---
const clientsSlice = createSlice({
  name: 'clients',
  // --- État initial mis à jour ---
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
      // --- Cas pour fetchClients mis à jour ---
      .addCase(fetchClients.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Mettre à jour la liste des clients ET les informations de pagination
        state.items = action.payload.clients;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Erreur inconnue';
      })

      // --- Cas pour les autres thunks ---
      .addCase(addNewClient.fulfilled, (state, action) => {
        // Ajoute le nouveau client au début et met à jour le total
        state.items.unshift(action.payload);
        state.pagination.total += 1;
      })
      .addCase(updateClient.fulfilled, (state, action) => {
        const updatedClient = action.payload;
        const index = state.items.findIndex(client => client._id === updatedClient._id);
        if (index !== -1) {
          state.items[index] = updatedClient;
        }
      })
      .addCase(deleteClient.fulfilled, (state, action) => {
        const clientId = action.payload;
        // Filtre la liste et met à jour le total
        state.items = state.items.filter(client => client._id !== clientId);
        state.pagination.total -= 1;
      });
  }
});

// Exporter les actions et le reducer
export default clientsSlice.reducer;