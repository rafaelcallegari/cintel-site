const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

// Nome exato do seu arquivo
const excelFile = 'municipios.xlsx'; 
const outputPath = path.join(__dirname, 'app/data/municipios.ts');

try {
    console.log('Lendo arquivo Excel...');
    
    const workbook = XLSX.readFile(excelFile);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Converte para JSON
    const data = XLSX.utils.sheet_to_json(worksheet);
    const result = data.map(item => ({
        // Usando os nomes exatos das colunas que identifiquei no seu arquivo
        nome: String(item['MUNICÍPIO - IBGE'] || '').trim(),
        codigo: String(item['CÓDIGO DO MUNICÍPIO - IBGE'] || '').trim()
    })).filter(item => item.nome && item.codigo);

    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const tsContent = `export const listaMunicipios = ${JSON.stringify(result, null, 2)};`;
    
    fs.writeFileSync(outputPath, tsContent);
    console.log(`✅ Sucesso! Foram processados ${result.length} municípios.`);

} catch (err) {
    console.error('❌ Erro:', err.message);
}