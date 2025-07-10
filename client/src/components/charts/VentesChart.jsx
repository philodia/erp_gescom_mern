import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { formatDate } from '../../utils/formatters';
import Card from '../ui/Card';
import LoadingSpinner from '../common/LoadingSpinner';

/**
 * Affiche un graphique en barres du nombre de ventes (ou autres documents) sur une période.
 *
 * @param {object} props
 * @param {Array<{date: string, count: number}>} props.data - Les données à afficher. Ex: [{ date: '2024-05-01', count: 15 }]
 * @param {boolean} [props.isLoading=false] - Si true, affiche un spinner.
 * @param {string} [props.title='Nombre de Ventes'] - Le titre du graphique.
 * @param {string} [props.dataKey='count'] - La clé des données pour la valeur Y.
 * @param {string} [props.name='Ventes'] - Le nom de la série de données pour la légende.
 * @param {string} [props.color='var(--success)'] - La couleur des barres.
 * @returns {JSX.Element}
 */
const VentesChart = ({
  data,
  isLoading = false,
  title = 'Nombre de Ventes',
  dataKey = 'count',
  name = 'Ventes',
  color = 'var(--success, #198754)', // Utilise une variable CSS avec un fallback
}) => {
  
  // Formatter pour le tooltip (infobulle)
  const customTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip" style={{ backgroundColor: '#fff', border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
          <p className="label">{`Date : ${formatDate(label)}`}</p>
          <p className="intro" style={{ color: payload[0].fill }}>
            {`${payload[0].name} : ${payload[0].value}`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card title={title} style={{ position: 'relative' }}>
      {isLoading && <LoadingSpinner asOverlay />}
      <div style={{ height: '300px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            barSize={20} // Largeur des barres
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
            <XAxis dataKey="date" tickFormatter={(tick) => formatDate(tick, 'dd/MM')} />
            <YAxis allowDecimals={false} /> {/* On n'autorise pas les décimales pour un décompte */}
            <Tooltip content={customTooltip} cursor={{fill: 'rgba(0,0,0,0.1)'}} />
            <Legend />
            <Bar
              dataKey={dataKey}
              name={name}
              fill={color}
              radius={[4, 4, 0, 0]} // Coins arrondis en haut des barres
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default VentesChart;