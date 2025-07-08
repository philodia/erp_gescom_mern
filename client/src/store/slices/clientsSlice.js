import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api'; // Notre instance Axios configurée

// --- THUNKS ASYNCHRONES ---
// Ces fonctions gèrent la communication avec l'API et déclenchent des actions
// (pending, fulfilled, rejected) que notre slice va écouter.

// Thunk pour RÉCUPÉRER tous les clients
export const fetchClients = createAsyncThunk(
  'clients/fetchClients',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/clients');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Thunk pour CRÉER un nouveau client
export const addNewClient = createAsyncThunk(
  'clients/addNewClient',
  async (clientData, { rejectWithValue }) => {
    try {
      const response = await api.post('/clients', clientData);
      return response.data.data; // Notre API retourne { message, data }
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Thunk pour METTRE À JOUR un client
export const updateClient = createAsyncThunk(
  'clients/updateClient',
  async ({ id, ...clientData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/clients/${id}`, clientData);
      return response.data.data; // Notre API retourne { message, data }
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Thunk pour SUPPRIMER (désactiver) un client
export const deleteClient = createAsyncThunk(
  'clients/deleteClient',
  async (clientId, { rejectWithValue }) => {
    try {
      await api.delete(`/clients/${clientId}`);
      return clientId; // On retourne l'ID pour savoir qui supprimer de l'état local
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);


// --- DÉFINITION DU SLICE ---
const clientsSlice = createSlice({
  name: 'clients',
  initialState: {
    items: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  // Reducers synchrones (si nous en avions besoin)
  reducers: {},
  // Reducers pour les actions asynchrones (générées par createAsyncThunk)
  extraReducers(builder) {
    builder
      // Cas pour fetchClients
      .addCase(fetchClients.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload; // Remplace la liste par celle du serveur
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.message || 'Erreur inconnue';
      })

      // Cas pour addNewClient
      .addCase(addNewClient.fulfilled, (state, action) => {
        state.items.unshift(action.payload); // Ajoute le nouveau client au début de la liste
      })
      
      // Cas pour updateClient
      .addCase(updateClient.fulfilled, (state, action) => {
        const updatedClient = action.payload;
        const existingClientIndex = state.items.findIndex(client => client._id === updatedClient._id);
        if (existingClientIndex !== -1) {
          state.items[existingClientIndex] = updatedClient; // Remplace l'ancien client par le nouveau
        }
      })
      
      // Cas pour deleteClient
      .addCase(deleteClient.fulfilled, (state, action) => {
        const clientId = action.payload;
        // Filtre la liste pour enlever le client supprimé
        state.items = state.items.filter(client => client._id !== clientId);
      });
  }
});

// Exporter le reducer généré par le slice
export default clientsSlice.reducer;