$(async function () {
    let response = await fetch("/api/Movies");
    if (response.ok) {
        let data = await response.json();
        data.forEach(function (movie) {
            $("#addPlaylistForm select[name='movie']").append(`
            <option value="${movie._id}">${movie.title}</option>
        `);
        });
    } else {
        let err = await response.json();
        console.log(err.message);
    }

    $("#addPlaylistForm").on("submit", createPlaylist);
})

async function createPlaylist(e) {
    e.preventDefault();
    let data = new FormData(e.target);
    let eventEntries = Object.fromEntries(data.entries());
    let response = await fetch("/api/playlists?token=" + sessionStorage.token, {
        method: "post",
        body: JSON.stringify(eventEntries),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (response.ok) {
        $("#statusMessage").text(response);
        alert("Playlist is Added");
        location.href = "/getPlaylist.html";
    } else {
        let err = await response.json();
        $("#statusMessage").text(err.message);
    }
}

