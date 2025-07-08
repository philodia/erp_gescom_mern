const asyncHandler = require('express-async-handler');
const Parametres = require('../models/Parametres');
const { successResponse } = require('../utils/helpers');

/**
 * @desc    Obtenir les paramètres de l'entreprise.
 * @route   GET /api/parametres
 * @access  Private
 */
exports.getParametres = asyncHandler(async (req, res) => {
  // `findOne()` sans filtre récupère le premier (et seul) document de la collection.
  const parametres = await Parametres.findOne();

  // Si aucun paramètre n'existe, on retourne un objet vide pour que le frontend puisse initialiser le formulaire.
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
  // On s'assure de ne pas traiter le champ 'logo' dans cette fonction.
  const { logo, ...dataToUpdate } = req.body;

  const options = {
    new: true,
    upsert: true,
    runValidators: true,
    // setDefaultsOnInsert est important pour que les valeurs par défaut du schéma soient appliquées à la création.
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
    // Le middleware 'uploadLogo' a déjà traité le fichier et l'a placé dans req.file
    if (!req.file) {
        res.status(400);
        throw new Error('Aucun fichier de logo n\'a été uploadé.');
    }

    // Le chemin relatif à stocker est dans req.file.path. On le nettoie.
    // ex: "C:\projets\erp\server\uploads\logos\logo-123.png" -> "logos\logo-123.png"
    const rootUploadsPath = require('path').join(process.cwd(), 'uploads');
    const relativePath = req.file.path.replace(rootUploadsPath, '').replace(/\\/g, '/').substring(1);
    
    // On met à jour ou on crée les paramètres avec le nouveau chemin du logo.
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