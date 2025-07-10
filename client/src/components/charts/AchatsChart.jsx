import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
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
 * Affiche un graphique de l'évolution des dépenses d'achats.
 *
 * @param {object} props
 * @param {Array<{date: string, montantAchats: number}>} props.data - Les données à afficher.
 * @param {boolean} [props.isLoading=false] - Si true, affiche un spinner.
 * @param {string} [props.title='Évolution des Dépenses d\'Achats'] - Le titre du graphique.
 * @param {string} [props.dataKey='montantAchats'] - La clé des données pour la valeur Y.
 * @param {string} [props.name='Dépenses (HT)'] - Le nom de la série de données pour la légende.
 * @returns {JSX.Element}
 */
const AchatsChart = ({
  data,
  isLoading = false,
  title = "Évolution des Dépenses d'Achats",
  dataKey = 'montantAchats',
  name = 'Dépenses (HT)',
}) => {

  // Formatter pour l'axe Y (les montants)
  const yAxisFormatter = (value) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)} M`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)} K`;
    return value;
  };
  
  // Formatter pour le tooltip (infobulle)
  const customTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '10px', borderRadius: '5px' }}>
          <p className="label">{`Date : ${formatDate(label)}`}</p>
          <p className="intro" style={{ color: payload[0].color }}>
            {`${payload[0].name} : ${formatCurrency(payload[0].value)}`}
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
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              {/* On définit un nouveau dégradé avec une couleur différente */}
              <linearGradient id="colorAchats" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--warning, #ffc107)" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="var(--warning, #ffc107)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
            <XAxis dataKey="date" tickFormatter={(tick) => formatDate(tick, 'dd/MM')} />
            <YAxis tickFormatter={yAxisFormatter} />
            <Tooltip content={customTooltip} />
            <Legend />
            <Area
              type="monotone"
              dataKey={dataKey}
              name={name}
              stroke="var(--warning, #ffc107)"
              fillOpacity={1}
              fill="url(#colorAchats)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default AchatsChart;