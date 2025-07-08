const Facture = require('../models/Facture'); // Ajustez les chemins si nécessaire
const Produit = require('../models/Produit');
const Client = require('../models/Client');
const { DOCUMENT_STATUS } = require('../utils/constants');

class ReportService {
  /**
   * Génère un rapport de ventes complet pour une période donnée.
   *
   * @param {Date} startDate - La date de début de la période.
   * @param {Date} endDate - La date de fin de la période.
   * @returns {Promise<object>} Un objet contenant les KPIs, les classements, etc.
   */
  async generateSalesReport(startDate, endDate) {
    try {
      // --- 1. Filtrer les factures valides sur la période ---
      const matchStage = {
        $match: {
          dateEmission: { $gte: startDate, $lte: endDate },
          // On ne compte que les factures qui ne sont pas des brouillons ou annulées
          statut: { $in: [DOCUMENT_STATUS.ENVOYE, DOCUMENT_STATUS.PAYEE, DOCUMENT_STATUS.PARTIELLEMENT_PAYEE, DOCUMENT_STATUS.EN_RETARD] }
        }
      };

      // --- 2. Pipeline d'agrégation principal pour les KPIs ---
      const kpiPipeline = [
        matchStage,
        {
          $group: {
            _id: null, // Regrouper tous les documents ensemble
            chiffreAffairesHT: { $sum: '$totalHT' },
            chiffreAffairesTTC: { $sum: '$totalTTC' },
            nombreFactures: { $sum: 1 }
          }
        },
        {
          $project: {
            _id: 0,
            chiffreAffairesHT: 1,
            chiffreAffairesTTC: 1,
            nombreFactures: 1,
            panierMoyenHT: { $divide: ['$chiffreAffairesHT', '$nombreFactures'] }
          }
        }
      ];

      const [kpis] = await Facture.aggregate(kpiPipeline);

      // --- 3. Pipeline pour le Top 5 des Clients ---
      const topClientsPipeline = [
          matchStage,
          {
              $group: {
                  _id: '$client', // Regrouper par ID client
                  caTotal: { $sum: '$totalHT' },
                  nombreFactures: { $sum: 1 }
              }
          },
          { $sort: { caTotal: -1 } }, // Trier par CA décroissant
          { $limit: 5 },
          {
              $lookup: { // Faire une jointure pour récupérer le nom du client
                  from: Client.collection.name,
                  localField: '_id',
                  foreignField: '_id',
                  as: 'clientInfo'
              }
          },
          {
              $unwind: '$clientInfo'
          },
          {
              $project: {
                  _id: 0,
                  clientId: '$_id',
                  nom: '$clientInfo.nom',
                  caTotal: 1,
                  nombreFactures: 1,
              }
          }
      ];

      const topClients = await Facture.aggregate(topClientsPipeline);

      // --- 4. Pipeline pour le Top 5 des Produits ---
      const topProduitsPipeline = [
        matchStage,
        { $unwind: '$lignes' }, // "Dénormalise" le tableau des lignes
        {
          $group: {
            _id: '$lignes.produit', // Regrouper par ID produit
            quantiteTotale: { $sum: '$lignes.quantite' },
            caTotal: { $sum: { $multiply: ['$lignes.quantite', '$lignes.prixUnitaire'] } }
          }
        },
        { $sort: { caTotal: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: Produit.collection.name,
            localField: '_id',
            foreignField: '_id',
            as: 'produitInfo'
          }
        },
        { $unwind: '$produitInfo' },
        {
          $project: {
            _id: 0,
            produitId: '$_id',
            nom: '$produitInfo.nom',
            quantiteTotale: 1,
            caTotal: 1,
          }
        }
      ];

      const topProduits = await Facture.aggregate(topProduitsPipeline);

      // --- 5. Récupérer le détail des factures pour la liste ---
      const detailVentes = await Facture.find(matchStage.$match).populate('client', 'nom').sort({ dateEmission: -1 });

      return {
        kpis: kpis || { chiffreAffairesHT: 0, chiffreAffairesTTC: 0, nombreFactures: 0, panierMoyenHT: 0 },
        topClients,
        topProduits,
        detailVentes
      };
    } catch (error) {
      console.error('❌ Erreur lors de la génération du rapport de ventes :', error);
      throw new Error('Impossible de générer le rapport de ventes.');
    }
  }

  // Vous ajouteriez ici d'autres méthodes de rapport...
  // async generateStockReport() { ... }
  // async generateAccountingJournal(startDate, endDate, journalCode) { ... }
}

module.exports = new ReportService();
