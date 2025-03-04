document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("movieSearch");
    const searchButton = document.getElementById("searchButton");

    let resultsContainer = document.createElement("div");
    resultsContainer.classList.add("search-results");
    document.body.appendChild(resultsContainer);

    const movieDetailsSection = document.querySelector(".movie-sect");
    const API_KEY = "6b6924a";

    async function fetchMovies(query) {
        const url = `https://www.omdbapi.com/?s=${query}&apikey=${API_KEY}`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.Response === "True") {
                displayMovies(data.Search);
            } else {
                resultsContainer.innerHTML = "<p>No movies found</p>";
                resultsContainer.style.display = "block";
            }
        } catch (error) {
            console.error("Error fetching movies:", error);
        }
    }

    function displayMovies(movies) {
        resultsContainer.innerHTML = "";
        resultsContainer.style.display = "block";

        movies.forEach(movie => {
            let movieCard = document.createElement("div");
            movieCard.classList.add("movie-card");
            movieCard.innerHTML = `
                <img src="${movie.Poster}" alt="${movie.Title}" style="width:230px; height:350px; cursor:pointer"
                data-imdbid="${movie.imdbID}">
                <h5>${movie.Title} (${movie.Year})</h5>`;

            resultsContainer.appendChild(movieCard);


            movieCard.querySelector("img").addEventListener("click", async (event) => {
                const imdbID = event.target.getAttribute("data-imdbid");
                history.pushState({ page: "movieDetails", imdbID: imdbID }, "", `?movie=${imdbID}`)
                await fetchMovieDetails(imdbID);
            })
        });
    }

    async function fetchMovieDetails(imdbID) {
        const url = `https://www.omdbapi.com/?i=${imdbID}&apikey=${API_KEY}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.Response === "True") {
                document.getElementById("movieTitle").innerText = data.Title;
                document.getElementById("moviePoster").src = data.Poster;
                document.getElementById("movieYear").innerText = data.Year;
                document.getElementById("movieRating").innerText = data.imdbRating;
                document.getElementById("movieReleased").innerText = data.Released;
                document.getElementById("movieWriter").innerText = data.Writer;
                document.getElementById("movieActors").innerText = data.Actors;
                document.getElementById("moviePlot").innerText = data.Plot;

                await fetchMovieTrailer(data.Title, data.Year)

                movieDetailsSection.classList.remove("d-none");
                resultsContainer.classList.add("d-none");
            } else {
                console.error("Movie details not found");
            }
        }
        catch (error) {
            console.error("Error fetching movie details:", error);
        }
    }

    async function fetchMovieTrailer(title, year) {
        const YT_API_KEY = "AIzaSyA97_XGSGL59fd1e_nEhDVm0q7L6Cx-XQc";
        const query = `${title} ${year} official trailer`;
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&key=${YT_API_KEY}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.items.length > 0) {
                const videoId = data.items[0].id.videoId;
                document.getElementById("movieTrailer").src = `https://www.youtube.com/embed/${videoId}`;
            } else {
                document.getElementById("movieTrailer").src = "";
                console.log("No trailer found");
            }
        } catch (error) {
            console.error("Error fetching trailer:", error);
        }
    }


    window.addEventListener("popstate", (event) => {
        if (event.state && event.state.page === "movieDetails") {
            fetchMovieDetails(event.state.imdbID);
        } else {
            movieDetailsSection.classList.add("d-none");
            resultsContainer.classList.remove("d-none")
        }
    })


    searchButton.addEventListener("click", () => {
        const query = searchInput.value.trim();
        if (query) fetchMovies(query);
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

    if (!history.state) {
        history.replaceState({ page: "home" }, "", window.location.pathname);
    }
    

    let modal = document.getElementById("trailerModal");
        let frame = document.getElementById("trailerFrame");

        document.querySelectorAll(".carousel-item img").forEach(img => {
            img.addEventListener("click", function() {
                let videoSrc = this.getAttribute("data-video");
                frame.src = videoSrc;
            });
        });

        modal.addEventListener("hidden.bs.modal", function() {
            frame.src = ""; // Stop video when modal is closed
        });
});
