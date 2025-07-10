import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { formatCurrency, formatDate } from '../../utils/formatters';
import Card from '../ui/Card';
import LoadingSpinner from '../common/LoadingSpinner';

/**
 * Affiche un graphique en lignes de l'évolution de la trésorerie.
 *
 * @param {object} props
 * @param {Array<{date: string, encaissements: number, decaissements: number, solde: number}>} props.data - Les données à afficher.
 * @param {boolean} [props.isLoading=false] - Si true, affiche un spinner.
 * @param {string} [props.title='Évolution de la Trésorerie'] - Le titre du graphique.
 * @returns {JSX.Element}
 */
const TresorerieChart = ({
  data,
  isLoading = false,
  title = 'Évolution de la Trésorerie',
}) => {

  // Formatter pour l'axe Y (les montants)
  const yAxisFormatter = (value) => {
    if (Math.abs(value) >= 1000000) return `${(value / 1000000).toFixed(1)} M`;
    if (Math.abs(value) >= 1000) return `${(value / 1000).toFixed(0)} K`;
    return value;
  };
  
  // Formatter pour le tooltip (infobulle)
  const customTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '10px', borderRadius: '5px' }}>
          <p className="label" style={{ fontWeight: 'bold' }}>{`Date : ${formatDate(label)}`}</p>
          {payload.map(pld => (
            <p key={pld.dataKey} style={{ color: pld.color }}>
              {`${pld.name} : ${formatCurrency(pld.value)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card title={title} style={{ position: 'relative' }}>
      {isLoading && <LoadingSpinner asOverlay />}
      <div style={{ height: '350px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
            <XAxis dataKey="date" tickFormatter={(tick) => formatDate(tick, 'dd/MM')} />
            <YAxis tickFormatter={yAxisFormatter} />
            <Tooltip content={customTooltip} />
            <Legend />
            <Line
              type="monotone"
              dataKey="encaissements"
              name="Encaissements"
              stroke="var(--success, #198754)"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="decaissements"
              name="Décaissements"
              stroke="var(--danger, #dc3545)"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="solde"
              name="Solde Trésorerie"
              stroke="var(--primary, #0d6efd)"
              strokeWidth={3} // Ligne plus épaisse pour le solde
              dot={false} // Pas de points pour la ligne de solde pour la clarté
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default TresorerieChart;