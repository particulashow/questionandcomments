const params = new URLSearchParams(window.location.search);
const questionText = params.get('question') || 'Qual a tua palavra favorita?';
const domain = params.get('domain') || 'http://localhost:3900';

document.getElementById('question').innerText = questionText;

const cloud = document.getElementById('comment-cloud');
const wordsMap = {};

function addWord(word, count) {
  if (wordsMap[word]) {
    const el = wordsMap[word];
    el.style.fontSize = (24 + count * 5) + 'px';
  } else {
    const el = document.createElement('div');
    el.className = 'word';
    el.innerText = word;

    const maxWidth = cloud.offsetWidth - 150;
    const maxHeight = cloud.offsetHeight - 50;

    el.style.left = Math.random() * maxWidth + 'px';
    el.style.top = Math.random() * maxHeight + 'px';
    el.style.fontSize = (24 + count * 5) + 'px';

    cloud.appendChild(el);
    wordsMap[word] = el;
  }
}

function fetchData() {
  fetch(`${domain}/wordcloud`)
    .then(response => response.json())
    .then(data => {
      const chatHistory = (data.wordcloud || "")
        .toLowerCase()
        .split(',')
        .map(w => w.trim())
        .filter(w => w.length > 0);

      const countMap = {};

      chatHistory.forEach(word => {
        countMap[word] = (countMap[word] || 0) + 1;
      });

      Object.entries(countMap).forEach(([word, count]) => {
        addWord(word, count);
      });
    })
    .catch(error => console.error('Erro ao buscar dados:', error));
}

setInterval(fetchData, 1500);

fetch(`${domain}/clear-chat`)
  .then(() => setTimeout(fetchData, 500));
