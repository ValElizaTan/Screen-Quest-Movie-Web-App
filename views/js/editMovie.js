let id;
$(async function () {
    const urlParams = new URLSearchParams(window.location.search);
    id = urlParams.get('id');

    let response = await fetch("/api/movies/" + id);
    if (response.ok) {
        let data = await response.json();
        $("#title").val(data.title);
        $("#overview").val(data.overview);
        $("#release_date").val(data.release_date);
        $("#vote_average").val(data.vote_average);
    } else {
        let err = await response.json();
        alert(err.message);
        history.back();
    }

    $("#editMovieForm").on("submit", editMovie);
    $("#deleteMovieBtn").on("click", deleteMovie);
})

async function editMovie(e) {
    e.preventDefault();
    let data = new FormData(e.target);
    let eventEntries = Object.fromEntries(data.entries());
    let response = await fetch("/api/movies/" + id + "?token=" + sessionStorage.token, {
        method: "put",
        body: JSON.stringify(eventEntries),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    if (response.ok) {
        let data = await response.json();
        alert("Movie is updated");
        location.href = "/";
    } else {
        let err = await response.json();
        $("#statusMessage").text(err.message);
    }
}

async function deleteMovie(e) {
    let confirmed = confirm("Are you sure you want to delete the movie?");
    if (confirmed) {
        let response = await fetch("/api/movies/" + id + "?token=" + sessionStorage.token, {
            method: "delete"
        })
        if (response.ok) {
            alert("Movie is deleted");
            location.href = "/";
        } else {
            let err = await response.json();
            $("#statusMessage").text(err.message);
        }
    }
}