// Declaração de variáveis
/*define variáveis para armazenar a soma das cartas do dealer e do jogador, 
a quantidade de ases em cada mão, a carta escondida do dealer, e o baralho 
(deck). canHit controla se o jogador pode continuar comprando cartas.*/
let dealerSum = 0;
let yourSum = 0;

let dealerAceCount = 0;
let yourAceCount = 0;            

let hidden;
let deck;

let canHit = true; //allows the player (you) to draw while yourSum <= 21

window.onload = function() {
    buildDeck();
    shuffleDeck();
    startGame();
}


/* Esta função constrói um baralho de cartas com 52 cartas, usando os 
valores e os naipes fornecidos. Cada carta é representada como uma string 
no formato "valor-naipes", como "A-C" para Ás de Copas.*/
function buildDeck() {
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    let types = ["C", "D", "H", "S"];
    deck = [];

    for (let i = 0; i < types.length; i++) {
        for (let j = 0; j < values.length; j++) {
            deck.push(values[j] + "-" + types[i]); //A-C -> K-C, A-D -> K-D
        }
    }
    // console.log(deck);
}


/*Esta função embaralha as cartas do baralho, trocando aleatoriamente a posição de cada carta.*/
function shuffleDeck() {
    for (let i = 0; i < deck.length; i++) {
        let j = Math.floor(Math.random() * deck.length); // (0-1) * 52 => (0-51.9999)
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp; 
    }
    console.log(deck);
}


/*Retira uma carta para o dealer que fica escondida.
O dealer continua comprando cartas até que a soma das cartas seja pelo menos 17.
O jogador recebe duas cartas iniciais.
Adiciona ouvintes de eventos para os botões "hit" e "stay".
*/
function startGame() {
    hidden = deck.pop();
    dealerSum += getValue(hidden);
    dealerAceCount += checkAce(hidden);
    // console.log(hidden);
    // console.log(dealerSum);
    while (dealerSum < 17) {
        //<img src="./cards/4-C.png">
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";
        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);
        document.getElementById("dealer-cards").append(cardImg);
    }
    console.log(dealerSum);

    for (let i = 0; i < 2; i++) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";
        yourSum += getValue(card);
        yourAceCount += checkAce(card);
        document.getElementById("your-cards").append(cardImg);
    }

    console.log(yourSum);
    document.getElementById("hit").addEventListener("click", hit);
    document.getElementById("stay").addEventListener("click", stay);

}


/* Se o jogador pode comprar uma carta (canHit é verdadeiro), uma 
nova carta é retirada e adicionada à mão do jogador.
Atualiza a soma das cartas e a contagem de ases do jogador.
Se a soma das cartas exceder 21, o jogador não pode mais comprar cartas.*/
function hit() {
    if (!canHit) {
        return;
    }

    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "./cards/" + card + ".png";
    yourSum += getValue(card);
    yourAceCount += checkAce(card);
    document.getElementById("your-cards").append(cardImg);

    if (reduceAce(yourSum, yourAceCount) > 21) { //A, J, 8 -> 1 + 10 + 8
        canHit = false;
    }

}


/*Ajusta a soma das cartas do dealer e do jogador considerando os ases.
Exibe a carta escondida do dealer.
Determina o resultado do jogo (ganho, perda ou empate) com base nas somas
finais das cartas e exibe a mensagem correspondente.*/
function stay() {
    dealerSum = reduceAce(dealerSum, dealerAceCount);
    yourSum = reduceAce(yourSum, yourAceCount);

    canHit = false;
    document.getElementById("hidden").src = "./cards/" + hidden + ".png";

    let message = "";
    if (yourSum > 21) {
        message = "Você perdeu!";
    }
    else if (dealerSum > 21) {
        message = "Voce ganhou!";
    }
    //both you and dealer <= 21
    else if (yourSum == dealerSum) {
        message = "Empate!";
    }
    else if (yourSum > dealerSum) {
        message = "Você ganhou!";
    }
    else if (yourSum < dealerSum) {
        message = "Você perdeu!";
    }

    document.getElementById("dealer-sum").innerText = dealerSum;
    document.getElementById("your-sum").innerText = yourSum;
    document.getElementById("results").innerText = message;
}


/* Esta função retorna o valor da carta. 
Cartas de face (J, Q, K) valem 10, e o Ás pode valer 11.*/
function getValue(card) {
    let data = card.split("-"); // "4-C" -> ["4", "C"]
    let value = data[0];

    if (isNaN(value)) { //A J Q K
        if (value == "A") {
            return 11;
        }
        return 10;
    }
    return parseInt(value);
}

/*Verifica se a carta é um Ás e retorna 1 se for, caso contrário, retorna 0.*/

function checkAce(card) {
    if (card[0] == "A") {
        return 1;
    }
    return 0;
}


/*Ajusta o valor do Ás de 11 para 1 se a soma exceder 21, para evitar que o 
jogador ou o dealer perca automaticamente por exceder o valor 21.
*/
function reduceAce(playerSum, playerAceCount) {
    while (playerSum > 21 && playerAceCount > 0) {
        playerSum -= 10;
        playerAceCount -= 1;
    }
    return playerSum;
}


//recarregar pagina
event.preventDefault(); //previne o comportamento de refresh da tela
FormData.reset();  //limpa o form