
$(async function () {


    $("#addMovieForm").on("submit", addMovie);
})

async function addMovie(e) {
    e.preventDefault();
    let data = new FormData(e.target);
    let movieEntries = Object.fromEntries(data.entries());
    let response = await fetch("/api/movies?token=" + sessionStorage.token, {
        method: "post",
        body: JSON.stringify(movieEntries),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    if (response.ok) {
        $("#statusMessage").text(response);
        alert("Movie is added");
        location.href = "/";
    } else {
        let err = await response.json();
        $("#statusMessage").text(err.message);
    }
}

