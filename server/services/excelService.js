const ExcelJS = require('exceljs');

class ExcelService {
  /**
   * Crée un fichier Excel en mémoire à partir de données JSON.
   *
   * @param {Array<object>} data - Un tableau d'objets JSON. Chaque objet est une ligne.
   * @param {Array<{header: string, key: string, width?: number, style?: object}>} columns - La configuration des colonnes.
   * @param {string} sheetName - Le nom de la feuille de calcul.
   * @returns {Promise<Buffer>} Le buffer du fichier Excel généré.
   */
  async createExcelBuffer(data, columns, sheetName = 'Export') {
    try {
      // 1. Créer un nouveau classeur et une feuille de calcul
      const workbook = new ExcelJS.Workbook();
      workbook.creator = 'ERP Commercial Senegal';
      workbook.lastModifiedBy = 'ERP Commercial Senegal';
      workbook.created = new Date();
      workbook.modified = new Date();
      const worksheet = workbook.addWorksheet(sheetName);

      // 2. Définir les colonnes et leurs en-têtes
      // La clé 'key' doit correspondre à la clé dans les objets de données.
      worksheet.columns = columns.map(col => ({
        header: col.header,
        key: col.key,
        width: col.width || 20, // Largeur par défaut
        style: col.style || {}   // Style par défaut (ex: { numFmt: '#,##0.00 "XOF"' })
      }));

      // 3. Ajouter les données
      worksheet.addRows(data);

      // 4. Styler la ligne d'en-tête
      worksheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF0D6EFD' } // Couleur primaire
        };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      });

      // 5. Ajouter des filtres automatiques sur l'en-tête
      worksheet.autoFilter = {
        from: {
          row: 1,
          column: 1
        },
        to: {
          row: 1,
          column: columns.length
        }
      };

      // 6. Générer le buffer du fichier Excel
      const buffer = await workbook.xlsx.writeBuffer();
      return buffer;
    } catch (error) {
      console.error('❌ Erreur lors de la création du fichier Excel :', error);
      throw new Error('Impossible de générer le fichier Excel.');
    }
  }
}

module.exports = new ExcelService();
