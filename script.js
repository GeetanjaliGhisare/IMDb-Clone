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

            movieCard.querySelector("img").addEventListener("click", async (event) => {
                const imdbID = event.target.getAttribute("data-imdbid");
                history.pushState({page: "movieDetails", imdbID: imdbID}, "", `?movie=${imdbID}`);
                await fetchMovieDetails(imdbID);
            })
        });
    }

    async function fetchMovieDetails(imdbID){
        const url = `https://www.omdbapi.com/?i=${imdbID}&apikey=${API_KEY}`;
     
        try{
            const response = await fetch(url);
            const data = await response.json();

            if(data.Response === "True"){
                document.getElementById("movieTitle").innerText = data.Title;
                document.getElementById("moviePoster").src = data.Poster;
                document.getElementById("movieYear").innerText = data.Year;
                document.getElementById("movieRating").innerText = data.imdbRating;
                document.getElementById("movieReleased").innerText = data.Released;
                document.getElementById("movieWriter").innerText = data.Writer;
                document.getElementById("movieActors").innerText = data.Actors;
                document.getElementById("moviePlot").innerText = data.Plot;

                movieDetailsSection.classList.remove("d-none");
                resultsContainer.classList.add("d-none");
            }else{
                console.error("Movie details not found");   
            }
        }
        catch(error){
            console.error("Error fetching movie details:", error);
        }
    }

     window.addEventListener("popstate", (event)=>{
        if(event.state && event.state.page === "movieDetails"){
            fetchMovieDetails(event.state.imdbID);
        }else{
            movieDetailsSection.classList.add("d-none");
            resultsContainer.classList.remove("d-none")
        }
    })

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
 const urlParams = new URLSearchParams(window.location.search);
    const movieID = urlParams.get("movie");
    if (movieID) {
        fetchMovieDetails(movieID);
    }

})
