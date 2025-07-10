const asyncHandler = require('express-async-handler');
const path = require('path');
const fs = require('fs');
const Parametres = require('../models/Parametres');
const { successResponse } = require('../utils/helpers');
const storageConfig = require('../config/storage'); // Importer la config de stockage

/**
 * @desc    Obtenir les paramètres de l'entreprise.
 * @route   GET /api/parametres
 * @access  Private
 */
exports.getParametres = asyncHandler(async (req, res) => {
  const parametres = await Parametres.findOne();

  if (!parametres) {
    return successResponse(res, 200, 'Aucun paramètre trouvé. Prêt pour la création.', {});
  }
  
  successResponse(res, 200, 'Paramètres récupérés avec succès.', parametres);
});


/**
 * @desc    Mettre à jour ou créer les paramètres textuels de l'entreprise (Upsert).
 * @route   PUT /api/parametres
 * @access  Private/Admin
 */
exports.updateParametres = asyncHandler(async (req, res) => {
  // On s'assure de ne jamais mettre à jour des champs non modifiables comme 'logo' ici.
  const { logo, logoUrl, _id, createdAt, updatedAt, ...dataToUpdate } = req.body;

  const options = {
    new: true,
    upsert: true,
    runValidators: true,
    setDefaultsOnInsert: true,
  };

  const updatedParametres = await Parametres.findOneAndUpdate({}, dataToUpdate, options);
  
  successResponse(res, 200, 'Paramètres enregistrés avec succès.', updatedParametres);
});


/**
 * @desc    Mettre à jour le logo de l'entreprise.
 * @route   PUT /api/parametres/logo
 * @access  Private/Admin
 */
exports.updateLogo = asyncHandler(async (req, res) => {
    if (!req.file) {
        res.status(400);
        throw new Error('Aucun fichier de logo n\'a été fourni.');
    }

    // Récupérer les paramètres actuels pour connaître l'ancien logo
    const currentParams = await Parametres.findOne();

    // Si un ancien logo existe (et n'est pas le logo par défaut), on le supprime du disque
    if (currentParams && currentParams.logo) {
      const oldLogoPath = path.join(storageConfig.disks.local.root, currentParams.logo);
      // fs.existsSync est synchrone, mais c'est acceptable ici car rapide.
      if (fs.existsSync(oldLogoPath)) {
        fs.unlink(oldLogoPath, (err) => {
            if (err) console.error(`Échec de la suppression de l'ancien logo: ${oldLogoPath}`, err);
            else console.log(`Ancien logo supprimé: ${oldLogoPath}`);
        });
      }
    }

    // Construire le chemin relatif à partir du chemin absolu du fichier uploadé
    const relativePath = path.relative(storageConfig.disks.local.root, req.file.path).replace(/\\/g, '/');
    
    // Mettre à jour ou créer les paramètres avec le nouveau chemin du logo
    const options = {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true
    };
    
    const updatedParametres = await Parametres.findOneAndUpdate(
        {},
        { logo: relativePath },
        options
    );
    
    successResponse(res, 200, 'Logo mis à jour avec succès.', { logoUrl: updatedParametres.logoUrl });
});