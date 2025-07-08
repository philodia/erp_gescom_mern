const mongoose = require('mongoose');
const Produit = require('../models/Produit'); // Assurez-vous que le chemin est correct
const MouvementStock = require('../models/MouvementStock');
const { STOCK_MOVEMENT_TYPES } = require('../utils/constants');

class StockService {
  /**
   * Gère un mouvement de stock (entrée ou sortie) de manière atomique.
   * Crée un enregistrement de mouvement et met à jour la quantité du produit.
   * Utilise une transaction MongoDB pour garantir l'intégrité des données.
   *
   * @param {string} produitId - L'ID du produit à mettre à jour.
   * @param {number} quantite - La quantité à ajouter (positive) ou à retirer (négative).
   * @param {string} typeMouvement - Le type de mouvement (depuis les constantes).
   * @param {object} options - Options supplémentaires { documentRef, notes, userId }.
   * @returns {Promise<object>} Le nouveau mouvement de stock créé.
   */
  async creerMouvement(produitId, quantite, typeMouvement, options = {}) {
    // Une session est nécessaire pour les transactions MongoDB.
    const session = await mongoose.startSession();

    try {
      // Démarrer la transaction.
      session.startTransaction();
      // 1. Vérifier si le produit existe.
      const produit = await Produit.findById(produitId).session(session);
      if (!produit) {
        throw new Error(`Produit avec l'ID ${produitId} non trouvé.`);
      }
      // 2. Vérifier si le stock est suffisant pour une sortie.
      if (quantite < 0 && (produit.quantiteEnStock + quantite < 0)) {
        throw new Error(`Stock insuffisant pour le produit "${produit.nom}". Stock actuel: ${produit.quantiteEnStock}, Sortie demandée: ${-quantite}.`);
      }
      // 3. Mettre à jour la quantité en stock du produit.
      // L'opérateur $inc est atomique et parfait pour cela.
      const updatedProduit = await Produit.findByIdAndUpdate(
        produitId,
        { $inc: { quantiteEnStock: quantite } },
        { new: true, session }
      );
      // 4. Créer l'enregistrement du mouvement de stock.
      const mouvement = new MouvementStock({
        produit: produitId,
        type: typeMouvement,
        quantite: quantite,
        documentRef: options.documentRef,
        notes: options.notes,
        createdBy: options.userId,
      });
      await mouvement.save({ session });
      // 5. Valider la transaction.
      await session.commitTransaction();
      console.log(`✅ Mouvement de stock créé pour le produit ${produit.nom}. Nouvelle quantité: ${updatedProduit.quantiteEnStock}`);
      return mouvement;
    } catch (error) {
      // En cas d'erreur, annuler toutes les opérations de la transaction.
      await session.abortTransaction();
      console.error(`❌ Erreur lors de la création du mouvement de stock: ${error.message}`);
      // Renvoyer l'erreur pour que le code appelant puisse la gérer.
      throw error;
    } finally {
      // Toujours terminer la session.
      session.endSession();
    }
  }

  /**
   * Raccourci pour enregistrer une sortie de stock (vente, retour fournisseur...).
   * @param {string} produitId
   * @param {number} quantite - La quantité à retirer (doit être positive).
   * @param {string} type - Le type de sortie.
   * @param {object} options
   */
  async sortieStock(produitId, quantite, type = STOCK_MOVEMENT_TYPES.SORTIE_VENTE, options = {}) {
    if (quantite <= 0) {
      throw new Error('La quantité pour une sortie de stock doit être positive.');
    }
    // La quantité est passée en négatif à la méthode principale.
    return this.creerMouvement(produitId, -quantite, type, options);
  }

  /**
   * Raccourci pour enregistrer une entrée de stock (achat, retour client...).
   * @param {string} produitId
   * @param {number} quantite - La quantité à ajouter (doit être positive).
   * @param {string} type - Le type d'entrée.
   * @param {object} options
   */
  async entreeStock(produitId, quantite, type = STOCK_MOVEMENT_TYPES.ENTREE_ACHAT, options = {}) {
    if (quantite <= 0) {
      throw new Error('La quantité pour une entrée de stock doit être positive.');
    }
    return this.creerMouvement(produitId, quantite, type, options);
  }
}

module.exports = new StockService();
