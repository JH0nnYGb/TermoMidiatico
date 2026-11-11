// ===== 1. LISTA DE PALAVRAS (sem acento) =====
// Pode misturar palavras de tamanhos diferentes: a grade se ajusta sozinha!
var palavras = [
  { palavra: "fake news", dica: "Notícias falsas criadas ou compartilhadas para enganar as pessoas" },
  { palavra: "desinformaçao", dica: "Informação falsa ou enganosa divulgada para confundir as pessoas" },
  { palavra: "checagem", dica: "Processo de verificar se uma informação é verdadeira" },
  { palavra: "fonte", dica: "Local ou pessoa de onde uma informação foi obtida" },
  { palavra: "algoritmo", dica: "Conjunto de instruções que ajuda as plataformas a selecionar o que aparece para você" },
  { palavra: "bolha informacional", dica: "Quando uma pessoa recebe principalmente conteúdos parecidos com suas opiniões" },
  { palavra: "privacidade", dica: "Direito de controlar o acesso às suas informações pessoais" },
  { palavra: "ciberbullying", dica: "Prática de intimidar ou humilhar alguém por meios digitais" },
  { palavra: "clickbait", dica: "Título chamativo criado para despertar curiosidade e conseguir cliques" },
  { palavra: "viralizaçao", dica: "Quando um conteúdo se espalha rapidamente pela internet" },
  { palavra: "plagio", dica: "Utilizar o trabalho ou as ideias de outra pessoa sem dar os devidos créditos" },
  { palavra: "direitos autorais", dica: "Direitos que protegem quem criou uma obra ou conteúdo" },
  { palavra: "mídia", dica: "Meio utilizado para transmitir informações, como televisão, rádio e internet" },
  { palavra: "influenciador", dica: "Pessoa que utiliza sua presença nas redes sociais para influenciar outras pessoas" },
  { palavra: "propaganda", dica: "Conteúdo criado para divulgar um produto, serviço ou ideia" },
  { palavra: "discurso de ódio", dica: "Manifestação que promove preconceito, intolerância ou violência contra pessoas ou grupos" },
  { palavra: "letramento digital", dica: "Capacidade de utilizar tecnologias digitais de maneira crítica, segura e consciente" },
  { palavra: "desconexao", dica: "Ato de se afastar temporariamente dos dispositivos e ambientes digitais" },
  { palavra: "phishing", dica: "Golpe digital que tenta roubar dados pessoais por meio de mensagens ou páginas falsas" },
  { palavra: "inteligencia artificial", dica: "Tecnologia capaz de realizar tarefas que normalmente exigiriam habilidades humanas" }
];

// ===== 2. VARIÁVEIS DO JOGO (guardam o estado) =====
var palavraSecreta;     // a palavra que precisa ser descoberta
var palavraOriginal    // variavel para remover os espacamentos
var posicaoDoEspaco     // depois de qual quadrado existe uma lacuna
var tentativa;          // número da linha atual (0 a 5)
var letrasDigitadas;    // o que a pessoa já digitou na linha atual
var tamanho;            // quantas letras tem a palavra secreta (= quadradinhos por linha)
var jogoAcabou;
var dicaAtual;
var dicasUsadas;

var DICAS_MAX = 2;

var TENTATIVAS_MAX = 6;

// ===== 3. DESENHAR A GRADE E O TECLADO =====
function criarGrade() {
  var grade = document.getElementById("grade");
  grade.innerHTML = "";
  for (var l = 0; l < TENTATIVAS_MAX; l++) {
    var linha = document.createElement("div");
    linha.className = "linha";
    for (var c = 0; c < tamanho; c++) {
      var caixa = document.createElement("div");
      caixa.className = "letra";
      if (posicaoDoEspaco.indexOf(c) !== -1) {  
        caixa.classList.add("fim-palavra");
      }
      linha.appendChild(caixa);
    }
    grade.appendChild(linha);
  }
}

function criarTeclado() {
  var teclado = document.getElementById("teclado");
  teclado.innerHTML = "";
  "qwertyuiopasdfghjklzxcvbnm".split("").forEach(function (letra) {
    var b = document.createElement("button");
    b.textContent = letra.toUpperCase();
    b.onclick = function () { apertouTecla(letra); };
    teclado.appendChild(b);
  });
  var apagar = document.createElement("button");
  apagar.textContent = "⌫";
  apagar.className = "grande";
  apagar.onclick = function () { apertouTecla("Backspace"); };
  teclado.appendChild(apagar);
  var enviar = document.createElement("button");
  enviar.textContent = "Enviar";
  enviar.className = "grande";
  enviar.onclick = function () { apertouTecla("Enter"); };
  teclado.appendChild(enviar);
}

// Pega a caixinha da linha/coluna pedida
function pegarCaixa(linha, coluna) {
  return document.getElementById("grade").children[linha].children[coluna];
}

// ===== 4. TECLAS =====
function apertouTecla(tecla) {
  if (jogoAcabou) return;

  if (tecla === "Enter") {
    if (letrasDigitadas.length === tamanho) enviarPalavra();
    else mostrar("Digite " + tamanho + " letras!");
  } else if (tecla === "Backspace") {
    letrasDigitadas = letrasDigitadas.slice(0, -1);
  } else if (/^[a-z]$/.test(tecla) && letrasDigitadas.length < tamanho) {
    letrasDigitadas += tecla;
  }
  atualizarLinhaAtual();
}

// Mostra na tela as letras que a pessoa está digitando
function atualizarLinhaAtual() {
  for (var c = 0; c < tamanho; c++) {
    pegarCaixa(tentativa, c).textContent = letrasDigitadas[c] || "";
  }
}

// Teclado do computador
document.addEventListener("keydown", function (e) {
  apertouTecla(e.key.length === 1 ? e.key.toLowerCase() : e.key);
});

// ===== 5. CONFERIR A PALAVRA =====
function enviarPalavra() {
  var chute = letrasDigitadas;
  var cores = [];
  for (var n = 0; n < tamanho; n++) {
    cores.push("errada");
  }
  var sobrando = palavraSecreta.split(""); // letras da secreta ainda não "usadas"

  // Primeiro: letras no lugar certo (verde)
  for (var i = 0; i < tamanho; i++) {
    if (chute[i] === palavraSecreta[i]) {
      cores[i] = "certa";
      sobrando[i] = null;
    }
  }
  // Depois: letras que existem, mas em outro lugar (amarelo)
  for (var j = 0; j < tamanho; j++) {
    if (cores[j] !== "certa" && sobrando.indexOf(chute[j]) !== -1) {
      cores[j] = "lugar";
      sobrando[sobrando.indexOf(chute[j])] = null;
    }
  }
  // Pinta as caixinhas
  for (var k = 0; k < tamanho; k++) {
    pegarCaixa(tentativa, k).classList.add(cores[k]);
  }

  // Acertou?
  if (chute === palavraSecreta) {
    document.getElementById("conteudo").classList.remove("borrado"); // tira o blur
    terminar("🎉 Você acertou! Conteúdo liberado!");
    return;
  }

  // Errou: vai para a próxima linha
  tentativa = tentativa + 1;
  letrasDigitadas = "";

  if (tentativa === TENTATIVAS_MAX) {
    terminar("😵 Acabaram as tentativas! A palavra era: " + palavraOriginal.toUpperCase());
  } else {
    mostrar("Errou! Tente de novo.");
  }
}

function mostrar(texto) {
  document.getElementById("mensagem").textContent = texto;
}

function terminar(texto) {
  jogoAcabou = true;
  mostrar(texto);
}

// ===== 6. COMEÇAR UM JOGO NOVO =====
function novoJogo() {
  var sorteada = palavras[Math.floor(Math.random() * palavras.length)];
  var palavraSeparada= sorteada.palavra.split(" ");

  palavraOriginal = sorteada.palavra;
  palavraSecreta = palavraSeparada.join("")
  dicaAtual = sorteada.dica;         // pega só a dica
  dicasUsadas = 0;


  // guarda depois de qual letra vem um espaço
  posicaoDoEspaco = [];
  var soma = 0;
  for(var p = 0; p < palavraSeparada.length - 1; p++){
    soma = soma + palavraSeparada[p].length;
    posicaoDoEspaco.push(soma - 1);
  }
  
  tentativa = 0;
  tamanho = palavraSecreta.length;   // conta as letras da palavra sorteada
  letrasDigitadas = "";
  jogoAcabou = false;

  document.getElementById("dica").textContent = "";
  document.getElementById("botao-dica").textContent = "💡 Dica (" + DICAS_MAX + ")";

  document.getElementById("conteudo").classList.add("borrado"); // borra de novo
  criarGrade();
  criarTeclado();
  mostrar("Descubra a palavra de " + tamanho + " letras!");
}

// ============ 7.DICA DA PALAVRA =============
function pedirDica() {
  document.getElementById("botao-dica").blur();   // tira o foco do botão
  if (jogoAcabou) return;

  if (dicasUsadas >= DICAS_MAX) {
    mostrar("Acabaram as dicas!");
    return;
  }

  dicasUsadas += 1
  var texto = "💡 " + dicaAtual;
  if (dicasUsadas === 2) {
    texto = texto + " | Começa com " + palavraSecreta[0].toUpperCase();
  }

  document.getElementById("dica").textContent = texto;
  document.getElementById("botao-dica").textContent =
    "💡 Dica (" + (DICAS_MAX - dicasUsadas) + ")";  
}

// 

// começa um novo jogo ao clicar no botão novo jogo
document.getElementById("botao-novo").onclick = novoJogo;
document.getElementById("botao-dica").onclick = pedirDica;

// começa um novo jogo sempre que a página recarregar
novoJogo();
