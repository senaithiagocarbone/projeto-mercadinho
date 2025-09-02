const API_URL = 'http://localhost:3000/api/produtos';

const lista = document.getElementById('lista-produtos');
const form = document.getElementById('form');
const nomeInput = document.getElementById('nome');
const precoInput = document.getElementById('preco');

async function carregarProdutos() {
  const res = await fetch(API_URL);
  const produtos = await res.json();

  lista.innerHTML = '';
  produtos.forEach(produto => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${produto.nome} - R$ ${produto.preco.toFixed(2)}
      <button onclick="deletarProduto(${produto.id})">🗑️</button>
    `;
    lista.appendChild(li);
  });
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const nome = nomeInput.value;
  const preco = parseFloat(precoInput.value);

  await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, preco })
  });

  nomeInput.value = '';
  precoInput.value = '';
  carregarProdutos();
});

async function deletarProduto(id) {
  await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  carregarProdutos();
}

carregarProdutos();
