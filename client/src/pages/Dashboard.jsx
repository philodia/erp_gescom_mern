import React, { useState, useEffect } from 'react';
import { Row, Col, Card as BootstrapCard, Table } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import api from '../services/api';

// --- Imports corrigés et organisés ---
import { formatCurrency } from '../utils/formatters';
import { getRelativeDate } from '../utils/dateUtils';

// --- Composants ---
import Breadcrumb from '../components/common/Breadcrumb';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Card from '../components/ui/Card';
import ChiffreAffairesChart from '../components/charts/ChiffreAffairesChart';
import StockChart from '../components/charts/StockChart';
import { FaDollarSign, FaShoppingCart, FaBoxes } from 'react-icons/fa';

// --- Composant Local pour les KPIs ---
const KpiCard = ({ title, value, icon: Icon, color }) => (
  <BootstrapCard className="shadow-sm h-100">
    <BootstrapCard.Body>
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <div className="text-muted text-uppercase small">{title}</div>
          <h4 className="fw-bold mb-0">{value}</h4>
        </div>
        <div className={`p-3 rounded-circle bg-light-${color}`}>
          <Icon className={`text-${color}`} size="1.5rem" />
        </div>
      </div>
    </BootstrapCard.Body>
  </BootstrapCard>
);

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const responseData = await api.get('/dashboard');
        setData(responseData);
      } catch (error) {
        toast.error("Impossible de charger les données du tableau de bord.");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Afficher un spinner pleine page pendant le chargement initial
  if (isLoading) {
    return <LoadingSpinner asOverlay text="Chargement du tableau de bord..." />;
  }
  
  // Extraire les données avec des valeurs par défaut pour éviter les erreurs
  const kpis = data?.kpis || {};
  const ventesRecentes = data?.ventes_recentes || [];
  const topProduits = data?.top_produits_mois || [];
  const salesOverTime = data?.sales_over_time || [];

  return (
    <>
      <Breadcrumb items={[{ label: 'Dashboard' }]} />

      <Row className="mb-4">
        <Col md={6} lg={3} className="mb-3">
          <KpiCard title="CA du Jour (HT)" value={formatCurrency(kpis.ca_jour)} icon={FaDollarSign} color="primary" />
        </Col>
        <Col md={6} lg={3} className="mb-3">
          <KpiCard title="CA du Mois (HT)" value={formatCurrency(kpis.ca_mois)} icon={FaDollarSign} color="success" />
        </Col>
        <Col md={6} lg={3} className="mb-3">
          <KpiCard title="Ventes du Mois" value={kpis.commandes_mois || 0} icon={FaShoppingCart} color="info" />
        </Col>
        <Col md={6} lg={3} className="mb-3">
          <KpiCard title="Stock Faible" value={kpis.produits_stock_faible || 0} icon={FaBoxes} color="warning" />
        </Col>
      </Row>

      <Row>
        <Col lg={12} className="mb-4">
          <ChiffreAffairesChart data={salesOverTime} />
        </Col>
      </Row>

      <Row>
        <Col lg={7} className="mb-4">
            <Card title="Dernières Ventes">
                <div className="table-responsive">
                    <Table hover>
                        <thead>
                            <tr>
                                <th>Facture N°</th>
                                <th>Client</th>
                                <th>Date</th>
                                <th className="text-end">Montant</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ventesRecentes.length > 0 ? (
                                ventesRecentes.map(vente => (
                                    <tr key={vente._id}>
                                        <td>{vente.numero}</td>
                                        <td>{vente.client?.nom || 'N/A'}</td>
                                        <td>{getRelativeDate(vente.dateEmission)}</td>
                                        <td className="text-end">{formatCurrency(vente.totalTTC)}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center text-muted">Aucune vente récente.</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>
            </Card>
        </Col>
        <Col lg={5} className="mb-4">
          <StockChart 
            data={topProduits} 
            title="Top 5 Produits (par CA ce mois-ci)"
            dataKey="caTotal"
            name="Chiffre d'Affaires"
          />
        </Col>
      </Row>
    </>
  );
};

export default Dashboard;