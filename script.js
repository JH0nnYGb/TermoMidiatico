// ===== 1. LISTA DE PALAVRAS (sem acento) =====
// Pode misturar palavras de tamanhos diferentes: a grade se ajusta sozinha!
var palavras = [
  { palavra: "casa",   dica: "Lugar onde a gente mora" },
  { palavra: "bola",   dica: "Usada em vários esportes" },
  { palavra: "gato",   dica: "Animal que mia" },
  { palavra: "janela", dica: "Fica na parede e deixa a luz entrar" }
];

// ===== 2. VARIÁVEIS DO JOGO (guardam o estado) =====
var palavraSecreta;     // a palavra que precisa ser descoberta
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
    terminar("😵 Acabaram as tentativas! A palavra era: " + palavraSecreta.toUpperCase());
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
  palavraSecreta = sorteada.palavra;
  dicaAtual = sorteada.dica;         // pega só a dica
  dicasUsadas = 0;

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

// começa um novo jogo ao clicar no botão novo jogo
document.getElementById("botao-novo").onclick = novoJogo;
document.getElementById("botao-dica").onclick = pedirDica;

// começa um novo jogo sempre que a página recarregar
novoJogo();
