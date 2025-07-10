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
import Card from '../ui/Card'; // On utilise notre composant Card
import LoadingSpinner from '../common/LoadingSpinner';

/**
 * Affiche un graphique de l'évolution du chiffre d'affaires.
 *
 * @param {object} props
 * @param {Array<{date: string, chiffreAffaires: number}>} props.data - Les données à afficher.
 * @param {boolean} [props.isLoading=false] - Si true, affiche un spinner.
 * @param {string} [props.title='Évolution du Chiffre d\'Affaires'] - Le titre du graphique.
 * @param {string} [props.dataKey='chiffreAffaires'] - La clé des données pour la valeur Y.
 * @param {string} [props.name='CA (HT)'] - Le nom de la série de données pour la légende.
 * @returns {JSX.Element}
 */
const ChiffreAffairesChart = ({
  data,
  isLoading = false,
  title = "Évolution du Chiffre d'Affaires",
  dataKey = 'chiffreAffaires',
  name = 'CA (HT)',
}) => {

  // Formatter pour l'axe Y (les montants)
  const yAxisFormatter = (value) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)} M`; // Millions
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)} K`; // Milliers
    }
    return value;
  };
  
  // Formatter pour le tooltip (infobulle)
  const customTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip" style={{ backgroundColor: '#fff', border: '1px solid #ccc', padding: '10px' }}>
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
              <linearGradient id="colorCA" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
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
              stroke="var(--primary)"
              fillOpacity={1}
              fill="url(#colorCA)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default ChiffreAffairesChart;