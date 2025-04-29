const params = new URLSearchParams(window.location.search);
const questionText = params.get('question') || 'Qual a tua palavra favorita?';
const domain = params.get('domain') || 'http://localhost:3900';

document.getElementById('question').innerText = questionText;

const cloud = document.getElementById('comment-cloud');
const wordsMap = {};

function addWord(word) {
  if (wordsMap[word]) {
    let el = wordsMap[word];
    let currentSize = parseFloat(window.getComputedStyle(el).fontSize);
    el.style.fontSize = (currentSize + 5) + 'px';
  } else {
    const el = document.createElement('div');
    el.className = 'word';
    el.innerText = word;

    const maxWidth = cloud.offsetWidth - 150;
    const maxHeight = cloud.offsetHeight - 50;

    el.style.left = Math.random() * maxWidth + 'px';
    el.style.top = Math.random() * maxHeight + 'px';

    cloud.appendChild(el);
    wordsMap[word] = el;
  }
}

function fetchData() {
  fetch(`${domain}/wordcloud`)
    .then(response => response.json())
    .then(data => {
      let chatHistory = (data.wordcloud || "").toLowerCase().split(',');

      chatHistory.forEach(word => {
        word = word.trim();
        if (word.length > 0) {
          addWord(word);
        }
      });
    })
    .catch(error => console.error('Erro ao buscar dados:', error));
}

setInterval(fetchData, 1500);

fetch(`${domain}/clear-chat`)
  .then(() => setTimeout(fetchData, 500));
