// ============================================================
// produtos-data.js — LISTA DE TODOS OS PRODUTOS DA LOJA
// Para adicionar um produto novo: copie um bloco { ... } e cole
// no final, antes do último ]
// ============================================================

const produtos = [
    // ==================== PÁGINA INICIAL (IDs 1-6) ====================

    {
        id: 1,
        nome: "Caixa De Incêndio 90x60x17",
        categoria: "Incêndio",
        imagem: "https://http2.mlstatic.com/D_NQ_NP_2X_879932-MLA106371853322_022026-F.webp",
        rating: "★★★★★",
        avaliacoes: 124,
        preco: 297.90,
        precoOriginal: 349.90,
        desconto: "-15%",
        pix: 282.99,
        parcelas: "6x de R$ 49,65",
        descricao: "Caixa de incêndio em aço carbono com pintura epóxi, visor em vidro e registro globo angular. Ideal para condomínios e empresas.",
        especificacoes: {
            "Material": "Aço carbono com pintura epóxi",
            "Altura": "90 cm",
            "Largura": "60 cm",
            "Profundidade": "17 cm",
            "Norma": "NBR 13714",
            "Garantia": "12 meses"
        },
        reviews: [
            { nome: "Carlos M.", estrelas: "★★★★★", data: "12/08/2026", texto: "Excelente, chegou rápido e com nota fiscal. Passou na vistoria sem problemas." },
            { nome: "Síndico Paulo", estrelas: "★★★★☆", data: "28/06/2026", texto: "Boa qualidade, acabamento muito bom. Recomendo." }
        ]
    },

    {
        id: 2,
        nome: "Torneira Esfera 3/4 Saída 1",
        categoria: "Torneiras",
        imagem: "https://http2.mlstatic.com/D_NQ_NP_2X_672010-MLA107177072813_022026-F.webp",
        rating: "★★★★★",
        avaliacoes: 203,
        preco: 80.00,
        precoOriginal: 99.90,
        desconto: "-20%",
        pix: 76.00,
        parcelas: "3x de R$ 26,67",
        descricao: "Torneira esfera de latão com saída de 1 polegada. Acabamento cromado, ideal para jardins e áreas de serviço.",
        especificacoes: {
            "Material": "Latão cromado",
            "Entrada": "3/4 polegada",
            "Saída": "1 polegada",
            "Tipo": "Esfera (1/4 de volta)",
            "Garantia": "6 meses"
        },
        reviews: [
            { nome: "Maria F.", estrelas: "★★★★★", data: "15/07/2026", texto: "Muito resistente, já comprei 3 para a obra." }
        ]
    },

    {
        id: 3,
        nome: "Kit Parafuso New-Fix 14x2",
        categoria: "Parafusos",
        imagem: "https://http2.mlstatic.com/D_NQ_NP_2X_975578-MLA105792573772_022026-F.webp",
        rating: "★★★★☆",
        avaliacoes: 89,
        preco: 149.90,
        precoOriginal: 199.90,
        desconto: "-30%",
        pix: 142.40,
        parcelas: "5x de R$ 29,98",
        descricao: "Kit com 100 parafusos New-Fix 14x2 para fixação em drywall e alvenaria. Acompanha buchas.",
        especificacoes: {
            "Quantidade": "100 unidades",
            "Medida": "14x2",
            "Material": "Aço zincado",
            "Inclui": "Buchas compatíveis",
            "Garantia": "3 meses"
        },
        reviews: [
            { nome: "Pedro A.", estrelas: "★★★★☆", data: "02/05/2026", texto: "Bom custo-benefício, parafusos firmes." }
        ]
    },

    {
        id: 4,
        nome: "Mangueira De Hidrante 1 1/2 15m Tipo 2",
        categoria: "Incêndio",
        imagem: "https://http2.mlstatic.com/D_NQ_NP_2X_667107-MLB54720710066_032023-F.webp",
        rating: "★★★★★",
        avaliacoes: 317,
        preco: 441.20,
        precoOriginal: 520.00,
        desconto: "-15%",
        pix: 419.14,
        parcelas: "12x de R$ 36,77",
        descricao: "Mangueira de incêndio reforçada para hidrante, conforme norma NBR 11861. Ideal para condomínios e indústrias.",
        especificacoes: {
            "Comprimento": "15 metros",
            "Diâmetro": "1 1/2 polegada (38mm)",
            "Tipo": "Tipo 2 (reforçada)",
            "Norma": "NBR 11861",
            "Pressão": "14 kgf/cm²",
            "Garantia": "12 meses"
        },
        reviews: [
            { nome: "Eng. Silva", estrelas: "★★★★★", data: "20/08/2026", texto: "Atende a norma, qualidade excelente. Já comprei 10 unidades." },
            { nome: "Fernanda R.", estrelas: "★★★★★", data: "03/07/2026", texto: "Material resistente, o suporte me ajudou a escolher a bitola certa." }
        ]
    },

    {
        id: 5,
        nome: "Niple Metal Cromado 1/2 1/2",
        categoria: "Conexões",
        imagem: "https://http2.mlstatic.com/D_NQ_NP_2X_870577-MLA103220245710_012026-F-niple-metal-cromado-12-12.webp",
        rating: "★★★★☆",
        avaliacoes: 38,
        preco: 12.90,
        precoOriginal: 15.90,
        desconto: "-19%",
        pix: 12.25,
        parcelas: "1x de R$ 12,90",
        descricao: "Niple em metal cromado 1/2 x 1/2, ideal para conexões hidráulicas e acabamentos.",
        especificacoes: {
            "Material": "Metal cromado",
            "Bitola": "1/2 x 1/2 polegada",
            "Garantia": "3 meses"
        },
        reviews: [
            { nome: "Cliente", estrelas: "★★★★☆", data: "10/09/2026", texto: "Boa qualidade, acabamento bonito." }
        ]
    },

    {
        id: 6,
        nome: "Adaptador Junção Y Mesa/bancada Torneira Filtro 1/2 Metal",
        categoria: "Adaptadores",
        imagem: "https://http2.mlstatic.com/D_NQ_NP_2X_648560-MLB112544222308_062026-F.webp",
        rating: "★★★★★",
        avaliacoes: 52,
        preco: 29.90,
        precoOriginal: 39.90,
        desconto: "-25%",
        pix: 28.40,
        parcelas: "2x de R$ 14,95",
        descricao: "Adaptador em Y de metal 1/2 para torneira e filtro, ideal para mesa e bancada de cozinha.",
        especificacoes: {
            "Material": "Metal",
            "Bitola": "1/2 polegada",
            "Tipo": "Junção Y",
            "Uso": "Mesa/bancada, torneira e filtro",
            "Garantia": "6 meses"
        },
        reviews: [
            { nome: "Cliente", estrelas: "★★★★★", data: "22/08/2026", texto: "Funcionou perfeitamente no filtro da cozinha." }
        ]
    },

    // ==================== PRODUTOS.HTML (IDs 7-30) ====================

    {
        id: 7,
        nome: "Botoeira De Alarme De Bomba",
        categoria: "Incêndio",
        imagem: "https://http2.mlstatic.com/D_NQ_NP_2X_873852-MLA105487889350_012026-F-botoeira-de-alarme-de-bomba-com-martelo.webp",
        rating: "★★★★★",
        avaliacoes: 129,
        preco: 50.90,
        precoOriginal: null,
        desconto: "",
        pix: 48.36,
        parcelas: "3x de R$ 16,97",
        descricao: "Botoeira de alarme de bomba para sistemas de combate a incêndio. Acionamento rápido e confiável.",
        especificacoes: {
            "Tipo": "Botoeira de alarme",
            "Uso": "Sistemas de incêndio",
            "Garantia": "12 meses"
        },
        reviews: [
            { nome: "Cliente", estrelas: "★★★★★", data: "05/08/2026", texto: "Produto de ótima qualidade, chegou rápido." }
        ]
    },

    {
        id: 8,
        nome: "Kit Botoeira De Bomba E Alarme",
        categoria: "Incêndio",
        imagem: "https://http2.mlstatic.com/D_NQ_NP_2X_709757-MLB116506506290_092026-F-kit-botoeira-bomba-e-alarme-vision-fire.webp",
        rating: "★★★★☆",
        avaliacoes: 129,
        preco: 114.90,
        precoOriginal: 140.90,
        desconto: "-30%",
        pix: 109.16,
        parcelas: "6x de R$ 19,15",
        descricao: "Kit completo com botoeira de bomba e alarme para sistemas de proteção contra incêndio.",
        especificacoes: {
            "Inclui": "Botoeira + alarme",
            "Uso": "Sistemas de incêndio",
            "Garantia": "12 meses"
        },
        reviews: [
            { nome: "Cliente", estrelas: "★★★★☆", data: "18/07/2026", texto: "Bom custo-benefício, fácil de instalar." }
        ]
    },

    {
        id: 9,
        nome: "Válvula Tanque Arr/zamac Leve",
        categoria: "Adaptadores",
        imagem: "https://http2.mlstatic.com/D_NQ_NP_2X_605400-MLA106720594962_022026-F-valvula-tanque-arrzamac-leve.webp",
        rating: "★★★★★",
        avaliacoes: 101,
        preco: 24.90,
        precoOriginal: 38.90,
        desconto: "-30%",
        pix: 23.66,
        parcelas: "2x de R$ 12,45",
        descricao: "Válvula de tanque em zamac, leve e resistente, ideal para caixas acopladas.",
        especificacoes: {
            "Material": "Zamac",
            "Tipo": "Válvula de tanque",
            "Garantia": "6 meses"
        },
        reviews: [
            { nome: "Cliente", estrelas: "★★★★★", data: "30/06/2026", texto: "Funcionou perfeitamente na caixa acoplada." }
        ]
    },

    {
        id: 10,
        nome: "Sirene Audio Visual Bivolt 12/24",
        categoria: "Incêndio",
        imagem: "https://http2.mlstatic.com/D_NQ_NP_2X_960840-MLA106484997013_022026-F-sirene-audio-visual-bivolt.webp",
        rating: "★★★★☆",
        avaliacoes: 111,
        preco: 49.99,
        precoOriginal: 52.90,
        desconto: "-5%",
        pix: 47.49,
        parcelas: "2x de R$ 25,00",
        descricao: "Sirene audiovisual bivolt para alarmes de incêndio, com alerta sonoro e luminoso.",
        especificacoes: {
            "Tensão": "Bivolt",
            "Tipo": "Sonora e visual",
            "Garantia": "6 meses"
        },
        reviews: [
            { nome: "Cliente", estrelas: "★★★★☆", data: "12/06/2026", texto: "Som forte e luz bem visível." }
        ]
    },

    {
        id: 11,
        nome: "Niple Metal Cromado 1/2",
        categoria: "Adaptadores",
        imagem: "https://http2.mlstatic.com/D_NQ_NP_2X_862870-MLA103219596966_012026-F-niple-metal-cromado-12-12.webp",
        rating: "★★★★★",
        avaliacoes: 101,
        preco: 19.90,
        precoOriginal: 25.90,
        desconto: "-10%",
        pix: 18.91,
        parcelas: "1x de R$ 19,90",
        descricao: "Niple em metal cromado de 1/2 polegada para conexões hidráulicas e acabamentos.",
        especificacoes: {
            "Material": "Metal cromado",
            "Bitola": "1/2 polegada",
            "Garantia": "3 meses"
        },
        reviews: [
            { nome: "Cliente", estrelas: "★★★★★", data: "10/09/2026", texto: "Acabamento bonito e boa qualidade." }
        ]
    },

    {
        id: 12,
        nome: "Pino Adaptador 3 Saídas",
        categoria: "Adaptadores",
        imagem: "https://http2.mlstatic.com/D_NQ_NP_2X_824249-MLA106074263501_012026-F.webp",
        rating: "★★★★★",
        avaliacoes: 101,
        preco: 10.99,
        precoOriginal: 15.90,
        desconto: "-10%",
        pix: 10.44,
        parcelas: "1x de R$ 10,99",
        descricao: "Pino adaptador com 3 saídas para múltiplas conexões hidráulicas.",
        especificacoes: {
            "Saídas": "3",
            "Material": "Plástico reforçado",
            "Garantia": "3 meses"
        },
        reviews: [
            { nome: "Cliente", estrelas: "★★★★★", data: "25/08/2026", texto: "Prático e resistente." }
        ]
    },

    {
        id: 13,
        nome: "Registro 1148 c25",
        categoria: "Adaptadores",
        imagem: "https://http2.mlstatic.com/D_NQ_NP_2X_975392-MLB113347341725_062026-F-registro-1148--c25-filtro-12-sobredesce.webp",
        rating: "★★★★★",
        avaliacoes: 93,
        preco: 48.25,
        precoOriginal: 55.90,
        desconto: "-25%",
        pix: 45.84,
        parcelas: "2x de R$ 24,13",
        descricao: "Registro modelo 1148 c25 para controle de fluxo de água em instalações hidráulicas.",
        especificacoes: {
            "Modelo": "1148 c25",
            "Tipo": "Registro",
            "Garantia": "6 meses"
        },
        reviews: [
            { nome: "Cliente", estrelas: "★★★★★", data: "22/08/2026", texto: "Registro firme, sem vazamentos." }
        ]
    },

    {
        id: 14,
        nome: "Torneira Porta Cadeado 1/2-3/4",
        categoria: "Torneiras",
        imagem: "https://http2.mlstatic.com/D_NQ_NP_2X_642699-MLA105480331272_012026-F.webp",
        rating: "★★★★★",
        avaliacoes: 44,
        preco: 28.25,
        precoOriginal: 33.90,
        desconto: "-10%",
        pix: 26.84,
        parcelas: "2x de R$ 14,13",
        descricao: "Torneira com porta cadeado para uso externo, evitando desperdício e uso indevido.",
        especificacoes: {
            "Entrada": "1/2 - 3/4 polegada",
            "Recurso": "Porta cadeado",
            "Garantia": "6 meses"
        },
        reviews: [
            { nome: "Cliente", estrelas: "★★★★★", data: "15/07/2026", texto: "Ótima para área externa, o cadeado ajuda muito." }
        ]
    },

    {
        id: 15,
        nome: "Ducha Higienica Metal 1,20",
        categoria: "Torneiras",
        imagem: "https://http2.mlstatic.com/D_NQ_NP_2X_936384-MLB108240710587_032026-F-ducha-higienica-metal-120-metros-hsg.webp",
        rating: "★★★★★",
        avaliacoes: 25,
        preco: 61.53,
        precoOriginal: 67.90,
        desconto: "-9%",
        pix: 58.45,
        parcelas: "3x de R$ 20,51",
        descricao: "Ducha higiênica em metal com mangueira de 1,20m, ideal para banheiros.",
        especificacoes: {
            "Material": "Metal",
            "Mangueira": "1,20 metros",
            "Garantia": "6 meses"
        },
        reviews: [
            { nome: "Cliente", estrelas: "★★★★★", data: "20/08/2026", texto: "Acabamento excelente, jato forte." }
        ]
    },

    {
        id: 16,
        nome: "Organizador De Canto Para Chuveiro Banheiro Águia Metais",
        categoria: "Torneiras",
        imagem: "https://http2.mlstatic.com/D_NQ_NP_2X_967069-MLA106720720230_022026-F-organizador-de-canto-para-chuveiro-banheiro-aguia-metais.webp",
        rating: "★★★★★",
        avaliacoes: 33,
        preco: 29.53,
        precoOriginal: 31.90,
        desconto: "-9%",
        pix: 28.05,
        parcelas: "2x de R$ 14,77",
        descricao: "Organizador de canto para chuveiro, otimiza o espaço do banheiro com elegância.",
        especificacoes: {
            "Marca": "Águia Metais",
            "Posição": "Canto",
            "Garantia": "6 meses"
        },
        reviews: [
            { nome: "Cliente", estrelas: "★★★★★", data: "11/07/2026", texto: "Ficou perfeito no canto do box." }
        ]
    },

    {
        id: 17,
        nome: "Chuveiro Frio Médio C/ Braço 30cm Branco Luconi Acabamento Brilhante",
        categoria: "Torneiras",
        imagem: "https://http2.mlstatic.com/D_NQ_NP_2X_946645-MLB112011212372_062026-F-chuveiro-eletrico-duda-braco-para-chuveiro.webp",
        rating: "★★★★★",
        avaliacoes: 54,
        preco: 25.53,
        precoOriginal: 30.90,
        desconto: "-9%",
        pix: 24.25,
        parcelas: "2x de R$ 12,77",
        descricao: "Chuveiro frio médio com braço de 30cm na cor branca, acabamento brilhante da Luconi.",
        especificacoes: {
            "Marca": "Luconi",
            "Braço": "30 cm",
            "Cor": "Branco",
            "Tipo": "Frio médio",
            "Garantia": "6 meses"
        },
        reviews: [
            { nome: "Cliente", estrelas: "★★★★★", data: "02/09/2026", texto: "Muito bonito e fácil de instalar." }
        ]
    },

    {
        id: 18,
        nome: "Prolongador Canoplap/ Registro 1/2 -3/4 -1 8mm Latão Crom",
        categoria: "Torneiras",
        imagem: "https://http2.mlstatic.com/D_NQ_NP_2X_663194-MLA106370253364_022026-F-prolongador-canoplap-registro-12-34-1-8mm-latao-crom.webp",
        rating: "★★★★★",
        avaliacoes: 22,
        preco: 25.53,
        precoOriginal: 30.90,
        desconto: "-9%",
        pix: 24.25,
        parcelas: "2x de R$ 12,77",
        descricao: "Prolongador para registro em latão cromado, disponível em 1/2, 3/4 e 1 polegada.",
        especificacoes: {
            "Material": "Latão cromado",
            "Bitolas": "1/2, 3/4 e 1 polegada",
            "Garantia": "6 meses"
        },
        reviews: [
            { nome: "Cliente", estrelas: "★★★★★", data: "19/07/2026", texto: "Ajuste perfeito no registro." }
        ]
    },

    {
        id: 19,
        nome: "Chuveiro Luconi 6 Polegadas Alta Pressão Econômico",
        categoria: "Torneiras",
        imagem: "https://http2.mlstatic.com/D_NQ_NP_2X_865643-MLB112495966262_062026-F-chuveiro-luconi-6-polegadas-alta-pressao-economico.webp",
        rating: "★★★★★",
        avaliacoes: 22,
        preco: 22.53,
        precoOriginal: 29.90,
        desconto: "-12%",
        pix: 21.40,
        parcelas: "2x de R$ 11,27",
        descricao: "Chuveiro Luconi de 6 polegadas para alta pressão, econômico e eficiente.",
        especificacoes: {
            "Marca": "Luconi",
            "Diâmetro": "6 polegadas",
            "Pressão": "Alta",
            "Garantia": "6 meses"
        },
        reviews: [
            { nome: "Cliente", estrelas: "★★★★★", data: "27/08/2026", texto: "Banho forte e econômico." }
        ]
    },

    {
        id: 20,
        nome: "Filtro De Água Ativi 9000 Litros Cromado Abs",
        categoria: "Torneiras",
        imagem: "https://http2.mlstatic.com/D_NQ_NP_2X_880479-MLB113663635269_062026-F-filtro-de-agua-ativi-9000-litros-cromado-abs.webp",
        rating: "★★★★★",
        avaliacoes: 22,
        preco: 34.53,
        precoOriginal: 40.90,
        desconto: "-12%",
        pix: 32.80,
        parcelas: "2x de R$ 17,27",
        descricao: "Filtro de água Ativi com capacidade de 9000 litros, acabamento cromado em ABS.",
        especificacoes: {
            "Capacidade": "9000 litros",
            "Material": "ABS cromado",
            "Garantia": "6 meses"
        },
        reviews: [
            { nome: "Cliente", estrelas: "★★★★★", data: "08/09/2026", texto: "Água mais limpa, fácil troca do refil." }
        ]
    },

    {
        id: 21,
        nome: "Metais Last Stander Papeleira com Tampa Cor Prateado Cromado",
        categoria: "Torneiras",
        imagem: "https://http2.mlstatic.com/D_NQ_NP_2X_965015-MLA113710667373_062026-F.webp",
        rating: "★★★★★",
        avaliacoes: 22,
        preco: 17.53,
        precoOriginal: 22.90,
        desconto: "-12%",
        pix: 16.65,
        parcelas: "1x de R$ 17,53",
        descricao: "Papeleira com tampa na cor prateado cromado, da linha Last Stander.",
        especificacoes: {
            "Marca": "Last Stander",
            "Cor": "Prateado cromado",
            "Tipo": "Com tampa",
            "Garantia": "3 meses"
        },
        reviews: [
            { nome: "Cliente", estrelas: "★★★★★", data: "14/08/2026", texto: "Prática e elegante no banheiro." }
        ]
    },

    {
        id: 22,
        nome: "Adaptador T De Latão Cr Rosca Macho 1/2 X Fêmea X Fêmea 1/2",
        categoria: "Torneiras",
        imagem: "https://http2.mlstatic.com/D_NQ_NP_2X_857541-MLB113709442439_062026-F-adaptador-t-de-latao-cr-rosca-macho-12--x-femea-x-femea-12.webp",
        rating: "★★★★★",
        avaliacoes: 44,
        preco: 33.53,
        precoOriginal: 38.90,
        desconto: "-22%",
        pix: 31.85,
        parcelas: "2x de R$ 16,77",
        descricao: "Adaptador em T de latão cromado com rosca macho 1/2 x fêmea x fêmea 1/2.",
        especificacoes: {
            "Material": "Latão cromado",
            "Conexão": "T (macho 1/2 x fêmea x fêmea 1/2)",
            "Garantia": "6 meses"
        },
        reviews: [
            { nome: "Cliente", estrelas: "★★★★★", data: "21/07/2026", texto: "Conexão firme e sem vazamentos." }
        ]
    },

    {
        id: 23,
        nome: "Conexão Junção Derivador Te 1/2 Filtro/maquina Lavar/louça",
        categoria: "Torneiras",
        imagem: "https://http2.mlstatic.com/D_NQ_NP_2X_950379-MLB112544254194_062026-F-conexao-juncao-derivador-te-12-filtromaquina-lavarlouca.webp",
        rating: "★★★★★",
        avaliacoes: 35,
        preco: 34.00,
        precoOriginal: 39.97,
        desconto: "-2%",
        pix: 32.30,
        parcelas: "2x de R$ 17,00",
        descricao: "Conexão de junção tipo T (derivador) de 1/2 para filtro, máquina de lavar ou louça.",
        especificacoes: {
            "Bitola": "1/2 polegada",
            "Tipo": "Derivador em T",
            "Uso": "Filtro, máquina de lavar e louça",
            "Garantia": "6 meses"
        },
        reviews: [
            { nome: "Cliente", estrelas: "★★★★★", data: "06/09/2026", texto: "Resolveu a divisão de água da máquina." }
        ]
    },

    {
        id: 24,
        nome: "Extensão Lisa Curta 1/2 32mm",
        categoria: "Torneiras",
        imagem: "https://http2.mlstatic.com/D_NQ_NP_2X_976646-MLB113717980207_062026-F-extensao-lisa-curta-12-32mm.webp",
        rating: "★★★★★",
        avaliacoes: 15,
        preco: 21.90,
        precoOriginal: 24.90,
        desconto: "-12%",
        pix: 20.81,
        parcelas: "2x de R$ 10,95",
        descricao: "Extensão lisa curta de 1/2 polegada com 32mm, para conexões hidráulicas.",
        especificacoes: {
            "Bitola": "1/2 polegada",
            "Comprimento": "32 mm",
            "Tipo": "Lisa curta",
            "Garantia": "3 meses"
        },
        reviews: [
            { nome: "Cliente", estrelas: "★★★★★", data: "23/08/2026", texto: "Medida exata, ótima qualidade." }
        ]
    },

    {
        id: 25,
        nome: "Extensão Lisa Média 1/2",
        categoria: "Torneiras",
        imagem: "https://http2.mlstatic.com/D_NQ_NP_2X_623240-MLB113709905291_062026-F-extensao-lisa-media-12-metal.webp",
        rating: "★★★★★",
        avaliacoes: 29,
        preco: 28.90,
        precoOriginal: 31.90,
        desconto: "-3%",
        pix: 27.46,
        parcelas: "2x de R$ 14,45",
        descricao: "Extensão lisa média de 1/2 polegada para instalações hidráulicas.",
        especificacoes: {
            "Bitola": "1/2 polegada",
            "Tipo": "Lisa média",
            "Garantia": "3 meses"
        },
        reviews: [
            { nome: "Cliente", estrelas: "★★★★★", data: "17/07/2026", texto: "Boa extensão, encaixe perfeito." }
        ]
    },

    {
        id: 26,
        nome: "Extensão Lisa Longa 1/2",
        categoria: "Torneiras",
        imagem: "https://http2.mlstatic.com/D_NQ_NP_2X_988492-MLB112544494324_062026-F-extensao-lisa-longa-12.webp",
        rating: "★★★★★",
        avaliacoes: 15,
        preco: 36.90,
        precoOriginal: 41.90,
        desconto: "-10%",
        pix: 35.06,
        parcelas: "2x de R$ 18,45",
        descricao: "Extensão lisa longa de 1/2 polegada para alcançar pontos mais distantes.",
        especificacoes: {
            "Bitola": "1/2 polegada",
            "Tipo": "Lisa longa",
            "Garantia": "3 meses"
        },
        reviews: [
            { nome: "Cliente", estrelas: "★★★★★", data: "30/07/2026", texto: "Comprimento ideal para o que precisava." }
        ]
    },

    {
        id: 27,
        nome: "Torneira 1194 Cromada Abs",
        categoria: "Torneiras",
        imagem: "https://http2.mlstatic.com/D_NQ_NP_2X_909107-MLA112758729936_062026-F-torneira-1193-lavatorio-mesa-cromada.webp",
        rating: "★★★★★",
        avaliacoes: 99,
        preco: 25.90,
        precoOriginal: 29.90,
        desconto: "-8%",
        pix: 24.61,
        parcelas: "2x de R$ 12,95",
        descricao: "Torneira modelo 1194 cromada em ABS, ideal para uso geral.",
        especificacoes: {
            "Modelo": "1194",
            "Material": "ABS cromado",
            "Garantia": "6 meses"
        },
        reviews: [
            { nome: "Cliente", estrelas: "★★★★★", data: "12/08/2026", texto: "Bonita e resistente." }
        ]
    },

    {
        id: 28,
        nome: "Torneira Bica Móvel Cromada Mesa Cromada",
        categoria: "Torneiras",
        imagem: "https://http2.mlstatic.com/D_NQ_NP_2X_890807-MLB113999223335_072026-F-torneira-bica-movel-cromada-em-abs-mesa.webp",
        rating: "★★★★★",
        avaliacoes: 101,
        preco: 18.50,
        precoOriginal: 23.90,
        desconto: "-6%",
        pix: 17.58,
        parcelas: "1x de R$ 18,50",
        descricao: "Torneira de mesa com bica móvel e acabamento cromado.",
        especificacoes: {
            "Tipo": "Mesa",
            "Bica": "Móvel",
            "Acabamento": "Cromado",
            "Garantia": "6 meses"
        },
        reviews: [
            { nome: "Cliente", estrelas: "★★★★★", data: "09/09/2026", texto: "A bica móvel facilita muito na cozinha." }
        ]
    },

    {
        id: 29,
        nome: "Torneira 1130 Cromada Abs",
        categoria: "Torneiras",
        imagem: "https://http2.mlstatic.com/D_NQ_NP_2X_920511-MLB114001037535_072026-F-torneira-artplas-1130-cromada.webp",
        rating: "★★★★★",
        avaliacoes: 65,
        preco: 23.50,
        precoOriginal: 26.90,
        desconto: "-12%",
        pix: 22.33,
        parcelas: "2x de R$ 11,75",
        descricao: "Torneira modelo 1130 cromada em ABS, para uso residencial.",
        especificacoes: {
            "Modelo": "1130",
            "Material": "ABS cromado",
            "Garantia": "6 meses"
        },
        reviews: [
            { nome: "Cliente", estrelas: "★★★★★", data: "16/08/2026", texto: "Ótima para o tanque de lavar." }
        ]
    },

    {
        id: 30,
        nome: "Ducha Higiênica Hisense Smart Com Registro",
        categoria: "Torneiras",
        imagem: "https://http2.mlstatic.com/D_NQ_NP_2X_919835-MLA113952271245_062026-F-ducha-higienica-hisense-smart-cromada-completa-registro-14.webp",
        rating: "★★★★★",
        avaliacoes: 202,
        preco: 57.25,
        precoOriginal: 67.90,
        desconto: "-5%",
        pix: 54.39,
        parcelas: "3x de R$ 19,08",
        descricao: "Ducha higiênica Hisense Smart com registro incluso, prática e moderna.",
        especificacoes: {
            "Marca": "Hisense",
            "Inclui": "Registro",
            "Garantia": "6 meses"
        },
        reviews: [
            { nome: "Cliente", estrelas: "★★★★★", data: "01/09/2026", texto: "Completa e muito confortável." }
        ]
    },

    // ==================== NOVIDADES.HTML (IDs 31-37) ====================

    {
        id: 31,
        nome: "Ducha Higiênica Smart",
        categoria: "Torneiras",
        imagem: "https://http2.mlstatic.com/D_NQ_NP_2X_919835-MLA113952271245_062026-F.webp",
        rating: "★★★★★",
        avaliacoes: 31,
        preco: 61.53,
        precoOriginal: null,
        desconto: "",
        pix: 58.45,
        parcelas: "3x de R$ 20,51",
        descricao: "Ducha higiênica com acionamento smart, jato forte e acabamento cromado. Ideal para banheiros residenciais.",
        especificacoes: {
            "Tipo": "Ducha higiênica",
            "Acabamento": "Cromado",
            "Garantia": "6 meses"
        },
        reviews: [
            { nome: "Cliente", estrelas: "★★★★★", data: "12/09/2026", texto: "Jato forte e muito confortável." }
        ]
    },

    {
        id: 32,
        nome: "Adaptador Para Filtro Mesa 1/4 5/16 3/8",
        categoria: "Adaptadores",
        imagem: "https://http2.mlstatic.com/D_NQ_NP_2X_741355-MLB114015774198_072026-F-adaptador-para-filtro-mesa-14-516-38.webp",
        rating: "★★★★★",
        avaliacoes: 31,
        preco: 69.00,
        precoOriginal: null,
        desconto: "",
        pix: 65.55,
        parcelas: "3x de R$ 23,00",
        descricao: "Adaptador para filtro de mesa compatível com roscas de 1/4, 5/16 e 3/8. Ideal para filtros de água de bancada.",
        especificacoes: {
            "Bitolas": "1/4, 5/16 e 3/8",
            "Uso": "Filtro de mesa",
            "Garantia": "6 meses"
        },
        reviews: [
            { nome: "Cliente", estrelas: "★★★★★", data: "10/09/2026", texto: "Encaixou perfeitamente no filtro." }
        ]
    },

    {
        id: 33,
        nome: "Espigão 1/2 P/filtro 1/4 5/16 3/8",
        categoria: "Adaptadores",
        imagem: "https://http2.mlstatic.com/D_NQ_NP_2X_990182-MLB116371445482_092026-F-espigao-12-pfiltro-14-516-38.webp",
        rating: "★★★★★",
        avaliacoes: 53,
        preco: 42.00,
        precoOriginal: null,
        desconto: "",
        pix: 39.90,
        parcelas: "2x de R$ 21,00",
        descricao: "Espigão de 1/2 polegada para conexão em filtros com rosca de 1/4, 5/16 ou 3/8.",
        especificacoes: {
            "Entrada": "1/2 polegada",
            "Saída": "1/4, 5/16 e 3/8",
            "Uso": "Filtros",
            "Garantia": "6 meses"
        },
        reviews: [
            { nome: "Cliente", estrelas: "★★★★★", data: "08/09/2026", texto: "Bom acabamento, funcionou direto." }
        ]
    },

    {
        id: 34,
        nome: "Botoeira De Alarme De Incêndio Com Martelo",
        categoria: "Incêndio",
        imagem: "https://http2.mlstatic.com/D_NQ_NP_2X_952103-MLB113456889599_062026-F-botoeira-de-alarme-de-incendio-com-martelo.webp",
        rating: "★★★★★",
        avaliacoes: 1000,
        preco: 57.50,
        precoOriginal: null,
        desconto: "",
        pix: 54.63,
        parcelas: "2x de R$ 28,75",
        descricao: "Botoeira de alarme de incêndio com martelo acoplado, para acionamento rápido em situações de emergência.",
        especificacoes: {
            "Tipo": "Botoeira de alarme",
            "Recurso": "Com martelo",
            "Uso": "Sistemas de incêndio",
            "Garantia": "12 meses"
        },
        reviews: [
            { nome: "Cliente", estrelas: "★★★★★", data: "05/09/2026", texto: "Produto conforme o esperado, chegou rápido." }
        ]
    },

    {
        id: 35,
        nome: "Cesta Pesada De Metal Para Pia Válvula Americana 3 1/2",
        categoria: "Conexões",
        imagem: "https://http2.mlstatic.com/D_NQ_NP_2X_686363-MLB117871258555_092026-F-cesta-pesada-de-metal-para-pia-valvula-americana-3-12.webp",
        rating: "★★★★★",
        avaliacoes: 10,
        preco: 17.55,
        precoOriginal: null,
        desconto: "",
        pix: 16.67,
        parcelas: "1x de R$ 17,55",
        descricao: "Cesta pesada de metal para pia com válvula americana de 3 1/2 polegadas. Resistente e de fácil limpeza.",
        especificacoes: {
            "Diâmetro": "3 1/2 polegadas",
            "Material": "Metal",
            "Tipo": "Válvula americana",
            "Garantia": "3 meses"
        },
        reviews: [
            { nome: "Cliente", estrelas: "★★★★★", data: "03/09/2026", texto: "Boa qualidade, encaixe perfeito na pia." }
        ]
    },

    {
        id: 36,
        nome: "Registro Duplo Para Ducha Higiênica Maquina De Lavar Metal",
        categoria: "Adaptadores",
        imagem: "https://http2.mlstatic.com/D_NQ_NP_2X_923320-MLB117870202193_092026-F-registro-duplo-para-ducha-higienica-maquina-de-lavar-metal.webp",
        rating: "★★★★★",
        avaliacoes: 8,
        preco: 36.20,
        precoOriginal: null,
        desconto: "",
        pix: 34.39,
        parcelas: "2x de R$ 18,10",
        descricao: "Registro duplo em metal para ducha higiênica e máquina de lavar, com controle independente de fluxo.",
        especificacoes: {
            "Material": "Metal",
            "Saídas": "Duplas",
            "Uso": "Ducha higiênica e máquina de lavar",
            "Garantia": "6 meses"
        },
        reviews: [
            { nome: "Cliente", estrelas: "★★★★★", data: "01/09/2026", texto: "Muito bom, controle individual funciona bem." }
        ]
    },

    {
        id: 37,
        nome: "Niple De Redução 3/4 X 1/2",
        categoria: "Conexões",
        imagem: "https://http2.mlstatic.com/D_NQ_NP_2X_920626-MLB117871028345_092026-F-niple-de-reducao-34-x-12.webp",
        rating: "★★★★★",
        avaliacoes: 12,
        preco: 22.00,
        precoOriginal: null,
        desconto: "",
        pix: 20.90,
        parcelas: "1x de R$ 22,00",
        descricao: "Niple de redução 3/4 x 1/2 polegada para adaptar conexões hidráulicas de diâmetros diferentes.",
        especificacoes: {
            "Entrada": "3/4 polegada",
            "Saída": "1/2 polegada",
            "Material": "Metal",
            "Garantia": "3 meses"
        },
        reviews: [
            { nome: "Cliente", estrelas: "★★★★★", data: "28/08/2026", texto: "Medida exata, ótimo acabamento." }
        ]
    },

    // ==================== PROMOÇÕES.HTML (IDs 38-47) ====================

    {
        id: 38,
        nome: "Válvula Longa 11 cm",
        categoria: "Incêndio",
        imagem: "https://http2.mlstatic.com/D_NQ_NP_2X_933959-MLA112305750642_062026-F.webp",
        rating: "★★★★★",
        avaliacoes: 159,
        preco: 45.90,
        precoOriginal: null,
        desconto: "",
        pix: 43.60,
        parcelas: "2x de R$ 22,95",
        descricao: "Válvula longa de 11 cm para sistemas hidráulicos e de combate a incêndio. Acabamento reforçado e alta durabilidade.",
        especificacoes: {
            "Comprimento": "11 cm",
            "Tipo": "Válvula longa",
            "Garantia": "6 meses"
        },
        reviews: [
            { nome: "Cliente", estrelas: "★★★★★", data: "05/09/2026", texto: "Produto de ótima qualidade, chegou rápido." }
        ]
    },

    {
        id: 39,
        nome: "Válvula Para Pia Americana 4 1/2 Metal",
        categoria: "Incêndio",
        imagem: "https://http2.mlstatic.com/D_NQ_NP_2X_840429-MLB113456504373_062026-F.webp",
        rating: "★★★★☆",
        avaliacoes: 149,
        preco: 70.50,
        precoOriginal: 84.90,
        desconto: "-10%",
        pix: 66.98,
        parcelas: "3x de R$ 23,50",
        descricao: "Válvula para pia americana de 4 1/2 polegadas em metal, resistente e de fácil instalação.",
        especificacoes: {
            "Diâmetro": "4 1/2 polegadas",
            "Material": "Metal",
            "Tipo": "Válvula americana",
            "Garantia": "6 meses"
        },
        reviews: [
            { nome: "Cliente", estrelas: "★★★★☆", data: "02/09/2026", texto: "Boa qualidade, encaixe perfeito na pia." }
        ]
    },

    {
        id: 40,
        nome: "Kit 5 Niples 1/2",
        categoria: "Adaptadores",
        imagem: "https://http2.mlstatic.com/D_NQ_NP_2X_644680-MLA112450977872_062026-F.webp",
        rating: "★★★★★",
        avaliacoes: 101,
        preco: 42.90,
        precoOriginal: 56.90,
        desconto: "-30%",
        pix: 40.76,
        parcelas: "2x de R$ 21,45",
        descricao: "Kit com 5 niples de 1/2 polegada para conexões hidráulicas, ideal para reformas e instalações.",
        especificacoes: {
            "Quantidade": "5 unidades",
            "Bitola": "1/2 polegada",
            "Tipo": "Niple",
            "Garantia": "3 meses"
        },
        reviews: [
            { nome: "Cliente", estrelas: "★★★★★", data: "28/08/2026", texto: "Ótimo custo-benefício, material resistente." }
        ]
    },

    {
        id: 41,
        nome: "Cesta Válvula Americana 4 1/2 Leve Inox",
        categoria: "Incêndio",
        imagem: "https://http2.mlstatic.com/D_NQ_NP_2X_626445-MLB113618317325_062026-F.webp",
        rating: "★★★★☆",
        avaliacoes: 121,
        preco: 27.99,
        precoOriginal: 29.90,
        desconto: "-5%",
        pix: 26.59,
        parcelas: "2x de R$ 14,00",
        descricao: "Cesta para válvula americana de 4 1/2 polegadas em inox leve, ideal para pias de cozinha.",
        especificacoes: {
            "Diâmetro": "4 1/2 polegadas",
            "Material": "Inox leve",
            "Tipo": "Cesta para válvula americana",
            "Garantia": "3 meses"
        },
        reviews: [
            { nome: "Cliente", estrelas: "★★★★☆", data: "25/08/2026", texto: "Boa qualidade, fácil de limpar." }
        ]
    },

    {
        id: 42,
        nome: "Cesta Válvula Pia Americana Leve 3 1/2 Inox",
        categoria: "Adaptadores",
        imagem: "https://http2.mlstatic.com/D_NQ_NP_2X_798948-MLB113617844133_062026-F.webp",
        rating: "★★★★★",
        avaliacoes: 107,
        preco: 19.90,
        precoOriginal: 25.90,
        desconto: "-10%",
        pix: 18.91,
        parcelas: "1x de R$ 19,90",
        descricao: "Cesta para válvula de pia americana de 3 1/2 polegadas em inox leve. Prática e resistente.",
        especificacoes: {
            "Diâmetro": "3 1/2 polegadas",
            "Material": "Inox leve",
            "Tipo": "Cesta para pia americana",
            "Garantia": "3 meses"
        },
        reviews: [
            { nome: "Cliente", estrelas: "★★★★★", data: "20/08/2026", texto: "Encaixou perfeitamente, ótima qualidade." }
        ]
    },

    {
        id: 43,
        nome: "Registro Pressão 1400 3/4 Am",
        categoria: "Adaptadores",
        imagem: "https://http2.mlstatic.com/D_NQ_NP_2X_809256-MLB113662568675_062026-F.webp",
        rating: "★★★★★",
        avaliacoes: 99,
        preco: 32.15,
        precoOriginal: 48.90,
        desconto: "-10%",
        pix: 30.54,
        parcelas: "2x de R$ 16,08",
        descricao: "Registro de pressão modelo 1400 de 3/4 polegada, ideal para controle de fluxo em instalações hidráulicas.",
        especificacoes: {
            "Modelo": "1400",
            "Bitola": "3/4 polegada",
            "Tipo": "Registro de pressão",
            "Garantia": "6 meses"
        },
        reviews: [
            { nome: "Cliente", estrelas: "★★★★★", data: "18/08/2026", texto: "Registro firme, sem vazamentos." }
        ]
    },

    {
        id: 44,
        nome: "Botoeira De Alarme De Incêndio Com Martelo",
        categoria: "Incêndio",
        imagem: "https://http2.mlstatic.com/D_NQ_NP_2X_650721-MLB112303860518_062026-F.webp",
        rating: "★★★★★",
        avaliacoes: 93,
        preco: 57.25,
        precoOriginal: 65.90,
        desconto: "-25%",
        pix: 54.39,
        parcelas: "2x de R$ 28,63",
        descricao: "Botoeira de alarme de incêndio com martelo acoplado para acionamento rápido em emergências.",
        especificacoes: {
            "Tipo": "Botoeira de alarme",
            "Recurso": "Com martelo",
            "Uso": "Sistemas de incêndio",
            "Garantia": "12 meses"
        },
        reviews: [
            { nome: "Cliente", estrelas: "★★★★★", data: "15/08/2026", texto: "Produto conforme o esperado." }
        ]
    },

    {
        id: 45,
        nome: "Martelinho Com Corrente Para Botoeira",
        categoria: "Incêndio",
        imagem: "https://http2.mlstatic.com/D_NQ_NP_2X_669173-MLA106363096206_022026-F.webp",
        rating: "★★★★★",
        avaliacoes: 44,
        preco: 24.25,
        precoOriginal: 33.90,
        desconto: "-10%",
        pix: 23.04,
        parcelas: "2x de R$ 12,13",
        descricao: "Martelinho com corrente para botoeira de alarme, ideal para quebrar vidros em situações de emergência.",
        especificacoes: {
            "Tipo": "Martelinho com corrente",
            "Uso": "Botoeira de alarme",
            "Garantia": "3 meses"
        },
        reviews: [
            { nome: "Cliente", estrelas: "★★★★★", data: "12/08/2026", texto: "Bom acabamento, corrente resistente." }
        ]
    },

    {
        id: 46,
        nome: "Válvula Gofield 1 Metal Dn 25 Pn40 1 Via",
        categoria: "Torneiras",
        imagem: "https://http2.mlstatic.com/D_NQ_NP_2X_964387-MLA107386561805_022026-F.webp",
        rating: "★★★★★",
        avaliacoes: 25,
        preco: 33.53,
        precoOriginal: 52.90,
        desconto: "-25%",
        pix: 31.85,
        parcelas: "2x de R$ 16,77",
        descricao: "Válvula Gofield de 1 polegada em metal, DN 25, PN40, 1 via. Alta resistência para uso industrial.",
        especificacoes: {
            "Marca": "Gofield",
            "Bitola": "1 polegada",
            "DN": "25",
            "PN": "40",
            "Vias": "1 via",
            "Material": "Metal",
            "Garantia": "6 meses"
        },
        reviews: [
            { nome: "Cliente", estrelas: "★★★★★", data: "10/08/2026", texto: "Válvula robusta, excelente qualidade." }
        ]
    },

    {
        id: 47,
        nome: "Luva De Malha Tricotada 3 Fios Branca (12 Pares)",
        categoria: "Segurança",
        imagem: "https://http2.mlstatic.com/D_NQ_NP_2X_788781-MLA106720685042_022026-F.webp",
        rating: "★★★★★",
        avaliacoes: 25,
        preco: 33.53,
        precoOriginal: 52.90,
        desconto: "-25%",
        pix: 31.85,
        parcelas: "2x de R$ 16,77",
        descricao: "Pacote com 12 pares de luvas de malha tricotada de 3 fios na cor branca, para proteção em trabalhos leves.",
        especificacoes: {
            "Quantidade": "12 pares",
            "Tipo": "Malha tricotada 3 fios",
            "Cor": "Branca",
            "Garantia": "3 meses"
        },
        reviews: [
            { nome: "Cliente", estrelas: "★★★★★", data: "08/08/2026", texto: "Luvas confortáveis e resistentes." }
        ]
    }
];
