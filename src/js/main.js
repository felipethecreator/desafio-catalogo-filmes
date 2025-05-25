const moviesGrid = document.getElementById("movies-grid");
const movieInput = document.getElementById("movie-input");
const btnSearchMovie = document.getElementById("search-movie-submit");
const pagination = document.getElementById("pagination");
const toggleBtn = document.querySelector("#toggle-theme");
const themeIcon = document.getElementById("theme-icon");
const dialogSelectedMovie = document.getElementById("selected-movie");
let currentPage = 1;
let lastSearch = "";

// DEFINIÇÃO DO LIGHT/DARK MODE
const savedTheme = localStorage.getItem('theme') || 'dark';

function applyTheme(theme) {
    if (theme === 'light') {
        document.documentElement.classList.add('light');
        document.body.classList.add('light');
        themeIcon.src = 'assets/moon-light.png';
        themeIcon.alt = 'Switch to dark mode';
    } else {
        document.documentElement.classList.remove('light');
        document.body.classList.remove('light');
        themeIcon.src = 'assets/moon.png';
        themeIcon.alt = 'Switch to light mode';
    }
}

applyTheme(savedTheme);

toggleBtn.addEventListener('click', () => {
    const isLight = document.documentElement.classList.contains('light');
    const newTheme = isLight ? 'dark' : 'light';
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
});

function openModal() {
    dialogSelectedMovie.classList.remove("hidden");
    document.body.classList.add("modal-open");
}

function closeModal() {
    dialogSelectedMovie.classList.add("hidden");
    document.body.classList.remove("modal-open");
}

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
        const isLight = document.documentElement.classList.contains('light');
        const loadingTextClass = isLight ? 'text-black' : 'text-white';
        moviesGrid.innerHTML = `<p class='${loadingTextClass}'>Carregando...</p>`;
        
        const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(term)}&page=${page}`);
        const data = await res.json();

        if (data.Response === "False") {
            const errorTextClass = isLight ? 'text-gray-600' : 'text-[#c4c4c4]';
            moviesGrid.innerHTML = `<p class='${errorTextClass}'>Nenhum resultado encontrado para "${term}".</p>`;
            return;
        }

        const total = parseInt(data.totalResults);
        renderResults(data.Search);

        if (total > 10) {
            initPagination(total);
        }

    } catch (error) {
        console.error("Erro ao buscar filmes:", error);
        const isLight = document.documentElement.classList.contains('light');
        const errorTextClass = isLight ? 'text-gray-600' : 'text-[#c4c4c4]';
        moviesGrid.innerHTML = `<p class='${errorTextClass}'>Erro ao buscar filmes. Tente novamente.</p>`;
    }
};

async function fetchMovieDetails(id) {
    try {
        const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}`);
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Erro ao buscar filme selecionado:", error);
        const isLight = document.documentElement.classList.contains('light');
        const errorTextClass = isLight ? 'text-gray-600' : 'text-[#c4c4c4]';
        moviesGrid.innerHTML = `<p class='${errorTextClass}'>Erro ao buscar filme selecionado. Tente novamente.</p>`;
    }
}

function renderResults(movies) {
    moviesGrid.innerHTML = "";
    const isLight = document.documentElement.classList.contains('light');
    
    movies.forEach((movie) => {
        const card = document.createElement("button");
        
        const cardClasses = isLight 
            ? "movie-card bg-white border border-gray-200 shadow-md text-black p-3 rounded-md flex flex-col items-center gap-2 cursor-pointer hover:shadow-lg transition-all duration-200"
            : "movie-card bg-[#1c1917] text-white p-3 rounded-md flex flex-col items-center gap-2 cursor-pointer hover:bg-[#292524] transition-all duration-200";
        
        card.className = cardClasses;

        const poster = movie.Poster;
        const titleClass = isLight ? 'text-black' : 'text-white';
        const metaClass = isLight ? 'text-gray-600' : 'text-[#c4c4c4]';

        card.innerHTML = `
            <img src="${poster}" alt="${movie.Title}" class="w-full h-[300px] object-cover rounded">
            <h3 class="text-lg font-bold text-center ${titleClass}">${movie.Title}</h3>
            <p class="text-sm ${metaClass}">${movie.Year} • ${movie.Type}</p>
        `;

        moviesGrid.appendChild(card);

        card.addEventListener('click', async () => {
            const selectedMovie = movie.imdbID;
            const data = await fetchMovieDetails(selectedMovie);

            openModal();
            
            const modalBg = isLight ? 'bg-white' : 'bg-[#1c1917]';
            const modalText = isLight ? 'text-black' : 'text-white';
            const modalBorder = isLight ? 'border border-gray-200 shadow-xl' : 'border border-[#27272a]';
            
            dialogSelectedMovie.innerHTML = `
                <div class="modal-content ${modalBg} ${modalText} ${modalBorder} p-6 rounded-xl max-w-lg w-full mx-auto my-auto max-h-[90vh] overflow-y-auto">
                    <img src="${data.Poster}" alt="${data.Title}" class="rounded h-full w-full object-cover mx-auto mb-4">
                    <h2 class="text-2xl font-bold mb-2">${data.Title}</h2>
                    <p class="mb-1"><strong>Ano:</strong> ${data.Year}</p>
                    <p class="mb-1"><strong>Duração:</strong> ${data.Runtime}</p>
                    <p class="mb-1"><strong>Lançamento:</strong> ${data.Released}</p>
                    <p class="mb-1"><strong>Classificação:</strong> ${data.Rated}</p>
                    <p class="mb-4"><strong>Sinopse:</strong> ${data.Plot}</p>
                    <p class="mb-1"><strong>Gênero:</strong> ${data.Genre}</p>
                    <p class="mb-1"><strong>Atores:</strong> ${data.Actors}</p>
                    <p class="mb-1"><strong>Direção:</strong> ${data.Director}</p>

                    <button id="close-modal" class="bg-[#ff1d1d] w-28 h-[50px] rounded-md flex items-center justify-center text-white hover:bg-[#b91c1c] transition-colors duration-200 cursor-pointer">
                        Fechar
                    </button>
                </div>
            `;

            dialogSelectedMovie.addEventListener("click", (e) => {
                if (e.target === dialogSelectedMovie) {
                    closeModal();
                }
            });

            document.getElementById("close-modal").addEventListener("click", () => {
                closeModal();
            });
        });
    });
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
        previousPage.style.display = "none";
    }

    if (currentPage === totalPages) {
        nextPage.style.display = "none";
    }

    if (previousPage) {
        previousPage.addEventListener("click", () => {
            if (currentPage > 1) {
                currentPage--;
                fetchResults(lastSearch, currentPage);
            }
        });
    }

    if (nextPage) {
        nextPage.addEventListener("click", () => {
            if (currentPage < totalPages) {
                currentPage++;
                fetchResults(lastSearch, currentPage);
            }
        });
    }
}