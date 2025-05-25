const moviesGrid = document.getElementById("movies-grid");
const movieInput = document.getElementById("movie-input");
const btnSearchMovie = document.getElementById("search-movie-submit");
const pagination = document.getElementById("pagination");
const toggleBtn = document.querySelector('#toggle-theme');
const themeIcon = toggleBtn.querySelector('img');
let currentPage = 1;
let lastSearch = "";

// DEFINIÇÃO DO LIGHT/DARK MODE

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark');
    themeIcon.src = 'assets/moon-light.png'
} else {
    document.documentElement.classList.remove('dark');
    themeIcon.src = 'assets/moon.png'
}

toggleBtn.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    themeIcon.src = isDark ? 'assets/moon-light.png' : 'assets/moon.png';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

//CONEXAO A API DO OMDB!!!
const API_KEY = "410ea29c";

btnSearchMovie.addEventListener('click', () => {
    const enteredValue = movieInput.value.trim();
    currentPage = 1;
    lastSearch = enteredValue;
    fetchResults(lastSearch, currentPage);
});

async function fetchResults(term, page) {
    try {
        moviesGrid.innerHTML = "<p class='text-white'>Carregando...</p>";
        const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(term)}&page=${page}`);
        const data = await res.json();

        if (data.Response === "False") {
            moviesGrid.innerHTML = `<p class='text-[#c4c4c4]'>Nenhum resultado encontrado para "${enteredValue}".</p>`;
            return;
        }

        const total = parseInt(data.totalResults);
        renderResults(data.Search);

        if (total > 10) {
            initPagination(total);
        }

    } catch (error) {
        console.error("Erro ao buscar filmes:", error);
        moviesGrid.innerHTML = `<p class='text-[#c4c4c4]'>Erro ao buscar filmes. Tente novamente.</p>`;
    }
};

function renderResults(movies) {
    moviesGrid.innerHTML = "";
    movies.forEach((movie) => {
        const card = document.createElement("div");
        card.className = "bg-[#1c1917] text-white p-3 rounded-md flex flex-col items-center gap-2";

        const poster = movie.Poster !== "N/A" ? movie.Poster : "assets/fallback.jpg";

        card.innerHTML = `
      <img src="${poster}" alt="${movie.Title}" class="w-full h-[300px] object-fit rounded">
      <h3 class="text-lg font-bold text-center">${movie.Title}</h3>
      <p class="text-sm text-[#c4c4c4]">${movie.Year} • ${movie.Type}</p>
    `;

        moviesGrid.appendChild(card);
    })
}

function initPagination(total) {
    const totalPages = Math.ceil(total / 10);

    pagination.innerHTML = `
    <button id="previous-page" class="bg-[#ff1d1d] w-28 h-[50px] rounded-md flex items-center justify-center text-white hover:bg-[#b91c1c] transition-colors duration-200 cursor-pointer">Anterior</button>
    <span class="bg-[#ff1d1d] w-24 h-[50px] rounded-md flex items-center justify-center !text-white font-medium">Página ${currentPage}</span>
    <button id="next-page" class="bg-[#ff1d1d] w-28 h-[50px] rounded-md flex items-center justify-center text-white hover:bg-[#b91c1c] transition-colors duration-200 cursor-pointer">Próxima</button>
  `;

    const previousPage = document.getElementById("previous-page");
    const nextPage = document.getElementById("next-page");

    if (currentPage === 1) {
        previousPage.remove();
    }

    if (currentPage === totalPages) {
        nextPage.remove();
    }

    previousPage.addEventListener("click", () => {

        if (currentPage > 1) {
            currentPage--;
            fetchResults(lastSearch, currentPage);
        }
    });

    nextPage.addEventListener("click", () => {
        if (currentPage < totalPages) {
            currentPage++;
            fetchResults(lastSearch, currentPage);
        }
    });
}