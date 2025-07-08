import React from 'react';
import { useSelector } from 'react-redux';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { FaUsers, FaShoppingCart, FaDollarSign, FaFileInvoice } from 'react-icons/fa';

// Import de nos composants UI
import Card from '../components/ui/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Alert from '../components/ui/Alert';

// Données factices pour la démonstration (à remplacer par les données de l'API/Redux)
const kpiData = {
  dailyRevenue: 1250000,
  newClients: 5,
  pendingOrders: 12,
  invoicesToSend: 8,
};

const salesChartData = [
  { name: 'Jan', Ventes: 400000 },
  { name: 'Fév', Ventes: 300000 },
  { name: 'Mar', Ventes: 500000 },
  { name: 'Avr', Ventes: 450000 },
  { name: 'Mai', Ventes: 600000 },
  { name: 'Juin', Ventes: 550000 },
];

const recentActivities = [
    { id: 1, type: 'vente', text: 'Nouvelle vente #V2024-101 pour Client A' },
    { id: 2, type: 'client', text: 'Nouveau client enregistré: Société B' },
    { id: 3, type: 'facture', text: 'Facture #F2024-098 marquée comme payée' },
    { id: 4, type: 'stock', text: 'Alerte stock bas pour le produit "Stylo Bic"' },
];

// Composant pour les cartes de KPI
const KpiCard = ({ title, value, icon, variant }) => (
  <Card className={`kpi-card border-${variant} text-white bg-${variant}`}>
    <Card.Body>
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h5 className="card-title text-uppercase">{title}</h5>
          <h3>{value}</h3>
        </div>
        <div className="kpi-icon" style={{ opacity: 0.5 }}>
          {icon}
        </div>
      </div>
    </Card.Body>
  </Card>
);


const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  // Pour le futur:
  // const { data, isLoading, error } = useSelector((state) => state.dashboard);
  // const dispatch = useDispatch();
  //
  // useEffect(() => {
  //   dispatch(fetchDashboardData());
  // }, [dispatch]);

  // Pour la démo:
  const isLoading = false;
  const error = null;

  if (isLoading) {
    return <LoadingSpinner asOverlay text="Chargement du tableau de bord..." />;
  }

  if (error) {
    return <Alert variant="danger">Impossible de charger les données du tableau de bord.</Alert>;
  }

  return (
    <div>
      <h2 className="mb-4">Bonjour, {user?.nom} !</h2>

      {/* Section des Indicateurs Clés de Performance (KPIs) */}
      <div className="row">
        <div className="col-lg-3 col-md-6">
          <KpiCard title="Revenu du jour" value={`${kpiData.dailyRevenue.toLocaleString('fr-FR')} FCFA`} icon={<FaDollarSign />} variant="primary" />
        </div>
        <div className="col-lg-3 col-md-6">
          <KpiCard title="Nouveaux Clients" value={`+${kpiData.newClients}`} icon={<FaUsers />} variant="success" />
        </div>
        <div className="col-lg-3 col-md-6">
          <KpiCard title="Commandes en attente" value={kpiData.pendingOrders} icon={<FaShoppingCart />} variant="warning" />
        </div>
        <div className="col-lg-3 col-md-6">
          <KpiCard title="Factures à envoyer" value={kpiData.invoicesToSend} icon={<FaFileInvoice />} variant="info" />
        </div>
      </div>

      {/* Section des Graphiques */}
      <div className="row mt-4">
        <div className="col-lg-8">
          <Card header="Évolution des ventes (6 derniers mois)">
            <Card.Body>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `${(value / 1000)}k`} />
                  <Tooltip formatter={(value) => [`${value.toLocaleString('fr-FR')} FCFA`, "Ventes"]}/>
                  <Legend />
                  <Line type="monotone" dataKey="Ventes" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </div>
        <div className="col-lg-4">
           <Card header="Activités Récentes">
              <Card.Body>
                <ul className="list-group list-group-flush">
                    {recentActivities.map(activity => (
                        <li key={activity.id} className="list-group-item">{activity.text}</li>
                    ))}
                </ul>
              </Card.Body>
           </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;