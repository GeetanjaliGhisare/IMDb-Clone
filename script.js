document.addEventListener("DOMContentLoaded", function () {

    const searchInput = document.getElementById("movieSearch");
    const searchButton = document.getElementById("searchButton");

    let resultsContainer = document.createElement("div");
    resultsContainer.classList.add("search-results");
    document.body.appendChild(resultsContainer);

    const API_KEY = "6b6924a";

    async function fetchMovies(query) {
        const url = `https://www.omdbapi.com/?s=${query}&apikey=${API_KEY}`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.Response === "True") {
                displayMovies(data.Search);
            } else {
                resultsContainer.innerHTML = "<P> NO Movies found </p>";
                resultsContainer.style.display = "block"
            }
        }

        catch (error) {
            console.error("Error fetching movies :", error)
        }
    }

    function displayMovies(movies) {

        resultsContainer.innerHTML = "";
        resultsContainer.style.display = "block";

        movies.forEach(movie => {
            let movieCard = document.createElement("div");
            movieCard.classList.add("movie-card");
            movieCard.innerHTML = `<img src="${movie.Poster}" alt="${movie.Title}" style = "width:230px; height:350px;">
            <h5>${movie.Title} (${movie.Year})</h5>`;

            resultsContainer.appendChild(movieCard);
        });
    }

    searchButton.addEventListener("click", () => {
        const query = searchInput.value.trim();
        if (query) fetchMovies(query)
    });

    searchInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            const query = searchInput.value.trim();
            if (query) fetchMovies(query);
        }
    });

    document.addEventListener("click", (event) => {
        if (!resultsContainer.contains(event.target) && event.target !== searchInput) {
            resultsContainer.style.display = "none";
        }
    })

})