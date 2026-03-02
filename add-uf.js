const fs = require('fs');
const path = require('path');

// Mapeamento CORRETO de código IBGE (2 primeiros dígitos) para UF
const codigoToUF = {
  '11': 'RO', '12': 'AC', '13': 'AM', '14': 'RR', '15': 'PA', '16': 'AP', '17': 'TO',
  '21': 'MA', '22': 'PI', '23': 'CE', '24': 'RN', '25': 'PB', '26': 'PE', '27': 'AL', '28': 'SE', '29': 'BA',
  '31': 'MG', '32': 'ES', '33': 'RJ', '35': 'SP',
  '41': 'PR', '42': 'SC', '43': 'RS',
  '50': 'MS', '51': 'MT', '52': 'GO', '53': 'DF'
};

const municipioPath = path.join(__dirname, 'app/data/municipios.ts');

try {
  console.log('Lendo municipios.ts...');
  const fileContent = fs.readFileSync(municipioPath, 'utf8');
  
  // Parse dos dados (remove exports e parse JSON)
  const jsonStart = fileContent.indexOf('[');
  const jsonEnd = fileContent.lastIndexOf(']') + 1;
  const jsonString = fileContent.substring(jsonStart, jsonEnd);
  const municipios = JSON.parse(jsonString);

  console.log(`Processando ${municipios.length} municípios...`);

  // Adiciona UF a cada município
  const municipiosComUF = municipios.map(m => {
    const codigoPrefix = m.codigo.substring(0, 2);
    const uf = codigoToUF[codigoPrefix] || 'XX';
    return {
      ...m,
      uf
    };
  });

  // Cria o novo arquivo
  const novoConteudo = `export const listaMunicipios = ${JSON.stringify(municipiosComUF, null, 2)}\n`;
  
  fs.writeFileSync(municipioPath, novoConteudo, 'utf8');
  console.log('✓ Arquivo atualizado com sucesso!');
  console.log(`✓ Adicionado UF a ${municipiosComUF.length} municípios`);

} catch (err) {
  console.error('Erro:', err.message);
  process.exit(1);
}
