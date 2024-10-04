const model = tf.sequential();

// Camada de entrada: 9 neurônios (representando o estado atual do tabuleiro)
model.add(tf.layers.dense({
    inputShape: [9], // 9 células no tabuleiro
    units: 128,
    activation: 'relu'
}));

// Camadas intermediárias
model.add(tf.layers.dense({ units: 64, activation: 'relu' }));
model.add(tf.layers.dense({ units: 32, activation: 'relu' }));

// Camada de saída: 9 neurônios (representando as possíveis jogadas)
model.add(tf.layers.dense({
    units: 9,
    activation: 'softmax' // Probabilidade para cada célula
}));

// Compilando o modelo
model.compile({
    optimizer: 'adam',
    loss: 'meanSquaredError', // Ajusta de acordo com os resultados de treinamento
    metrics: ['accuracy']
})