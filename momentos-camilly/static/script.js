// Imagens como dados Base64 para evitar problemas de carregamento
const moments = [
  {
    id: 1,
    imageBase64: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNTAwIiB2aWV3Qm94PSIwIDAgNDAwIDUwMCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2ZmNmI2YiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGFsaWdubWVudC1iYXNlbGluZT0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSI+Um9zZXM8L3RleHQ+PC9zdmc+'
  },
  {
    id: 2,
    imageBase64: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNTAwIiB2aWV3Qm94PSIwIDAgNDAwIDUwMCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2ZiOWMyZiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGFsaWdubWVudC1iYXNlbGluZT0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSI+SGVhcnQ8L3RleHQ+PC9zdmc+'
  },
  {
    id: 3,
    imageBase64: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNTAwIiB2aWV3Qm94PSIwIDAgNDAwIDUwMCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzRmYzNmNyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGFsaWdubWVudC1iYXNlbGluZT0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSI+RnVuPC90ZXh0Pjwvc3ZnPg=='
  },
  {
    id: 4,
    imageBase64: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNTAwIiB2aWV3Qm94PSIwIDAgNDAwIDUwMCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzJlY2M3MSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGFsaWdubWVudC1iYXNlbGluZT0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSI+U21pbGU8L3RleHQ+PC9zdmc+'
  },
  {
    id: 5,
    imageBase64: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNTAwIiB2aWV3Qm94PSIwIDAgNDAwIDUwMCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2E1NjJmZiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGFsaWdubWVudC1iYXNlbGluZT0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSI+Q3V0ZTwvdGV4dD48L3N2Zz4='
  }
];

// Elementos DOM
const typingContainer = document.getElementById('typing-container');
const typingText = document.getElementById('typing-text');
const cardContainer = document.getElementById('card-container');
const cardsElement = document.getElementById('cards');
const nopeButton = document.getElementById('nope-button');
const likeButton = document.getElementById('like-button');
const endMessage = document.getElementById('end-message');
const restartButton = document.getElementById('restart-button');
const whatsappButton = document.getElementById('whatsapp-button');

// Estado da aplicação
let momentsCopy = [...moments];
let currentCardIndex = 0;

// Função para simular digitação
function typeMessage(text, speed = 50) {
  let i = 0;
  typingContainer.style.display = 'flex';
  typingText.textContent = '';
  
  const typing = setInterval(() => {
    if (i < text.length) {
      typingText.textContent += text.charAt(i);
      i++;
    } else {
      clearInterval(typing);
      // Após completar a digitação, mostrar os cards depois de um atraso
      setTimeout(() => {
        typingContainer.classList.add('hidden');
        cardContainer.classList.remove('hidden');
        initializeCards();
      }, 1000);
    }
  }, speed);
}

// Inicializar os cards
function initializeCards() {
  cardsElement.innerHTML = '';
  currentCardIndex = 0;
  momentsCopy = [...moments];
  
  // Criar e adicionar cards em ordem inversa
  for (let i = momentsCopy.length - 1; i >= 0; i--) {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.backgroundImage = `url(${momentsCopy[i].imageBase64})`;
    card.dataset.id = momentsCopy[i].id;
    cardsElement.appendChild(card);
  }
}

// Swipe para a esquerda (não gostou)
function swipeLeft() {
  if (momentsCopy.length === 0) return;
  
  const card = cardsElement.querySelector('.card:last-child');
  card.classList.add('exit-left');
  
  setTimeout(() => {
    card.remove();
    momentsCopy.shift();
    checkIfCardsEmpty();
  }, 500);
}

// Swipe para a direita (gostou)
function swipeRight() {
  if (momentsCopy.length === 0) return;
  
  const card = cardsElement.querySelector('.card:last-child');
  card.classList.add('exit-right');
  
  setTimeout(() => {
    card.remove();
    momentsCopy.shift();
    checkIfCardsEmpty();
  }, 500);
}

// Verificar se os cards acabaram
function checkIfCardsEmpty() {
  if (momentsCopy.length === 0) {
    cardContainer.classList.add('hidden');
    endMessage.classList.remove('hidden');
  }
}

// Reiniciar aplicativo
function restartApp() {
  endMessage.classList.add('hidden');
  typingContainer.classList.remove('hidden');
  typeMessage('Impossível você saber quem fez isso, moied', 50);
}

// Abrir WhatsApp
function openWhatsApp() {
  window.open('https://wa.me/5514998267367?text=Adorei%20reviver%20nossos%20momentos%20especiais!%20❤️', '_blank');
}

// Event listeners
nopeButton.addEventListener('click', swipeLeft);
likeButton.addEventListener('click', swipeRight);
restartButton.addEventListener('click', restartApp);
whatsappButton.addEventListener('click', openWhatsApp);

// Iniciar aplicativo
typeMessage('Impossível você saber quem fez isso, moied', 50);
