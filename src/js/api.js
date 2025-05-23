const API_KEY = "410ea29c";

async function SearchMovies(title) {
    try {
        const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(title)}`);
        const data = await res.json();
        
        if(data.Response === "False") {
            console.log(`Nenhum filme com o nome ${title} foi encontrado!`);
            return;
        }

        console.log(data);

    } catch (error) {
        console.error("Ocorreu um erro ao puxar dados do filme: ", error);
    }
}

SearchMovies("megamatte");