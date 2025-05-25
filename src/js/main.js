const moviesGrid = document.getElementById("movies-grid");
const movieInput = document.getElementById("movie-input");
const btnSearchMovie = document.getElementById("search-movie-submit");
const pagination = document.getElementById("pagination");
const toggleBtn = document.querySelector("#toggle-theme");
const themeIcon = toggleBtn.querySelector("img");
const dialogSelectedMovie = document.getElementById("selected-movie");
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

async function fetchMovieDetails(id) {
    try {
        const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}`);
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Erro ao buscar filme selecionado:", error);
        moviesGrid.innerHTML = `<p class='text-[#c4c4c4]'>Erro ao buscar filme selecionado. Tente novamente.</p>`;
    }
}

function renderResults(movies) {
    moviesGrid.innerHTML = "";
    movies.forEach((movie) => {
        const card = document.createElement("button");
        card.className = "bg-[#1c1917] text-white p-3 rounded-md flex flex-col items-center gap-2 cursor-pointer";

        const poster = movie.Poster;

        card.innerHTML = `
      <img src="${poster}" alt="${movie.Title}" class="w-full h-[300px] object-fit rounded">
      <h3 class="text-lg font-bold text-center">${movie.Title}</h3>
      <p class="text-sm text-[#c4c4c4]">${movie.Year} • ${movie.Type}</p>
    `;

        moviesGrid.appendChild(card);

        card.addEventListener('click', async () => {
            const selectedMovie = movie.imdbID;
            const data = await fetchMovieDetails(selectedMovie);

            dialogSelectedMovie.classList.remove("hidden");
            dialogSelectedMovie.innerHTML = `
  <div class="bg-[#1c1917] text-white p-6 rounded-xl shadow-xl max-w-lg w-full">
    <img src="${data.Poster}" alt="${data.Title}" class="rounded max-h-[400px] object-cover mx-auto mb-4">
    <h2 class="text-2xl font-bold mb-2">${data.Title}</h2>
    <p class="mb-1"><strong>Ano:</strong> ${data.Year}</p>
    <p class="mb-1"><strong>Duração:</strong> ${data.Runtime}</p>
    <p class="mb-1"><strong>Lançamento:</strong> ${data.Released}</p>
    <p class="mb-1"><strong>Classificação:</strong> ${data.Rated}</p>
    <p class="mb-4"><strong>Sinopse:</strong> ${data.Plot}</p>
    <button id="close-modal" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded self-end block ml-auto">
      Fechar
    </button>
  </div>
`;
            dialogSelectedMovie.addEventListener("click", e => {
                if (e.target === dialogSelectedMovie) {
                    dialogSelectedMovie.classList.add("hidden")
                }
            })

            document.getElementById("close-modal").addEventListener("click", () => {
                dialogSelectedMovie.classList.add("hidden");
            });
        });
    })

}

function initPagination(total) {
    const totalPages = Math.ceil(total / 10);

    pagination.innerHTML = `
    <button id="previous-page" class="bg-[#ff1d1d] w-28 h-[50px] rounded-md flex items-center justify-center text-white hover:bg-[#b91c1c] transition-colors duration-200 cursor-pointer">Anterior</button>
    <span class="bg-[#ff1d1d] w-fit p-3 gap-2 h-[50px] rounded-md flex items-center justify-center !text-white font-medium">Página ${currentPage} de ${totalPages}</span>
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