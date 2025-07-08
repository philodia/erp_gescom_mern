const mongoose = require('mongoose');
const EcritureComptable = require('../models/EcritureComptable');
const CompteComptable = require('../models/CompteComptable'); // Assurez-vous d'avoir ce modèle
const JournalComptable = require('../models/JournalComptable'); // Et celui-ci
const Client = require('../models/Client'); // Pour mettre à jour les soldes

class ComptabiliteService {
  /**
   * Trouve un compte par son numéro (ex: '411000') pour éviter les lookups manuels.
   * Met en cache les résultats pour améliorer les performances.
   */
  constructor() {
    this.compteCache = new Map();
  }

  async _getCompte(numero) {
    if (this.compteCache.has(numero)) {
      return this.compteCache.get(numero);
    }
    const compte = await CompteComptable.findOne({ numero });
    if (!compte) throw new Error(`Compte comptable non trouvé pour le numéro : ${numero}`);
    this.compteCache.set(numero, compte);
    return compte;
  }

  async _getJournal(code) {
    // Similaire au cache de compte, on pourrait mettre en cache les journaux
    const journal = await JournalComptable.findOne({ code });
    if (!journal) throw new Error(`Journal comptable non trouvé pour le code : ${code}`);
    return journal;
  }

  /**
   * Génère et enregistre les écritures comptables pour une facture de vente.
   * @param {object} facture - L'objet facture Mongoose complet.
   * @param {object} [options] - Options supplémentaires, comme la session pour les transactions.
   */
  async comptabiliserFactureVente(facture, options = {}) {
    const session = options.session || await mongoose.startSession();
    const useTransaction = !options.session; // Gère la transaction si elle n'est pas déjà gérée à l'extérieur

    try {
      if (useTransaction) session.startTransaction();

      // 1. Récupérer les comptes et journaux nécessaires
      const journalVentes = await this._getJournal('VE');
      const compteClient = await this._getCompte('411000'); // Compte Clients générique
      const compteVentes = await this._getCompte('701000'); // Compte Ventes de Marchandises
      const compteTVACollectee = await this._getCompte('443000'); // Compte TVA Facturée

      // 2. Préparer les lignes de l'écriture
      const lignesEcriture = [];

      // Ligne de débit : On débite le compte client du montant total TTC
      lignesEcriture.push({
        compte: compteClient._id,
        libelle: `Facture ${facture.numero} - ${facture.client.nom}`,
        debit: facture.totalTTC,
        credit: 0,
      });

      // Ligne de crédit : On crédite le compte de ventes du montant HT
      lignesEcriture.push({
        compte: compteVentes._id,
        libelle: `Ventes sur facture ${facture.numero}`,
        debit: 0,
        credit: facture.totalHT,
      });

      // Ligne de crédit : On crédite le compte de TVA collectée
      const montantTVA = facture.totalTTC - facture.totalHT;
      if (montantTVA > 0) {
        lignesEcriture.push({
          compte: compteTVACollectee._id,
          libelle: `TVA sur facture ${facture.numero}`,
          debit: 0,
          credit: montantTVA,
        });
      }

      // 3. Vérifier que l'écriture est équilibrée
      const totalDebit = lignesEcriture.reduce((sum, l) => sum + l.debit, 0);
      const totalCredit = lignesEcriture.reduce((sum, l) => sum + l.credit, 0);

      if (Math.abs(totalDebit - totalCredit) > 0.01) { // Tolérance pour les erreurs de flottants
        throw new Error('L\'écriture comptable pour la facture est déséquilibrée.');
      }

      // 4. Créer et sauvegarder l'écriture comptable
      const ecriture = new EcritureComptable({
        journal: journalVentes._id,
        date: facture.dateEmission,
        libelle: `Comptabilisation facture n°${facture.numero}`,
        documentRef: facture.numero,
        lignes: lignesEcriture,
        isBalanced: true
      });
      await ecriture.save({ session });

      // 5. Mettre à jour le solde du client (Grand Livre Auxiliaire)
      await Client.findByIdAndUpdate(facture.client._id,
        { $inc: { solde: facture.totalTTC } },
        { session }
      );

      // 6. Marquer la facture comme comptabilisée
      facture.comptabilise = true;
      await facture.save({ session });

      if (useTransaction) await session.commitTransaction();

      console.log(`✅ Facture ${facture.numero} comptabilisée avec succès.`);
      return ecriture;
    } catch (error) {
      if (useTransaction) await session.abortTransaction();
      console.error(`❌ Erreur lors de la comptabilisation de la facture ${facture.numero}:`, error);
      throw error;
    } finally {
      if (useTransaction) session.endSession();
    }
  }

  // Vous ajouteriez ici d'autres méthodes comme...
  // async comptabiliserPaiementClient(paiement) { ... }
  // async comptabiliserFactureAchat(factureAchat) { ... }
  // async genererEcrituresPaie(bulletins) { ... }
}

module.exports = new ComptabiliteService();
