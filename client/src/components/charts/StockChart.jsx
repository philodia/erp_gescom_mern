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
import Card from '../ui/Card';
import LoadingSpinner from '../common/LoadingSpinner';
import { truncateText } from '../../utils/formatters';

/**
 * Affiche un graphique en barres horizontales représentant l'état des stocks
 * pour les produits les plus (ou les moins) stockés.
 *
 * @param {object} props
 * @param {Array<{nom: string, quantiteEnStock: number}>} props.data - Les données à afficher.
 * @param {boolean} [props.isLoading=false] - Si true, affiche un spinner.
 * @param {string} [props.title='État des Stocks'] - Le titre du graphique.
 * @param {number} [props.barSize=15] - L'épaisseur des barres.
 * @returns {JSX.Element}
 */
const StockChart = ({
  data,
  isLoading = false,
  title = 'État des Stocks (Top 5 produits)',
  barSize = 15,
}) => {
  
  // Formatter pour le tooltip (infobulle)
  const customTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '10px', borderRadius: '5px' }}>
          <p className="label" style={{ fontWeight: 'bold' }}>{label}</p>
          <p className="intro" style={{ color: payload[0].fill }}>
            {`Quantité : ${payload[0].value}`}
          </p>
        </div>
      );
    }
    return null;
  };
  
  // Formatter pour les labels de l'axe Y (noms des produits) pour les tronquer s'ils sont trop longs
  const yAxisTickFormatter = (value) => {
    return truncateText(value, 20); // Tronque à 20 caractères
  }

  return (
    <Card title={title} style={{ position: 'relative' }}>
      {isLoading && <LoadingSpinner asOverlay />}
      {/* On donne une hauteur minimale pour s'assurer que le graphique est visible même avec peu de données */}
      <div style={{ height: `${Math.max(200, data.length * (barSize + 15))}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical" // <-- La clé pour un graphique en barres horizontales
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
            {/* L'axe X est maintenant l'axe des valeurs (quantité) */}
            <XAxis type="number" />
            {/* L'axe Y est l'axe des catégories (noms de produits) */}
            <YAxis 
                dataKey="nom" 
                type="category" 
                width={120} // Allouer plus de place pour les noms de produits
                tickLine={false}
                axisLine={false}
                tickFormatter={yAxisTickFormatter}
            />
            <Tooltip content={customTooltip} cursor={{fill: 'rgba(0,0,0,0.05)'}} />
            <Legend />
            <Bar
              dataKey="quantiteEnStock"
              name="Quantité en Stock"
              fill="var(--info, #0dcaf0)"
              barSize={barSize}
              radius={[0, 4, 4, 0]} // Coins arrondis à droite
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default StockChart;