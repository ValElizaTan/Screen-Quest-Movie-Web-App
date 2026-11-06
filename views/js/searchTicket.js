$(async function () {
    let response = await fetch("/api/tickets");
    if (response.ok) {
        let data = await response.json();
        data.forEach(function (ticket) {
            $(".tickets").append(`
                <article>
                    <h2>${ticket.name}</h2>
                    <div>
                    Type: <br> ${ticket.type} <br><br>
                    Price: ${ticket.price} <br><br>
                    </div>
                </article>
                `);
        });
    } else {
        let err = await response.json();
        console.log(err.message);
    }

    $("#searchForm").on("submit", searchTickets);
});

async function searchTickets(e) {
    e.preventDefault();
    let data = new FormData(e.target);
    let ticketEnteries = Object.fromEntries(data.entries());
    let response = await fetch("/api/tickets/search", {
        method: "POST",
        body: JSON.stringify(ticketEnteries),
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (response.ok) {
        let data = await response.json();
        $(".tickets").empty();
        if (data.length > 0) {
            data.forEach(function (ticket) {
                $(".tickets").append(`
                <article>
                    <h2>${ticket.name}</h2>
                    <div>
                    Type: <br> ${ticket.type} <br><br>
                    Price: ${ticket.price} <br><br>
                    </div>
                </article>
            `);
            });
        } else {
            $(".tickets").append("<p>No search results</p>");
        }
    } else {
        let err = await response.json();
        console.log(err.message);
    }
}


