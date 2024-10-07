// A implementação da IA para o jogo da velha está baseada em uma rede neural sequencial. Com as 9 células do tabuleiro representando o estado atual, a rede tenta prever a próxima jogada como uma probabilidade de qual célula jogar.

// Aqui está como o modelo funciona:

// Entrada: Um vetor de 9 posições representando o estado do tabuleiro.
// Camadas ocultas: Três camadas densas (128, 64 e 32 unidades) com função de ativação relu para aprender as possíveis combinações de jogadas.
// Saída: Um vetor de 9 neurônios que indica a probabilidade de cada célula ser a próxima jogada, com função de ativação softmax para obter uma distribuição de probabilidades.


class JogoDaVelha {
    constructor(dificuldade) {
      this.tabuleiro = Array(9).fill(null);
      this.jogadorAtual = 'X'; // 'X' é o jogador, 'O' é a IA
      this.dificuldade = dificuldade; // 'facil', 'normal', 'insano'
      
      // Inicia o jogo
      this.iniciarJogo();
    }
  
    // Método para iniciar o jogo
    iniciarJogo() {
      if (this.dificuldade === 'insano') {
        this.fazerJogadaIA(); // A IA faz a primeira jogada
      }
    }
  
    // Método para checar se o jogo terminou
    checarVencedor() {
      const combinacoes = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
      ];
  
      for (const [a, b, c] of combinacoes) {
        if (this.tabuleiro[a] && this.tabuleiro[a] === this.tabuleiro[b] && this.tabuleiro[a] === this.tabuleiro[c]) {
          return this.tabuleiro[a]; // Retorna 'X' ou 'O'
        }
      }
      return this.tabuleiro.includes(null) ? null : 'Empate'; // Retorna null se ainda estiver jogando
    }
  
    // Algoritmo Minimax com Poda Alpha-Beta
    minimax(tabuleiro, profundidade, alpha, beta, maximizando) {
      const vencedor = this.checarVencedor();
      if (vencedor === 'X') return -10 + profundidade; // jogador perde
      if (vencedor === 'O') return 10 - profundidade; // IA ganha
      if (vencedor === 'Empate') return 0; // Empate
  
      if (maximizando) {
        let melhorValor = -Infinity;
        for (let i = 0; i < tabuleiro.length; i++) {
          if (tabuleiro[i] === null) {
            tabuleiro[i] = 'O'; // IA joga
            const valor = this.minimax(tabuleiro, profundidade + 1, alpha, beta, false);
            tabuleiro[i] = null; // desfaz jogada
            melhorValor = Math.max(melhorValor, valor);
            alpha = Math.max(alpha, valor);
            if (beta <= alpha) break; // Poda
          }
        }
        return melhorValor;
      } else {
        let melhorValor = Infinity;
        for (let i = 0; i < tabuleiro.length; i++) {
          if (tabuleiro[i] === null) {
            tabuleiro[i] = 'X'; // Jogador joga
            const valor = this.minimax(tabuleiro, profundidade + 1, alpha, beta, true);
            tabuleiro[i] = null; // desfaz jogada
            melhorValor = Math.min(melhorValor, valor);
            beta = Math.min(beta, valor);
            if (beta <= alpha) break; // Poda
          }
        }
        return melhorValor;
      }
    }
  
    // Método para a IA fazer a jogada
    fazerJogadaIA() {
      let melhorJogada;
      let melhorValor = -Infinity;
  
      for (let i = 0; i < this.tabuleiro.length; i++) {
        if (this.tabuleiro[i] === null) {
          this.tabuleiro[i] = 'O'; // IA joga
          const valor = this.minimax(this.tabuleiro, 0, -Infinity, Infinity, false);
          this.tabuleiro[i] = null; // desfaz jogada
  
          if (valor > melhorValor) {
            melhorValor = valor;
            melhorJogada = i;
          }
        }
      }
  
      this.tabuleiro[melhorJogada] = 'O'; // IA realiza a melhor jogada
      this.jogadorAtual = 'X'; // Passa a vez para o jogador
    }
  
    // Método para o jogador fazer sua jogada
    fazerJogadaJogador(posicao) {
      if (this.tabuleiro[posicao] === null) {
        this.tabuleiro[posicao] = 'X'; // Jogador joga
        this.jogadorAtual = 'O'; // Passa a vez para a IA
        this.checarVencedor(); // Checa se o jogo terminou
        if (this.dificuldade === 'insano') {
          this.fazerJogadaIA(); // Se for insano, a IA joga novamente
        }
      }
    }
  }
  
  // Exemplo de uso
  const jogo = new JogoDaVelha('insano');
  