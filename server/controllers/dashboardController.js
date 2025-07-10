const asyncHandler = require('express-async-handler');
const reportService = require('../services/reportService'); // On réutilise notre puissant service de rapports
const { getPeriodDates } = require('../utils/dateUtils'); // Notre helper pour les dates
const { successResponse } = require('../utils/helpers');
const Produit = require('../models/Produit'); // On peut avoir besoin d'autres modèles

/**
 * @desc    Récupérer toutes les données agrégées pour le dashboard principal.
 * @route   GET /api/dashboard
 * @access  Private
 */
exports.getDashboardData = asyncHandler(async (req, res) => {
    // 1. Définir les périodes pour les KPIs
    const today = getPeriodDates('today');
    const thisMonth = getPeriodDates('this_month');

    // 2. Lancer les calculs en parallèle pour plus de performance
    const [
        salesReportToday,
        salesReportMonth,
        lowStockProductsCount
    ] = await Promise.all([
        reportService.generateSalesReport(today.startDate, today.endDate),
        reportService.generateSalesReport(thisMonth.startDate, thisMonth.endDate),
        Produit.countDocuments({ 
            $expr: { $lte: ['$quantiteEnStock', '$seuilAlerte'] },
            isActive: true 
        })
    ]);

    // 3. Formater la réponse du dashboard
    const dashboardData = {
        kpis: {
            ca_jour: salesReportToday.kpis.chiffreAffairesHT,
            ca_mois: salesReportMonth.kpis.chiffreAffairesHT,
            commandes_mois: salesReportMonth.kpis.nombreFactures,
            panier_moyen_mois: salesReportMonth.kpis.panierMoyenHT,
            produits_stock_faible: lowStockProductsCount
        },
        ventes_recentes: salesReportMonth.detailVentes.slice(0, 5), // Les 5 dernières ventes du mois
        top_produits_mois: salesReportMonth.topProduits,
        top_clients_mois: salesReportMonth.topClients,
    };

    successResponse(res, 200, 'Données du dashboard récupérées avec succès.', dashboardData);
});