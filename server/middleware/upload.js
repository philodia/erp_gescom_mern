const multer = require('multer');
const path = require('path');
const fs = require('fs');
const storageConfig = require('../config/storage'); // <-- Importer notre configuration

/**
 * Configure le stockage sur disque pour Multer en utilisant la configuration centralisée.
 * @param {string} subfolderKey - La clé du sous-dossier dans storageConfig.paths (ex: 'logos').
 */
const diskStorage = (subfolderKey) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      // Construit le chemin de destination à partir de la config
      const rootPath = storageConfig.disks.local.root;
      const subfolder = storageConfig.paths[subfolderKey] || 'general';
      const uploadPath = path.join(rootPath, subfolder);
      
      fs.mkdirSync(uploadPath, { recursive: true });
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const extension = path.extname(file.originalname);
      cb(null, path.basename(file.originalname, extension).replace(/\s/g, '_') + '-' + uniqueSuffix + extension);
    },
  });
};

/**
 *  NOTE: Pour un stockage S3 en production, on utiliserait un moteur de stockage
 *  différent, comme 'multer-s3'. La logique ci-dessous est un exemple de
 *  comment on pourrait structurer cela.
 * 
 *  const s3Storage = multerS3({ ... });
 *  const storageEngine = storageConfig.disk === 's3' ? s3Storage : diskStorage;
 */


// (Les fonctions de filtrage de fichiers 'imageFileFilter' et 'documentFileFilter' restent identiques)
const imageFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Type de fichier non supporté. Seules les images sont autorisées.'), false);
  }
};

const documentFileFilter = (req, file, cb) => {
  const allowedMimes = [ /* ... */ ];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Type de fichier non supporté.'), false);
  }
};


/**
 * Crée une instance de middleware Multer configurable.
 *
 * @param {string} subfolderKey - La clé du sous-dossier dans storageConfig.paths.
 * @param {function} fileFilter - La fonction de filtrage de fichiers.
 * @param {number} [fileSizeLimit=5] - La limite de taille du fichier en Mo.
 * @returns Un middleware Multer.
 */
const createUploader = (subfolderKey, fileFilter, fileSizeLimit = 5) => {
  // Pour l'instant, on utilise toujours le stockage sur disque.
  // On pourrait ajouter ici la logique pour choisir le moteur de stockage (local vs S3).
  const storage = diskStorage(subfolderKey);
  
  return multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
      fileSize: fileSizeLimit * 1024 * 1024,
    },
  });
};

// --- Instances de middleware préconfigurées ---
// On utilise maintenant les clés de `storageConfig.paths` pour plus de cohérence.

exports.uploadLogo = createUploader('logos', imageFileFilter, 2).single('logo');
exports.uploadProduitImage = createUploader('produits', imageFileFilter, 5).single('image');
exports.uploadProduitGalerie = createUploader('produits', imageFileFilter, 5).array('galerie', 5);
exports.uploadDocument = createUploader('documents', documentFileFilter, 10).single('document');
exports.uploadAvatar = createUploader('avatars', imageFileFilter, 2).single('avatar');


// (Le gestionnaire d'erreurs 'handleUploadErrors' reste identique)
exports.handleUploadErrors = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'Le fichier est trop volumineux.' });
        }
        return res.status(400).json({ message: err.message });
    } else if (err) {
        return res.status(400).json({ message: err.message });
    }
    next();
};