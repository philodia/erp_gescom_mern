/**
 * Ce fichier centralise la configuration pour le stockage des fichiers.
 * Il permet de basculer facilement entre le stockage local (développement)
 * et le stockage cloud comme AWS S3 (production).
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '..', '.env') });

const storageConfig = {
  /**
   * Le "disque" de stockage à utiliser par défaut.
   * Options possibles: 'local', 's3'
   * En production, il est fortement recommandé d'utiliser 's3' ou un équivalent.
   */
  disk: process.env.STORAGE_DISK || 'local',
  /**
   * Configurations pour le stockage sur le disque local du serveur.
   */
  disks: {
    local: {
      // Le chemin de base où les fichiers seront stockés.
      // `process.cwd()` est la racine du projet Node.js (ici, le dossier 'server').
      root: require('path').join(process.cwd(), 'uploads'),

      // L'URL de base pour accéder à ces fichiers depuis le frontend.
      // Cela suppose que vous avez configuré un middleware static dans Express.
      url: `${process.env.APP_URL || 'http://localhost:5000'}/uploads/images`,
    },
    /**
     * Configurations pour le stockage sur Amazon S3.
     * À décommenter et compléter lorsque vous passerez en production.
     */
    s3: {
      driver: 's3',
      key: process.env.AWS_ACCESS_KEY_ID,
      secret: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_DEFAULT_REGION,
      bucket: process.env.AWS_BUCKET,
      // L'URL de base pour vos fichiers sur S3.
      url: `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_DEFAULT_REGION}.amazonaws.com`,
    },
  },
  /**
   * Chemins des sous-dossiers pour chaque type de fichier.
   * Cela permet de garder le dossier 'uploads' bien organisé.
   */
  paths: {
    logos: 'logos',
    produits: 'produits',
    documents: 'documents',
    avatars: 'avatars',
  },
};

// Vérification de la configuration en fonction du disque choisi
if (storageConfig.disk === 's3' && (!storageConfig.disks.s3.key || !storageConfig.disks.s3.secret || !storageConfig.disks.s3.bucket)) {
    console.warn("AVERTISSEMENT: Le disque de stockage est configuré sur 's3' mais les informations d'identification AWS sont manquantes. L'upload de fichiers échouera.");
}

module.exports = storageConfig;
