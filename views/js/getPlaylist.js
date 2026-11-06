$(async function () {
    let response = await fetch("/api/playlists/");
    if (response.ok) {
        let data = await response.json();
        data.forEach(function (playlist) {
            const movieTitles = playlist.movies.map(movie => movie.title).join('<br>');
            $(".playlists").append(`
                    <article>
                        <h2>${playlist.name}</h2>
                        <div>
                            Movie: <br> ${movieTitles} <br><br>
                        </div>
                        <br>
                        <button class="deletePlaylistBtn" data-id="${playlist._id}">Delete Playlist</button>
                    </article>
                `);
        });

        $(".deletePlaylistBtn").on("click", deletePlaylist);
    } else {
        let err = await response.json();
        console.log(err.message);
    }
});

async function deletePlaylist() {
    let playlistId = $(this).data("id");
    let confirmed = confirm("Are you sure you want to delete the playlist?");

    if (confirmed) {
        let response = await fetch("/api/playlists/" + playlistId + "?token=" + sessionStorage.token, {
            method: "delete"
        });

        if (response.ok) {
            alert("Playlist is deleted");
            location.reload();
        } else {
            let err = await response.json();
            alert("Error deleting Playlist");
            console.log(err.message);
        }
    }
}