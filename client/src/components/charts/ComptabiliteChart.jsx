import React, { useCallback, useState } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Sector, // Pour un effet de survol interactif
  Legend,
} from 'recharts';
import { formatCurrency } from '../../utils/formatters';
import Card from '../ui/Card';
import LoadingSpinner from '../common/LoadingSpinner';

// Couleurs prédéfinies pour les segments du graphique
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF4560'];

/**
 * Rendu personnalisé pour un segment de "donut" actif (survolé).
 */
const renderActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;

  return (
    <g>
      <text x={cx} y={cy - 10} dy={8} textAnchor="middle" fill={fill} fontSize={16} fontWeight="bold">
        {payload.name}
      </text>
      <text x={cx} y={cy + 10} textAnchor="middle" fill="#333" fontSize={14}>
        {formatCurrency(value)}
      </text>
      <text x={cx} y={cy + 30} textAnchor="middle" fill="#999" fontSize={12}>
        {`(${(percent * 100).toFixed(2)}%)`}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
    </g>
  );
};


/**
 * Affiche un graphique en anneau (Donut Chart) pour visualiser la répartition comptable.
 *
 * @param {object} props
 * @param {Array<{name: string, value: number}>} props.data - Les données à afficher.
 * @param {boolean} [props.isLoading=false] - Si true, affiche un spinner.
 * @param {string} [props.title='Répartition Comptable'] - Le titre du graphique.
 * @returns {JSX.Element}
 */
const ComptabiliteChart = ({
  data,
  isLoading = false,
  title = 'Répartition Comptable',
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const onPieEnter = useCallback((_, index) => {
    setActiveIndex(index);
  }, [setActiveIndex]);

  return (
    <Card title={title} style={{ position: 'relative' }}>
      {isLoading && <LoadingSpinner asOverlay />}
      <div style={{ height: '350px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape} // Le rendu personnalisé au survol
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60} // <-- La clé pour faire un "Donut"
              outerRadius={80}
              fill="var(--primary, #8884d8)"
              dataKey="value" // La clé qui contient la valeur numérique
              nameKey="name"  // La clé qui contient le nom/label
              onMouseEnter={onPieEnter}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend layout="vertical" align="right" verticalAlign="middle" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default ComptabiliteChart;