$(async function () {
  let response = await fetch("/api/movies");
  if (response.ok) {
    let data = await response.json();
    data.forEach(function (movie) {
      $(".movies").append(`
              <article>
                  <h2>${movie.title}</h2>
                  <div>
                  Description: <br> ${movie.overview} <br><br>
                  Released Date: ${movie.release_date} <br><br>
                  Rating: ${movie.vote_average} <br><br>
                  </div>
                  <br>
                  <div class="authenticatedSection">
                  <a id='edit' href="/editMovie.html?id=${movie._id}">Edit</a>
                  </div>
              </article>
              `);
    });
  } else {
    let err = await response.json();
    console.log(err.message);
  }

  $("#searchForm").on("submit", searchMovie);

  if (sessionStorage.token) {
    $(".unauthenticatedSection").hide();
    $(".authenticatedSection").show();
} else {
    $(".unauthenticatedSection").show();
    $(".authenticatedSection").hide();
}
});

async function searchMovie(e) {
  e.preventDefault();
  let movieName = e.target.elements.name.value;
  let year = e.target.elements.name.value;

  let url = `/api/movies/search?query=${movieName}`;
  if (year) {
    url += `&year=${year}`;
  }

  let response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    let data = await response.json();
    $(".movies").empty();
    if (data.length > 0) {
      data.forEach(function (movie) {
        $(".movies").append(`
        <article>
        <h2>${movie.title}</h2>
        <div>
        Description: <br> ${movie.overview} <br><br>
        Released Date: ${movie.release_date} <br><br>
        Rating: ${movie.vote_average} <br><br>
        </div>
    </article>
        `);
      });
    } else {
      $(".movies").append("<p class='center-text'>No search results</p>");
    }
  } else {
    let err = await response.json();
    console.error(err.message);
  }
}


