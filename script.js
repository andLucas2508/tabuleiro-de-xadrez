
const canvas = document.getElementById('meu_canvas');
const context = canvas.getContext('2d');

//tamanho do tabuleiro e das células
const boardSize = 8; //8x8
const cellSize = canvas.width / boardSize; // Calcula o tamanho da célula com base na largura do canvas

// Cores das casas do tabuleiro (padrão de xadrez)
const lightSquareColor = '#000000'; // Marfim claro
const darkSquareColor = '#F8F8F8'; // Marrom escuro


const pieceImages = {
    'wp': 'img/peaobranco.png',   // Peão Branco
    'wr': 'img/torrebranca.png',  // Torre Branca
    'wn': 'img/cavalobranco.png', // Cavalo Branco
    'wb': 'img/bispo_branco.png', // Bispo Branco
    'wq': 'img/rainhabranca.png',   // Rainha Branca (Dama Branca)
    'wk': 'img/reibranco.png',    // Rei Branco
    'bp': 'img/peaopreto.png',    // Peão Preto
    'br': 'img/torrepreta.png',   // Torre Preta
    'bn': 'img/cavalopreto.png',  // Cavalo Preto
    'bb': 'img/bisporeto.png',    // Bispo Preto
    'bq': 'img/rainhapreta.png',  // Rainha Preta
    'bk': 'img/reipreto.png',     // Rei Preto
};

// Estado inicial do tabuleiro de xadrez com 32 peças (16 brancas, 16 pretas)
// As strings representam as peças; '' indica um quadrado vazio.
const initialBoardState = [
    // Linha 0 (Pretas - topo do tabuleiro)
    ['br', 'bn', 'bb', 'bq', 'bk', 'bb', 'bn', 'br'], 
    // Linha 1 (Peões Pretos)
    ['bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp'], 
    // Linhas 2 a 5 (Vazias no início do jogo)
    ['',   '',   '',   '',   '',   '',   '',   ''],   
    ['',   '',   '',   '',   '',   '',   '',   ''],   
    ['',   '',   '',   '',   '',   '',   '',   ''],   
    ['',   '',   '',   '',   '',   '',   '',   ''],   
    // Linha 6 (Peões Brancos)
    ['wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp'], 
    // Linha 7 (Brancas - base do tabuleiro)
    ['wr', 'wn', 'wb', 'wq', 'wk', 'wb', 'wn', 'wr']  
];

// Objeto para armazenar as instâncias de Image pré-carregadas.
// Isso evita atrasos no desenho, garantindo que a imagem já esteja pronta.
const loadedImages = {};
let imagesLoadedCount = 0;
const totalImagesToLoad = Object.keys(pieceImages).length; // Conta quantas imagens de peça precisamos carregar

// Função para pré-carregar todas as imagens das peças
function preloadImages() {
    return new Promise((resolve, reject) => {
        if (totalImagesToLoad === 0) {
            resolve(); // Se não houver imagens para carregar, resolve imediatamente
            return;
        }

        for (const pieceCode in pieceImages) {
            const img = new Image();
            img.src = pieceImages[pieceCode]; // Define o caminho da imagem
            img.onload = () => {
                loadedImages[pieceCode] = img; // Armazena a imagem carregada
                imagesLoadedCount++;
                if (imagesLoadedCount === totalImagesToLoad) {
                    resolve(); // Todas as imagens foram carregadas com sucesso
                }
            };
            img.onerror = () => {
                console.error(`Erro ao carregar a imagem: ${pieceImages[pieceCode]}. Verifique o caminho e o nome do arquivo.`);
                // Embora haja um erro, ainda contamos para que o processo não fique travado
                imagesLoadedCount++; 
                if (imagesLoadedCount === totalImagesToLoad) {
                    resolve();
                }
            };
        }
    });
}

// Função principal para desenhar o tabuleiro e todas as peças
function drawBoard() {
    // Limpa o canvas para garantir um novo desenho "limpo"
    context.clearRect(0, 0, canvas.width, canvas.height);

    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            // Determina a cor do quadrado (alternando entre claro e escuro)
            const color = (row + col) % 2 === 0 ? lightSquareColor : darkSquareColor;
            context.fillStyle = color;
            
            // Desenha o quadrado no canvas
            context.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);

            // Verifica se há uma peça na posição atual do tabuleiro
            const pieceCode = initialBoardState[row][col];
            if (pieceCode && loadedImages[pieceCode]) { // Se houver um código de peça E a imagem estiver carregada
                const img = loadedImages[pieceCode]; // Pega a imagem pré-carregada

                // Calcula a posição e o tamanho da peça para que ela fique centralizada
                // e tenha um pequeno "padding" dentro da célula.
                const piecePadding = cellSize * 0.05; // 5% do tamanho da célula para padding
                const pieceSize = cellSize - (piecePadding * 2); // Tamanho da peça com padding

                context.drawImage(
                    img,
                    col * cellSize + piecePadding, // Posição X da peça na célula
                    row * cellSize + piecePadding, // Posição Y da peça na célula
                    pieceSize, // Largura da peça
                    pieceSize  // Altura da peça
                );
            }
        }
    }
}

// --- Evento de Clique no Canvas (Para Futura Interatividade) ---
canvas.addEventListener('click', (event) => {
    // Obtém as coordenadas do clique em relação à área visível do navegador
    const clientX = event.clientX;
    const clientY = event.clientY;

    // Obtém a posição e o tamanho do canvas na tela
    const canvasRect = canvas.getBoundingClientRect();

    // Calcula as coordenadas do clique DENTRO do canvas
    const xInCanvas = clientX - canvasRect.left;
    const yInCanvas = clientY - canvasRect.top;

    // Calcula qual linha e coluna foram clicadas
    const clickedCol = Math.floor(xInCanvas / cellSize);
    const clickedRow = Math.floor(yInCanvas / cellSize);

    console.log(`Célula clicada: Linha ${clickedRow}, Coluna ${clickedCol}`);
    const pieceOnCell = initialBoardState[clickedRow][clickedCol];
    if (pieceOnCell) {
        console.log(`Peça clicada: ${pieceOnCell}`);
        // TODO: Adicione sua lógica de jogo aqui (ex: selecionar peça, mostrar movimentos possíveis)
    } else {
        console.log('Célula vazia clicada.');
    }
});


// --- Inicialização da Aplicação ---
// Quando o DOM estiver completamente carregado:
document.addEventListener('DOMContentLoaded', () => {
    // 1. Pré-carrega todas as imagens das peças
    preloadImages().then(() => {
        // 2. Uma vez que todas as imagens estão carregadas, desenha o tabuleiro
        console.log('Todas as imagens das peças foram carregadas. Desenhando o tabuleiro de xadrez...');
        drawBoard();
    }).catch(error => {
        // Em caso de erro no carregamento das imagens
        console.error('Erro durante o pré-carregamento de imagens:', error);
        // Mesmo com erros, tenta desenhar o tabuleiro (apenas os quadrados aparecerão, sem as peças com erro)
        drawBoard(); 
    });
});