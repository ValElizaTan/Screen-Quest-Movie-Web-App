let id;

$(async function () {
    const urlParams = new URLSearchParams(window.location.search);
    id = urlParams.get('id');
    let token = sessionStorage.getItem('token');

    try {
        let response = await fetch("/api/accounts/" + id + "?token=" + token);
        if (response.ok) {
            let data = await response.json();
            $("#username").val(data.username);
            $("#name").val(data.name);
            $("#password").val(data.password);
        } else {
            let err = await response.json();
            alert(err.message);
            history.back();
        }
    } catch (error) {
        console.error(error.message);
        alert("An error occurred while fetching account information.");
        history.back();
    }

    $("#editProfileForm").on("submit", editProfile);
    $("#deleteProfileBtn").on("click", deleteProfile);
})

async function editProfile(e) {
    e.preventDefault();
    let data = new FormData(e.target);
    let eventEntries = Object.fromEntries(data.entries());
    let response = await fetch("/api/accounts/" + id + "?token=" + sessionStorage.token, {
        method: "put",
        body: JSON.stringify(eventEntries),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    if (response.ok) {
        let data = await response.json();
        alert("Profile is updated");
        location.href = "/Profile.html";
    } else {
        let err = await response.json();
        $("#statusMessage").text(err.message);
    }
}

async function deleteProfile() {
    let confirmed = confirm("Are you sure you want to delete the Profile?");
    if (confirmed) {
        try {
            let response = await fetch("/api/accounts/" + id + "?token=" + sessionStorage.token, {
                method: "delete"
            });

            if (response.ok) {
                alert("Profile is deleted");
                sessionStorage.removeItem("token");
                location.href = "/login.html";
            } else {
                let err = await response.json();
                $("#statusMessage").text(err.message);
            }
        } catch (error) {
            console.error("Error deleting profile:", error);
            $("#statusMessage").text("An error occurred while deleting the profile.");
        }
    }
}