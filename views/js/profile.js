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
});
