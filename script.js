const boardRegions = document.querySelectorAll('#gameBoard span');
let vBoard = [];
let turnPlayer = '';
let gameMode = ''; // Modo de jogo
let aiDifficulty = ''; // Dificuldade selecionada para IA
const startButton = document.getElementById('start');

// Desabilitar o botão "Play" até que o usuário selecione um modo de jogo
startButton.disabled = true;

// Seletores do modal e botões
const iaModal = document.getElementById('difficultyModal');
const closeIAModal = document.getElementById('close');
const playerVsIAButton = document.getElementById('playerVsIA');
const playerVsPlayerButton = document.getElementById('playerVsPlayer');

// <***************************************************************************>
// MODAL JOGADOR VS IA

// Abrir modal ao clicar em "Jogador vs IA"
playerVsIAButton.addEventListener('click', () => {
  iaModal.style.display = 'flex';
  gameMode = 'vsIA';
  document.getElementById('player1').disabled = true;
  document.getElementById('player2').disabled = true;
  startButton.disabled = false; // Habilita o botão "Play"
});

// Fechar iaModal ao clicar no "X"
closeIAModal.addEventListener('click', () => {
  iaModal.style.display = 'none';
});

// Fechar iaModal ao clicar fora do conteúdo
window.addEventListener('click', (event) => {
  if (event.target == iaModal) {
    iaModal.style.display = 'none';
  }
});

// Selecionar a dificuldade
document.getElementById('easy').addEventListener('click', () => {
  aiDifficulty = 'easy';
  iaModal.style.display = 'none';
  initializeGame();
});

document.getElementById('medium').addEventListener('click', () => {
  aiDifficulty = 'medium';
  iaModal.style.display = 'none';
  initializeGame();
});

document.getElementById('hard').addEventListener('click', () => {
  aiDifficulty = 'hard';
  iaModal.style.display = 'none';
  initializeGame();
});

document.getElementById('insane').addEventListener('click', () => {
  aiDifficulty = 'insane';
  iaModal.style.display = 'none';
  initializeGame();
});

// <***************************************************************************>

// <***************************************************************************>
// MODO JOGADOR VS JOGADOR

// Selecionar o modo "Jogador vs Jogador"
playerVsPlayerButton.addEventListener('click', () => {
  gameMode = 'vsPlayer';
  document.getElementById('player1').disabled = false;
  document.getElementById('player2').disabled = false;
  startButton.disabled = false; // Habilita o botão "Play"
  Swal.fire({
    title: "Vamos lá",
    text: "Jogador vs Jogador que vença o melhor!",
    imageUrl: "imagens/maos.jpg",
    imageWidth: 100,
    imageHeight: 100,
    imageAlt: "Custom image",
    customClass: {
      confirmButton: 'custom-confirm-button'
    }
  });
});


// <***************************************************************************>
// MODAL QR CODE
const qrCodeModal = document.getElementById('qrCodeModal');
const closeQRModal = document.getElementById('closeQR');

document.getElementById("btnQrCode").addEventListener("click", function () {
  qrCodeModal.style.display = "flex"; // Alterado para 'flex' para centralizar
});

// Fechar o modal quando clicar fora dele
window.addEventListener("click", function (event) {
  if (event.target === qrCodeModal) {
    qrCodeModal.style.display = "none";
  }
});

// Fechar o modal ao clicar no "X"
closeQRModal.addEventListener('click', () => {
  qrCodeModal.style.display = 'none';
});

// <***************************************************************************>

function updateTitle() {
  const playerInput = document.getElementById(turnPlayer);
  if (gameMode === 'vsIA') {
    document.getElementById('turnPlayer').innerText = turnPlayer === 'player1' ? 'Jogador' : 'IA';
  } else {
    document.getElementById('turnPlayer').innerText = playerInput.value;
  }
}

function initializeGame() {
  const player1Name = document.getElementById('player1').value;
  const player2Name = document.getElementById('player2').value;

  // Verificar se os nomes estão preenchidos para "Jogador vs Jogador"
  if (gameMode === 'vsPlayer' && (!player1Name || !player2Name)) {
    alert('Por favor, preencha o nome dos dois jogadores.');
    return;
  }

  vBoard = [['', '', ''], ['', '', ''], ['', '', '']];
  turnPlayer = 'player1';
  document.querySelector('h2').innerHTML = 'Vez de: <span id="turnPlayer"></span>';
  updateTitle();
  boardRegions.forEach(function (element) {
    element.classList.remove('win');
    element.innerText = '';
    element.classList.add('cursor-pointer');
    element.addEventListener('click', handleBoardClick);
  });

  // Adicione esta lógica para fazer a IA jogar primeiro no modo "insano"
  if (gameMode === 'vsIA' && aiDifficulty === 'insane') {
    setTimeout(() => {
      aiMove(); // A IA faz o primeiro movimento
    }, 500);
  }
}

function getWinRegions() {
  const winRegions = [];
  // HORIZONTAL
  if (vBoard[0][0] && vBoard[0][0] === vBoard[0][1] && vBoard[0][0] === vBoard[0][2])
    winRegions.push('0.0', '0.1', '0.2');
  if (vBoard[1][0] && vBoard[1][0] === vBoard[1][1] && vBoard[1][0] === vBoard[1][2])
    winRegions.push('1.0', '1.1', '1.2');
  if (vBoard[2][0] && vBoard[2][0] === vBoard[2][1] && vBoard[2][0] === vBoard[2][2])
    winRegions.push('2.0', '2.1', '2.2');

  //  VERTICAL
  if (vBoard[0][0] && vBoard[0][0] === vBoard[1][0] && vBoard[0][0] === vBoard[2][0])
    winRegions.push('0.0', '1.0', '2.0');
  if (vBoard[0][1] && vBoard[0][1] === vBoard[1][1] && vBoard[0][1] === vBoard[2][1])
    winRegions.push('0.1', '1.1', '2.1');
  if (vBoard[0][2] && vBoard[0][2] === vBoard[1][2] && vBoard[0][2] === vBoard[2][2])
    winRegions.push('0.2', '1.2', '2.2');

  // DIAGONAL
  if (vBoard[0][0] && vBoard[0][0] === vBoard[1][1] && vBoard[0][0] === vBoard[2][2])
    winRegions.push('0.0', '1.1', '2.2');
  if (vBoard[0][2] && vBoard[0][2] === vBoard[1][1] && vBoard[0][2] === vBoard[2][0])
    winRegions.push('0.2', '1.1', '2.0');

  return winRegions;
}

function disableRegion(element) {
  element.classList.remove('cursor-pointer');
  element.removeEventListener('click', handleBoardClick);
}

function handleWin(regions) {
  regions.forEach(function (region) {
    document.querySelector('[data-region="' + region + '"]').classList.add('win');
  });
  
  // Verifica o vencedor com base no símbolo no tabuleiro
  const winnerSymbol = vBoard[regions[0].split('.')[0]][regions[0].split('.')[1]];
  
  let playerName = '';
  if (gameMode === 'vsIA') {
    playerName = winnerSymbol === 'X' ? 'Jogador' : 'IA';
  } else {
    playerName = winnerSymbol === 'X' ? document.getElementById('player1').value : document.getElementById('player2').value;
  }
  
  document.querySelector('h2').innerHTML = playerName + ' venceu!';
  Swal.fire({
    title: "Parabéns!",
    text: playerName + " foi o vencedor!",
    icon: "success"
  });
  blockBoard();
}

// *********************************************************************************************** //
// Adição da função findWinningMove para corrigir o erro

function findWinningMove(playerSymbol) {
  for (let i = 0; i < boardRegions.length; i++) {
    const region = boardRegions[i];
    const rowColPair = region.dataset.region.split('.');
    const row = rowColPair[0];
    const column = rowColPair[1];

    if (vBoard[row][column] === '') {
      vBoard[row][column] = playerSymbol;
      const winRegions = getWinRegions();
      vBoard[row][column] = ''; // Reset após verificar

      if (winRegions.length > 0) {
        return region;
      }
    }
  }
  return null;
}

// *********************************************************************************************** //

// Lógica para a IA
function aiMove() {
  if (aiDifficulty === 'easy') {
    easyAiMove();
  } else if (aiDifficulty === 'medium') {
    mediumAiMove();
  } else if (aiDifficulty === 'hard' || aiDifficulty === 'insane') {
    hardAiMove();
  }
}

function easyAiMove() {
  let emptyRegions = Array.from(boardRegions).filter(region => {
    const rowColPair = region.dataset.region.split('.');
    const row = rowColPair[0];
    const column = rowColPair[1];
    return vBoard[row][column] === '';
  });

  const randomIndex = Math.floor(Math.random() * emptyRegions.length);
  const chosenRegion = emptyRegions[randomIndex];
  chosenRegion.click();
}

function mediumAiMove() {
  // Tenta bloquear o jogador
  let blockingMove = findWinningMove('X');
  if (blockingMove) {
    blockingMove.click();
    return;
  }

  // Senão, faz movimento fácil
  easyAiMove();
}

function hardAiMove() {
  // Tenta vencer primeiro
  let winningMove = findWinningMove('O');
  if (winningMove) {
    winningMove.click();
    return;
  }

  // Se não puder vencer, usa a lógica do modo médio para bloquear
  mediumAiMove();
}

function blockBoard() {
  boardRegions.forEach(function (element) {
    element.classList.remove('cursor-pointer');
    element.removeEventListener('click', handleBoardClick);
  });
}

function handleBoardClick(ev) {
  const span = ev.currentTarget;
  const region = span.dataset.region;
  const rowColPair = region.split('.');
  const row = rowColPair[0];
  const column = rowColPair[1];

  if (turnPlayer === 'player1') {
    span.innerText = 'X';
    vBoard[row][column] = 'X';
  } else {
    span.innerText = 'O';
    vBoard[row][column] = 'O';
  }

  disableRegion(span);

  const winRegions = getWinRegions();
  if (winRegions.length > 0) {
    handleWin(winRegions);
  } else if (vBoard.flat().includes('') === false) {
    document.querySelector('h2').innerHTML = 'Empate!';
    Swal.fire({
      title: "Empate!",
      text: "O jogo terminou empatado.",
      icon: "info"
    });
    blockBoard();
  } else {
    turnPlayer = turnPlayer === 'player1' ? 'player2' : 'player1';
    updateTitle();

    if (gameMode === 'vsIA' && turnPlayer === 'player2') {
      setTimeout(() => {
        aiMove();
      }, 500);
    }
  }
}

document.getElementById('start').addEventListener('click', initializeGame);


function handleBoardClick(ev) {
  const span = ev.currentTarget;
  const region = span.dataset.region;
  const rowCollumPair = region.split('.');
  const row = rowCollumPair[0];
  const column = rowCollumPair[1];

  if (vBoard[row][column] === '') {
    if (turnPlayer === 'player1') {
      span.innerText = 'X';
      vBoard[row][column] = 'X';
    } else {
      span.innerText = 'O';
      vBoard[row][column] = 'O';
    }
    disableRegion(span);
    const winRegions = getWinRegions();
    if (winRegions.length > 0) {
      handleWin(winRegions);
    } else if (vBoard.flat().indexOf('') === -1) {
      document.querySelector('h2').innerHTML = 'Empate!'
      Swal.fire({
        title: "Ooops!",
        text:  " Deu velha!",
        icon: "warning"
      })
      blockBoard()
    } else {
      turnPlayer = turnPlayer === 'player1' ? 'player2' : 'player1';
      updateTitle();

      if (gameMode === 'vsIA' && turnPlayer === 'player2') {
        setTimeout(aiMove, 500); // IA joga após um pequeno atraso
      }
    }
  }
}

// Função para bloquear o tabuleiro após a vitória ou empate
function blockBoard() {
    boardRegions.forEach(function (element) {
      element.classList.remove('cursor-pointer');
      element.removeEventListener('click', handleBoardClick);
    });
}

// Inicializar o jogo ao clicar em "PLAY"
startButton.addEventListener('click', () => {
  if (!gameMode) {
    alert('Por favor, escolha um modo de jogo.');
  } else {
    initializeGame();
  }
});

window.addEventListener('load', function() {
    qrCodeModal.style.display = 'none';
});