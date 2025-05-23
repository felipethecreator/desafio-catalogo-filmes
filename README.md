# movieFlix 🎬

Aplicação web desenvolvida como parte do processo seletivo de estágio front-end da empresa CEVICOM.

O objetivo do projeto é simular um catálogo de filmes no estilo Netflix, permitindo buscar por títulos, visualizar detalhes completos e navegar por resultados de forma responsiva. A aplicação foi construída utilizando HTML, CSS e JavaScript puro, consumindo a API pública da OMDb (Open Movie Database).

Este desafio tem como foco avaliar habilidades em:

- Consumo de APIs REST com JavaScript
- Manipulação dinâmica do DOM
- Estruturação semântica de HTML
- Design responsivo para desktop e mobile
- Boas práticas de organização de código

Funcionalidades extras como modal, dark mode e paginação foram implementadas para enriquecer a experiência e demonstrar domínio técnico além do mínimo requerido.

---

## ✨ Funcionalidades

- 🔎 Campo de busca por título
- 🎞️ Listagem com pôster, título, ano e tipo (filme/série/episódio)
- 📱 Layout responsivo estilo Netflix
- 📋 Detalhes completos do filme ao clicar
- 🌑 Dark mode (alternável)
- 🧭 Paginação entre resultados
- ❌ Mensagem de erro se não houver resultados

---

## 🛠️ Tecnologias Utilizadas

- HTML5 + CSS3
- Tailwind CSS
- JavaScript (ES6+)
- OMDb API

---

## 🚀 Como rodar?

### 1. Clone o repositório
```terminal
git clone https://github.com/felipethecreator/desafio-catalogo-filmes.git
cd desafio-catalogo-filmes
```
### 2. Instale as dependências
```terminal
npm install
```
### 3. Inicie o Tailwind em modo watch
Gera o CSS final automaticamente a partir do input.css:
```terminal
npx @tailwindcss/cli -i ./src/input.css -o ./src/output.css --watch
```
### 4. Abra o projeto no navegador
Abra o arquivo:
```
src/index.html
```
Recomendo usar a extensão Live Server do VS Code pra facilitar o reload automático.
