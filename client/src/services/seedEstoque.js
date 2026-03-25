import { gerarIdItem, criarItem } from './estoque'

const PECAS = [
  // Bronzinas
  { nome: 'Bronzina de Mancal STD', codigo: 'BRZ-MAN-STD', aliases: ['casquilho de mancal', 'bronzina central'], tipo: 'peca', subcategoria: 'Bronzinas', unidade: 'jg', localizacao: '', compatibilidade: [], descricao: 'Bronzina de mancal medida padrão' },
  { nome: 'Bronzina de Mancal 0,25', codigo: 'BRZ-MAN-025', aliases: ['casquilho de mancal 0,25'], tipo: 'peca', subcategoria: 'Bronzinas', unidade: 'jg', localizacao: '', compatibilidade: [], descricao: 'Bronzina de mancal 1ª medida' },
  { nome: 'Bronzina de Mancal 0,50', codigo: 'BRZ-MAN-050', aliases: ['casquilho de mancal 0,50'], tipo: 'peca', subcategoria: 'Bronzinas', unidade: 'jg', localizacao: '', compatibilidade: [], descricao: 'Bronzina de mancal 2ª medida' },
  { nome: 'Bronzina de Biela STD', codigo: 'BRZ-BIE-STD', aliases: ['casquilho de biela', 'bronzina biela padrão'], tipo: 'peca', subcategoria: 'Bronzinas', unidade: 'jg', localizacao: '', compatibilidade: [], descricao: 'Bronzina de biela medida padrão' },
  { nome: 'Bronzina de Biela 0,25', codigo: 'BRZ-BIE-025', aliases: ['casquilho de biela 0,25'], tipo: 'peca', subcategoria: 'Bronzinas', unidade: 'jg', localizacao: '', compatibilidade: [], descricao: 'Bronzina de biela 1ª medida' },
  { nome: 'Bronzina de Biela 0,50', codigo: 'BRZ-BIE-050', aliases: ['casquilho de biela 0,50'], tipo: 'peca', subcategoria: 'Bronzinas', unidade: 'jg', localizacao: '', compatibilidade: [], descricao: 'Bronzina de biela 2ª medida' },
  { nome: 'Bronzina de Encosto STD', codigo: 'BRZ-ENC-STD', aliases: ['encosto do virabrequim', 'arruela de encosto'], tipo: 'peca', subcategoria: 'Bronzinas', unidade: 'jg', localizacao: '', compatibilidade: [], descricao: 'Bronzina de encosto (axial) medida padrão' },

  // Pistões e Anéis
  { nome: 'Pistão STD', codigo: 'PIS-STD', aliases: ['êmbolo', 'pistão padrão'], tipo: 'peca', subcategoria: 'Pistões', unidade: 'jg', localizacao: '', compatibilidade: [], descricao: 'Pistão medida padrão' },
  { nome: 'Pistão 0,50', codigo: 'PIS-050', aliases: ['êmbolo 0,50', 'pistão 2ª medida'], tipo: 'peca', subcategoria: 'Pistões', unidade: 'jg', localizacao: '', compatibilidade: [], descricao: 'Pistão 2ª medida (0,50mm)' },
  { nome: 'Pistão 1,00', codigo: 'PIS-100', aliases: ['êmbolo 1,00', 'pistão 4ª medida'], tipo: 'peca', subcategoria: 'Pistões', unidade: 'jg', localizacao: '', compatibilidade: [], descricao: 'Pistão 4ª medida (1,00mm)' },
  { nome: 'Jogo de Anéis STD', codigo: 'ANE-STD', aliases: ['anéis de segmento', 'anel de pistão'], tipo: 'peca', subcategoria: 'Anéis', unidade: 'jg', localizacao: '', compatibilidade: [], descricao: 'Jogo de anéis medida padrão (compressão + óleo)' },
  { nome: 'Jogo de Anéis 0,50', codigo: 'ANE-050', aliases: ['anéis de segmento 0,50'], tipo: 'peca', subcategoria: 'Anéis', unidade: 'jg', localizacao: '', compatibilidade: [], descricao: 'Jogo de anéis 2ª medida' },
  { nome: 'Jogo de Anéis 1,00', codigo: 'ANE-100', aliases: ['anéis de segmento 1,00'], tipo: 'peca', subcategoria: 'Anéis', unidade: 'jg', localizacao: '', compatibilidade: [], descricao: 'Jogo de anéis 4ª medida' },
  { nome: 'Pino do Pistão', codigo: 'PIN-PIS', aliases: ['pino de pistão', 'pino do êmbolo'], tipo: 'peca', subcategoria: 'Pistões', unidade: 'un', localizacao: '', compatibilidade: [], descricao: 'Pino de ligação pistão-biela' },
  { nome: 'Trava do Pino', codigo: 'TRV-PIN', aliases: ['trava do pino do pistão', 'anel trava'], tipo: 'peca', subcategoria: 'Pistões', unidade: 'un', localizacao: '', compatibilidade: [], descricao: 'Trava de segurança do pino do pistão' },

  // Juntas
  { nome: 'Junta do Cabeçote', codigo: 'JNT-CAB', aliases: ['junta de cabeça', 'junta do cabeça'], tipo: 'peca', subcategoria: 'Juntas', unidade: 'un', localizacao: '', compatibilidade: [], descricao: 'Junta entre bloco e cabeçote' },
  { nome: 'Jogo de Juntas Completo', codigo: 'JNT-COMP', aliases: ['kit de juntas', 'jogo de juntas do motor'], tipo: 'peca', subcategoria: 'Juntas', unidade: 'jg', localizacao: '', compatibilidade: [], descricao: 'Jogo completo de juntas para retífica' },
  { nome: 'Junta do Cárter', codigo: 'JNT-CAR', aliases: ['junta do carter', 'junta inferior'], tipo: 'peca', subcategoria: 'Juntas', unidade: 'un', localizacao: '', compatibilidade: [], descricao: 'Junta de vedação do cárter' },
  { nome: 'Junta da Tampa de Válvulas', codigo: 'JNT-TVA', aliases: ['junta tampa do comando', 'junta da tampa'], tipo: 'peca', subcategoria: 'Juntas', unidade: 'un', localizacao: '', compatibilidade: [], descricao: 'Junta de vedação da tampa de válvulas' },
  { nome: 'Junta do Coletor de Admissão', codigo: 'JNT-ADM', aliases: ['junta do coletor intake'], tipo: 'peca', subcategoria: 'Juntas', unidade: 'un', localizacao: '', compatibilidade: [], descricao: '' },
  { nome: 'Junta do Coletor de Escape', codigo: 'JNT-ESC', aliases: ['junta do escapamento'], tipo: 'peca', subcategoria: 'Juntas', unidade: 'un', localizacao: '', compatibilidade: [], descricao: '' },

  // Retentores
  { nome: 'Retentor Dianteiro do Virabrequim', codigo: 'RET-DIA', aliases: ['retentor frontal', 'retentor da frente'], tipo: 'peca', subcategoria: 'Retentores', unidade: 'un', localizacao: '', compatibilidade: [], descricao: '' },
  { nome: 'Retentor Traseiro do Virabrequim', codigo: 'RET-TRA', aliases: ['retentor de trás', 'retentor posterior'], tipo: 'peca', subcategoria: 'Retentores', unidade: 'un', localizacao: '', compatibilidade: [], descricao: '' },
  { nome: 'Retentor de Válvula', codigo: 'RET-VAL', aliases: ['retentor de haste', 'selo de válvula', 'retentor de haste de válvula'], tipo: 'peca', subcategoria: 'Retentores', unidade: 'un', localizacao: '', compatibilidade: [], descricao: 'Retentor da haste da válvula' },
  { nome: 'Jogo de Retentores', codigo: 'RET-JG', aliases: ['kit de retentores'], tipo: 'peca', subcategoria: 'Retentores', unidade: 'jg', localizacao: '', compatibilidade: [], descricao: 'Jogo completo de retentores do motor' },

  // Válvulas e Comando
  { nome: 'Válvula de Admissão', codigo: 'VLV-ADM', aliases: ['válvula intake', 'válvula de entrada'], tipo: 'peca', subcategoria: 'Válvulas', unidade: 'un', localizacao: '', compatibilidade: [], descricao: '' },
  { nome: 'Válvula de Escape', codigo: 'VLV-ESC', aliases: ['válvula exhaust', 'válvula de saída'], tipo: 'peca', subcategoria: 'Válvulas', unidade: 'un', localizacao: '', compatibilidade: [], descricao: '' },
  { nome: 'Mola de Válvula', codigo: 'MOL-VAL', aliases: ['mola do comando'], tipo: 'peca', subcategoria: 'Válvulas', unidade: 'un', localizacao: '', compatibilidade: [], descricao: '' },
  { nome: 'Guia de Válvula', codigo: 'GUI-VAL', aliases: ['bucha guia de válvula', 'guia da válvula'], tipo: 'peca', subcategoria: 'Válvulas', unidade: 'un', localizacao: '', compatibilidade: [], descricao: '' },
  { nome: 'Sede de Válvula', codigo: 'SED-VAL', aliases: ['inserto de válvula', 'sede da válvula'], tipo: 'peca', subcategoria: 'Válvulas', unidade: 'un', localizacao: '', compatibilidade: [], descricao: '' },
  { nome: 'Tucho', codigo: 'TUC', aliases: ['tucho hidráulico', 'tucho mecânico', 'tuchos'], tipo: 'peca', subcategoria: 'Válvulas', unidade: 'un', localizacao: '', compatibilidade: [], descricao: '' },
  { nome: 'Balancim', codigo: 'BAL', aliases: ['balancin', 'rocker arm'], tipo: 'peca', subcategoria: 'Válvulas', unidade: 'un', localizacao: '', compatibilidade: [], descricao: '' },
  { nome: 'Bucha do Comando de Válvulas', codigo: 'BUC-CMD', aliases: ['bucha do comando', 'bucha do eixo comando'], tipo: 'peca', subcategoria: 'Válvulas', unidade: 'un', localizacao: '', compatibilidade: [], descricao: '' },

  // Correia / Corrente de Distribuição
  { nome: 'Kit Correia Dentada', codigo: 'COR-DEN', aliases: ['correia de distribuição', 'correia sincronizadora', 'kit distribuição'], tipo: 'peca', subcategoria: 'Distribuição', unidade: 'jg', localizacao: '', compatibilidade: [], descricao: 'Kit com correia, tensionador e rolamentos' },
  { nome: 'Corrente de Distribuição', codigo: 'COR-DIST', aliases: ['corrente do comando', 'corrente de sincronismo'], tipo: 'peca', subcategoria: 'Distribuição', unidade: 'un', localizacao: '', compatibilidade: [], descricao: '' },
  { nome: 'Tensor da Correia', codigo: 'TEN-COR', aliases: ['tensionador', 'esticador da correia'], tipo: 'peca', subcategoria: 'Distribuição', unidade: 'un', localizacao: '', compatibilidade: [], descricao: '' },
  { nome: 'Engrenagem do Comando', codigo: 'ENG-CMD', aliases: ['polia do comando', 'engrenagem de distribuição'], tipo: 'peca', subcategoria: 'Distribuição', unidade: 'un', localizacao: '', compatibilidade: [], descricao: '' },

  // Bombas
  { nome: 'Bomba de Óleo', codigo: 'BMB-OLE', aliases: ['bomba de lubrificação', 'bomba óleo motor'], tipo: 'peca', subcategoria: 'Bombas', unidade: 'un', localizacao: '', compatibilidade: [], descricao: '' },
  { nome: 'Bomba de Água', codigo: 'BMB-AGU', aliases: ['bomba d\'água', 'bomba do sistema de arrefecimento'], tipo: 'peca', subcategoria: 'Bombas', unidade: 'un', localizacao: '', compatibilidade: [], descricao: '' },

  // Cabeçote
  { nome: 'Camisa de Cilindro', codigo: 'CAM-CIL', aliases: ['camisa seca', 'camisa molhada', 'liner', 'luva de cilindro'], tipo: 'peca', subcategoria: 'Bloco/Cilindro', unidade: 'un', localizacao: '', compatibilidade: [], descricao: 'Camisa para encamisamento de cilindro' },
  { nome: 'Prisioneiro do Cabeçote', codigo: 'PRI-CAB', aliases: ['parafuso do cabeçote', 'estojos do cabeçote'], tipo: 'peca', subcategoria: 'Fixação', unidade: 'un', localizacao: '', compatibilidade: [], descricao: '' },
  { nome: 'Parafuso de Biela', codigo: 'PAR-BIE', aliases: ['parafuso da biela'], tipo: 'peca', subcategoria: 'Fixação', unidade: 'un', localizacao: '', compatibilidade: [], descricao: '' },

  // Consumíveis
  { nome: 'Óleo de Motor 15W40', codigo: 'OLE-15W40', aliases: ['óleo lubrificante', 'óleo diesel'], tipo: 'peca', subcategoria: 'Lubrificantes', unidade: 'l', localizacao: '', compatibilidade: [], descricao: 'Óleo lubrificante mineral/semissintético' },
  { nome: 'Óleo de Motor 5W30', codigo: 'OLE-5W30', aliases: ['óleo sintético'], tipo: 'peca', subcategoria: 'Lubrificantes', unidade: 'l', localizacao: '', compatibilidade: [], descricao: 'Óleo lubrificante sintético' },
  { nome: 'Fluido de Arrefecimento', codigo: 'FLU-ARR', aliases: ['aditivo de radiador', 'coolant', 'líquido de arrefecimento'], tipo: 'peca', subcategoria: 'Lubrificantes', unidade: 'l', localizacao: '', compatibilidade: [], descricao: '' },
  { nome: 'Adesivo de Junta', codigo: 'ADE-JNT', aliases: ['silicone de junta', 'three bond', '3bond', 'loctite'], tipo: 'peca', subcategoria: 'Químicos', unidade: 'un', localizacao: '', compatibilidade: [], descricao: 'Adesivo/vedador para juntas' },
  { nome: 'Trava Química (Loctite)', codigo: 'TRV-QUI', aliases: ['loctite', 'trava rosca', 'trava parafuso'], tipo: 'peca', subcategoria: 'Químicos', unidade: 'un', localizacao: '', compatibilidade: [], descricao: '' },
  { nome: 'Pasta de Montagem', codigo: 'PAS-MON', aliases: ['assembly lube', 'pasta de esmerilhar', 'massa de montagem'], tipo: 'peca', subcategoria: 'Químicos', unidade: 'un', localizacao: '', compatibilidade: [], descricao: 'Pasta para montagem de componentes internos' },
  { nome: 'Desengraxante', codigo: 'DES-GRX', aliases: ['solvente', 'limpa peças'], tipo: 'peca', subcategoria: 'Químicos', unidade: 'l', localizacao: '', compatibilidade: [], descricao: '' },

  // Filtros
  { nome: 'Filtro de Óleo', codigo: 'FIL-OLE', aliases: ['filtro lubrificante'], tipo: 'peca', subcategoria: 'Filtros', unidade: 'un', localizacao: '', compatibilidade: [], descricao: '' },
  { nome: 'Filtro de Combustível', codigo: 'FIL-COMB', aliases: ['filtro diesel', 'filtro de diesel'], tipo: 'peca', subcategoria: 'Filtros', unidade: 'un', localizacao: '', compatibilidade: [], descricao: '' },
  { nome: 'Filtro de Ar', codigo: 'FIL-AR', aliases: ['elemento do filtro de ar'], tipo: 'peca', subcategoria: 'Filtros', unidade: 'un', localizacao: '', compatibilidade: [], descricao: '' },
]

const FERRAMENTAS = [
  // Medição e Precisão
  { nome: 'Micrômetro Externo 0-25mm', codigo: 'FER-MIC-025', aliases: ['micrômetro', 'palmer'], tipo: 'ferramenta', subcategoria: 'Medição', unidade: 'un', descricao: 'Micrômetro externo para medir eixos e peças' },
  { nome: 'Micrômetro Externo 25-50mm', codigo: 'FER-MIC-050', aliases: ['micrômetro 25-50'], tipo: 'ferramenta', subcategoria: 'Medição', unidade: 'un', descricao: '' },
  { nome: 'Micrômetro Externo 50-75mm', codigo: 'FER-MIC-075', aliases: ['micrômetro 50-75'], tipo: 'ferramenta', subcategoria: 'Medição', unidade: 'un', descricao: '' },
  { nome: 'Micrômetro Externo 75-100mm', codigo: 'FER-MIC-100', aliases: ['micrômetro 75-100'], tipo: 'ferramenta', subcategoria: 'Medição', unidade: 'un', descricao: '' },
  { nome: 'Micrômetro Interno (Súbito)', codigo: 'FER-SUB', aliases: ['súbito', 'comparador interno', 'alexômetro'], tipo: 'ferramenta', subcategoria: 'Medição', unidade: 'un', descricao: 'Para medir diâmetro interno de cilindros' },
  { nome: 'Paquímetro Digital 150mm', codigo: 'FER-PAQ-150', aliases: ['paquímetro', 'calibre'], tipo: 'ferramenta', subcategoria: 'Medição', unidade: 'un', descricao: '' },
  { nome: 'Paquímetro Digital 300mm', codigo: 'FER-PAQ-300', aliases: ['paquímetro grande'], tipo: 'ferramenta', subcategoria: 'Medição', unidade: 'un', descricao: '' },
  { nome: 'Relógio Comparador', codigo: 'FER-REL', aliases: ['comparador', 'relógio apalpador'], tipo: 'ferramenta', subcategoria: 'Medição', unidade: 'un', descricao: 'Para verificar empenamento e batimento' },
  { nome: 'Base Magnética', codigo: 'FER-BASE', aliases: ['base do relógio comparador', 'base magnética do relógio'], tipo: 'ferramenta', subcategoria: 'Medição', unidade: 'un', descricao: '' },
  { nome: 'Calibre de Lâminas (Folga)', codigo: 'FER-CAL', aliases: ['calibrador de folga', 'lâminas de folga', 'calibre de folga'], tipo: 'ferramenta', subcategoria: 'Medição', unidade: 'jg', descricao: 'Para medir folga de válvulas, anéis, etc.' },
  { nome: 'Régua de Desempeno', codigo: 'FER-REG', aliases: ['régua de planicidade', 'régua técnica'], tipo: 'ferramenta', subcategoria: 'Medição', unidade: 'un', descricao: 'Para verificar planicidade de cabeçote e bloco' },
  { nome: 'Escala Graduada (Régua)', codigo: 'FER-ESC', aliases: ['régua metálica', 'escala'], tipo: 'ferramenta', subcategoria: 'Medição', unidade: 'un', descricao: '' },
  { nome: 'Plastigage', codigo: 'FER-PLA', aliases: ['medidor de folga plastigage'], tipo: 'ferramenta', subcategoria: 'Medição', unidade: 'un', descricao: 'Para medir folga de mancais' },

  // Torque
  { nome: 'Torquímetro de Estalo 10-100 Nm', codigo: 'FER-TRQ-100', aliases: ['torquímetro pequeno'], tipo: 'ferramenta', subcategoria: 'Torque', unidade: 'un', descricao: '' },
  { nome: 'Torquímetro de Estalo 40-200 Nm', codigo: 'FER-TRQ-200', aliases: ['torquímetro médio'], tipo: 'ferramenta', subcategoria: 'Torque', unidade: 'un', descricao: '' },
  { nome: 'Torquímetro de Estalo 100-500 Nm', codigo: 'FER-TRQ-500', aliases: ['torquímetro grande', 'torquímetro pesado'], tipo: 'ferramenta', subcategoria: 'Torque', unidade: 'un', descricao: 'Para parafusos de cabeçote e biela' },
  { nome: 'Torquímetro Angular', codigo: 'FER-TRQ-ANG', aliases: ['goniômetro', 'medidor de ângulo de torque'], tipo: 'ferramenta', subcategoria: 'Torque', unidade: 'un', descricao: '' },

  // Retífica e Usinagem
  { nome: 'Brunidor de Cilindro', codigo: 'FER-BRU', aliases: ['hone', 'brunidora'], tipo: 'ferramenta', subcategoria: 'Usinagem', unidade: 'un', descricao: 'Para brunimento de cilindros após retífica' },
  { nome: 'Pedra de Brunir', codigo: 'FER-PDB', aliases: ['régua abrasiva', 'pedra do brunidor'], tipo: 'ferramenta', subcategoria: 'Usinagem', unidade: 'jg', descricao: '' },
  { nome: 'Chupeta de Esmerilhar Válvula', codigo: 'FER-CHU', aliases: ['ventosa esmerilhar', 'chupeta de válvula'], tipo: 'ferramenta', subcategoria: 'Usinagem', unidade: 'un', descricao: '' },
  { nome: 'Escariador de Sede de Válvula', codigo: 'FER-ESK', aliases: ['fresa de sede', 'cortador de sede'], tipo: 'ferramenta', subcategoria: 'Usinagem', unidade: 'jg', descricao: '' },
  { nome: 'Alargador de Guia de Válvula', codigo: 'FER-ALR', aliases: ['alargador guia'], tipo: 'ferramenta', subcategoria: 'Usinagem', unidade: 'jg', descricao: '' },

  // Manuais
  { nome: 'Jogo de Chaves Combinadas', codigo: 'FER-CHV-COMB', aliases: ['chaves de boca e estrela', 'chaves combinadas'], tipo: 'ferramenta', subcategoria: 'Manual', unidade: 'jg', descricao: '' },
  { nome: 'Jogo de Soquetes', codigo: 'FER-SOQ', aliases: ['jogo de catraca', 'soquetes'], tipo: 'ferramenta', subcategoria: 'Manual', unidade: 'jg', descricao: '' },
  { nome: 'Jogo de Chaves Allen', codigo: 'FER-ALL', aliases: ['chaves hexagonais', 'allen'], tipo: 'ferramenta', subcategoria: 'Manual', unidade: 'jg', descricao: '' },
  { nome: 'Jogo de Chaves Torx', codigo: 'FER-TRX', aliases: ['torx', 'chaves estrela 6 pontas'], tipo: 'ferramenta', subcategoria: 'Manual', unidade: 'jg', descricao: '' },
  { nome: 'Extrator de Rolamento', codigo: 'FER-EXT-ROL', aliases: ['sacador de rolamento', 'saca polia'], tipo: 'ferramenta', subcategoria: 'Extratores', unidade: 'un', descricao: '' },
  { nome: 'Compressor de Molas de Válvula', codigo: 'FER-COMP-MOL', aliases: ['prensa mola', 'compressor de mola'], tipo: 'ferramenta', subcategoria: 'Especial', unidade: 'un', descricao: 'Para remoção e instalação de molas de válvulas' },
  { nome: 'Compressor de Anéis', codigo: 'FER-COMP-ANE', aliases: ['cinta de anéis', 'prensa anéis'], tipo: 'ferramenta', subcategoria: 'Especial', unidade: 'un', descricao: 'Para compressão de anéis na montagem do pistão' },
  { nome: 'Martelo de Borracha', codigo: 'FER-MAR-BOR', aliases: ['martelo de nylon', 'macete'], tipo: 'ferramenta', subcategoria: 'Manual', unidade: 'un', descricao: '' },
  { nome: 'Martelo de Bola', codigo: 'FER-MAR-BOL', aliases: ['martelo mecânico'], tipo: 'ferramenta', subcategoria: 'Manual', unidade: 'un', descricao: '' },
  { nome: 'Chave de Impacto Pneumática', codigo: 'FER-IMP', aliases: ['parafusadeira de impacto', 'pistola pneumática'], tipo: 'ferramenta', subcategoria: 'Pneumática', unidade: 'un', descricao: '' },
]

const EPIS = [
  { nome: 'Óculos de Proteção', codigo: 'EPI-OCU', aliases: ['óculos de segurança', 'óculos transparente'], tipo: 'epi', subcategoria: 'Proteção Visual', unidade: 'un', descricao: 'Proteção contra partículas e respingos' },
  { nome: 'Óculos de Proteção Escuro', codigo: 'EPI-OCU-ESC', aliases: ['óculos fumê', 'óculos escuro'], tipo: 'epi', subcategoria: 'Proteção Visual', unidade: 'un', descricao: '' },
  { nome: 'Protetor Auricular Plug', codigo: 'EPI-AUR-P', aliases: ['tampão de ouvido', 'protetor de ouvido plug'], tipo: 'epi', subcategoria: 'Proteção Auditiva', unidade: 'par', descricao: '' },
  { nome: 'Protetor Auricular Concha', codigo: 'EPI-AUR-C', aliases: ['abafador de ruído', 'protetor tipo concha'], tipo: 'epi', subcategoria: 'Proteção Auditiva', unidade: 'un', descricao: '' },
  { nome: 'Luva de Vaqueta', codigo: 'EPI-LUV-VAQ', aliases: ['luva de couro', 'luva de raspa'], tipo: 'epi', subcategoria: 'Luvas', unidade: 'par', descricao: 'Para manuseio de peças pesadas' },
  { nome: 'Luva Nitrílica', codigo: 'EPI-LUV-NIT', aliases: ['luva de nitrilo', 'luva descartável', 'luva azul'], tipo: 'epi', subcategoria: 'Luvas', unidade: 'par', descricao: 'Para manuseio de produtos químicos' },
  { nome: 'Luva de Procedimento', codigo: 'EPI-LUV-PRO', aliases: ['luva látex', 'luva cirúrgica'], tipo: 'epi', subcategoria: 'Luvas', unidade: 'cx', descricao: 'Caixa com 100 unidades' },
  { nome: 'Luva Anticorte', codigo: 'EPI-LUV-COR', aliases: ['luva de malha de aço', 'luva anti corte'], tipo: 'epi', subcategoria: 'Luvas', unidade: 'par', descricao: '' },
  { nome: 'Botina de Segurança', codigo: 'EPI-BOT', aliases: ['sapato de segurança', 'botina biqueira de aço', 'bota de segurança'], tipo: 'epi', subcategoria: 'Calçados', unidade: 'par', descricao: 'Com biqueira de aço/composite' },
  { nome: 'Avental de Raspa', codigo: 'EPI-AVE', aliases: ['avental de couro', 'avental de proteção'], tipo: 'epi', subcategoria: 'Proteção Corporal', unidade: 'un', descricao: 'Para trabalhos com esmeril e solda' },
  { nome: 'Máscara Respiradora PFF2', codigo: 'EPI-MAS-PFF2', aliases: ['máscara de poeira', 'respirador PFF2', 'máscara descartável'], tipo: 'epi', subcategoria: 'Proteção Respiratória', unidade: 'un', descricao: '' },
  { nome: 'Máscara com Filtro Químico', codigo: 'EPI-MAS-QUI', aliases: ['respirador com cartucho', 'máscara de gases'], tipo: 'epi', subcategoria: 'Proteção Respiratória', unidade: 'un', descricao: 'Para trabalho com solventes e desengraxantes' },
  { nome: 'Protetor Facial (Face Shield)', codigo: 'EPI-FAC', aliases: ['face shield', 'viseira de proteção', 'protetor de face'], tipo: 'epi', subcategoria: 'Proteção Visual', unidade: 'un', descricao: '' },
  { nome: 'Uniforme / Macacão', codigo: 'EPI-MAC', aliases: ['macacão de trabalho', 'uniforme oficina', 'jaleco'], tipo: 'epi', subcategoria: 'Vestimenta', unidade: 'un', descricao: '' },
  { nome: 'Creme de Proteção (Luva Química)', codigo: 'EPI-CRM', aliases: ['creme protetor', 'luva química', 'creme barreira'], tipo: 'epi', subcategoria: 'Proteção Cutânea', unidade: 'un', descricao: 'Proteção para mãos contra produtos químicos' },
]

export async function popularEstoqueInicial() {
  const todos = [...PECAS, ...FERRAMENTAS, ...EPIS]
  let criados = 0

  for (const item of todos) {
    try {
      const id = gerarIdItem()
      await criarItem(id, {
        ...item,
        quantidade: 0,
        quantidadeDisponivel: 0,
        estoqueMinimo: 0,
        custoUnitario: 0,
        localizacao: item.localizacao || '',
        fornecedorNome: '',
        fornecedorContato: '',
        compatibilidade: item.compatibilidade || [],
        foto: null
      })
      criados++
    } catch (e) {
      console.error(`Erro ao criar item "${item.nome}":`, e)
    }
  }

  return { criados, total: todos.length }
}

export const TOTAL_ITENS_SEED = PECAS.length + FERRAMENTAS.length + EPIS.length
