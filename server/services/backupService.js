const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const { formatDate } = require('../utils/formatters');
const { logger } = require('../middleware/logging'); // Importer notre logger

class BackupService {
  constructor() {
    this.backupDir = path.join(__dirname, '..', 'backups');
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
      logger.info(`Dossier de backups créé à l'emplacement : ${this.backupDir}`);
    }
  }

  /**
   * Exécute la commande mongodump pour sauvegarder la base de données.
   * @returns {Promise<string>} Le chemin du dossier de la sauvegarde.
   */
  async _runMongoDump() {
    return new Promise((resolve, reject) => {
      const dbUri = process.env.MONGO_URI;
      if (!dbUri) {
        const err = new Error('MONGO_URI n\'est pas défini dans les variables d\'environnement.');
        logger.error(err.message);
        return reject(err);
      }
      const dumpFolder = `dump_${formatDate(new Date(), 'YYYY-MM-DD_HH-mm-ss')}`;
      const outputPath = path.join(this.backupDir, dumpFolder);
      const command = `mongodump --uri="${dbUri}" --out="${outputPath}"`;
      logger.info('Démarrage de la sauvegarde de la base de données via mongodump...');
      exec(command, (error, stdout, stderr) => {
        if (error) {
          logger.error(`Erreur lors de l'exécution de mongodump: ${stderr}`, { command, error });
          return reject(error);
        }
        logger.info(`mongodump terminé avec succès. Sortie: ${stdout.trim()}`);
        resolve(outputPath);
      });
    });
  }

  /**
   * Compresse un dossier en une archive zip.
   * @param {string} sourceDir - Le dossier à compresser.
   * @param {string} outPath - Le chemin du fichier zip de sortie.
   * @returns {Promise<string>} Le chemin du fichier zip.
   */
  async _zipDirectory(sourceDir, outPath) {
    return new Promise((resolve, reject) => {
      const output = fs.createWriteStream(outPath);
      const archive = archiver('zip', { zlib: { level: 9 } });

      output.on('close', () => {
        logger.info(`Archive créée avec succès: ${outPath} (${archive.pointer()} total bytes)`);
        resolve(outPath);
      });

      archive.on('error', (err) => {
        logger.error(`Erreur lors de l'archivage du dossier ${sourceDir}`, { error: err });
        reject(err);
      });

      archive.pipe(output);
      archive.directory(sourceDir, false);
      archive.finalize();
    });
  }

  /**
   * Crée une sauvegarde complète de la base de données, la compresse,
   * puis nettoie les fichiers temporaires.
   * @returns {Promise<string>} Le chemin vers le fichier de sauvegarde final (.zip).
   */
  async createBackup() {
    logger.info('Lancement d\'un nouveau processus de sauvegarde complet.');
    let dumpPath = null;
    try {
      dumpPath = await this._runMongoDump();

      const zipFileName = `${path.basename(dumpPath)}.zip`;
      const zipPath = path.join(this.backupDir, zipFileName);
      await this._zipDirectory(dumpPath, zipPath);

      return zipPath;
    } catch (error) {
      logger.error(`Échec du processus de sauvegarde complet: ${error.message}`, { stack: error.stack });
      throw new Error('Le processus de sauvegarde a échoué.');
    } finally {
      if (dumpPath && fs.existsSync(dumpPath)) {
        fs.rm(dumpPath, { recursive: true, force: true }, (err) => {
          if (err) {
            logger.error(`Erreur lors du nettoyage du dossier de dump ${dumpPath}:`, { error: err });
          } else {
            logger.info(`Dossier de dump temporaire ${dumpPath} nettoyé.`);
          }
        });
      }
    }
  }

  /**
   * Liste les fichiers de sauvegarde disponibles.
   * @returns {Promise<Array<object>>}
   */
  async listBackups() {
    try {
        const files = await fs.promises.readdir(this.backupDir);
        return files
          .filter(file => file.endsWith('.zip'))
          .map(file => {
            const filePath = path.join(this.backupDir, file);
            const stats = fs.statSync(filePath);
            return {
              filename: file,
              size: stats.size,
              createdAt: stats.birthtime,
            };
          })
          .sort((a, b) => b.createdAt - a.createdAt);
    } catch (error) {
        logger.error('Impossible de lister les fichiers de sauvegarde.', { error });
        return []; // Retourne un tableau vide en cas d'erreur
    }
  }
}

module.exports = new BackupService();
