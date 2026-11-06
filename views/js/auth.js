$(function () {
    $("#loginForm").on("submit", login);
    $("#registerForm").on("submit", register);
    $("#logoutLink").on("click", logout);

    if (sessionStorage.token) {
        $(".unauthenticatedSection").hide();
        $(".authenticatedSection").show();
    } else {
        $(".unauthenticatedSection").show();
        $(".authenticatedSection").hide();
    }

})

//  Login
async function login(e) {
    e.preventDefault();
    let data = new FormData(e.target);
    let loginEntries = Object.fromEntries(data.entries());
    let response = await fetch("/api/accounts/login", {
        method: "post",
        body: JSON.stringify(loginEntries),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    if (response.ok) {
        let data = await response.json();
        sessionStorage.token = data.token;
        location.href = "/";
    } else {
        let err = await response.json();
        $("#statusMessage").text(err.message);
    }
}

//  Register
async function register(e) {
    e.preventDefault();
    let data = new FormData(e.target);
    let loginEntries = Object.fromEntries(data.entries());
    let response = await fetch("/api/accounts", {
        method: "post",
        body: JSON.stringify(loginEntries),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (response.ok) {
        let data = await response.json();
        $("#statusMessage").html(data.message + "<br>You may <a href='/login.html'>login</a> now.");
    } else {
        let err = await response.json();
        $("#statusMessage").text(err.error);
    }
}

//  Logout
async function logout() {
    let response = await fetch("/api/accounts/logout?token=" + sessionStorage.token);
    if (response.ok) {
        sessionStorage.removeItem("token");
        location.href = "/";
    } else {
        let err = await response.json();
        console.log(err.message);
        alert("Unable to logout");
    }
}

