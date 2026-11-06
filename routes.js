const express = require('express');
const router = express.Router();
const db = require("./services/db.js");
const crypto = require('crypto');

// Added Node Modules
const mdb = require('moviedb')('7c8b931265aec52c8b9b9ee661ae729a');
const validator = require('validator');

db.connect()
    .then(function (response) {
        console.log(response);
    })
    .catch(function (error) {
        console.log(error.message);
    });

router.use(express.urlencoded({
    extended: true
}));

//need this if you are sending json data in the request body
router.use(express.json());

// Login 
router.post('/api/accounts/login', function (req, res) {
    let data = req.body;
    db.getAccount(data.username, data.password)
        .then(function (response) {
            if (!response) {
                res.status(401).json({ 'message': 'Login Unsuccessful. Please try again later.' });
            }
            else {
                //Hashing
                let strTohash = response.username + Date.now();
                let token = crypto.createHash('sha256').update(strTohash).digest('hex');
                db.updateToken(response._id, token)
                    .then(function (response) {
                        res.status(200).json({ 'message': 'Login Successful', 'token': token });
                    })
                    .catch(function (error) {
                        res.status(500).json({ "message": error.message });
                    })
            }
        })
        .catch(function (error) {
            res.status(500).json({ "message": error.message });
        })
})

// Authentication Check
function authenticationCheck(req, res, next) {
    //check if query token is in the url
    let token = req.query.token;
    if (!token) {
        res.status(401).json({ "message": "No tokens are provided." });
    } else {
        db.checkToken(token)
            .then(function (response) {
                //Matched token in the db, proceed with the request
                if (response) {
                    //response = the account that is logged in.
                    // store the account's id in local memory to be used in the route handler
                    res.locals.accountId = response._id;
                    res.locals.isAdmin = response.role == 'admin';
                    next();
                } else {
                    res.status(401).json({ "message": "Invalid token provided." });
                }
            })
            .catch(function (error) {
                res.status(500).json({ "message": error.message });
            });
    }
}

/* Register middleware to routes */
//  Movies
router.post('/api/movies', authenticationCheck);
router.put('/api/movies/*', authenticationCheck);       // (/* - means wild card)
router.delete('/api/movies/*', authenticationCheck);    // (/* - means wild card)
//  Tickets
router.post('/api/tickets', authenticationCheck);
router.put('/api/tickets/*', authenticationCheck);       // (/* - means wild card)
router.delete('/api/tickets/*', authenticationCheck);    // (/* - means wild card)
//  Accounts
router.put('/api/accounts/*', authenticationCheck);       // (/* - means wild card)
router.delete('/api/accounts/*', authenticationCheck);    // (/* - means wild card)
//  Logout
router.get('/api/accounts/logout', authenticationCheck);

// Register account
router.post('/api/accounts', function (req, res) {
    let data = req.body;
    // Validate password using validator
    const isPasswordValid = validator.isLength(data.password, { min: 8 });
    if (!isPasswordValid) {
        return res.status(400).json({ "error": 'Invalid password. Must be at least 8 characters long.' });
    }
    db.addAccount(data.username, data.name, data.password, data.role)
        .then(function (response) {
            res.status(200).json({ "message": response });
        })
        .catch(function (error) {
            const errorMessage = error.message || 'An error occurred during account creation.';
            res.status(500).json({ "error": errorMessage });
        });
})

// Add Movie
router.post('/api/movies', function (req, res) {
    let data = req.body;
    if (!res.locals.isAdmin) {
        res.status(403).json({ "message": "You are not authorized to add a movie." });
    } else {

        db.addMovie(data.title, data.overview, data.release_date, data.vote_average)
            .then(function (response) {
                res.status(200).json({ "message": response });
            })
            .catch(function (error) {
                res.status(500).json({ "error": error.message });
            });
    }
})

// Get all Movie
router.get('/api/movies', function (req, res) {
    db.getAllMovies()
        .then(function (response) {
            res.status(200).json(response);
        })
        .catch(function (error) {
            res.status(500).json({ "error": error.message });
        });
})

// Search Movie from MovieDB API
router.get('/api/movies/search', function (req, res) {
    const query = req.query.query;
    const year = req.query.year;

    const searchParams = { query: query };

    if (year) {
        searchParams.primary_release_year = year;
    }

    mdb.searchMovie(searchParams, function (err, movieResults) {
        if (err) {
            res.status(500).json({ "error": err.message });
        } else {
            const formattedResults = movieResults.results.map(movie => ({
                title: movie.title,
                overview: movie.overview,
                release_date: movie.release_date,
                vote_average: movie.vote_average,
            }));

            res.status(200).json(formattedResults);
        }
    });
});

// Get Movie by ID
router.get('/api/movies/:id', function (req, res) {
    let id = req.params.id;
    db.getMovieById(id)
        .then(function (response) {
            res.status(200).json(response);
        })
        .catch(function (error) {
            res.status(500).json({ "message": error.message });
        });
})

// Update Movie by ID
router.put('/api/movies/:id', function (req, res) {
    let id = req.params.id;
    let data = req.body;

    db.getMovieById(id)
        .then(function (response) {
            if (!response) {
                res.status(200).json({ "message": "Unable to find record to update" });
            } else {
                if (!res.locals.isAdmin) {
                    res.status(403).json({ "message": "You are not authorized to perform this action." });
                } else {
                    //  Lab 10 - Web App
                    db.updateMovieById(id, { title: data.title, overview: data.overview, release_date: data.release_date, vote_average: data.vote_average })
                        .then(function (response) {
                            res.status(200).json({ "message": response });
                        })
                        .catch(function (error) {
                            res.status(500).json({ "message": error.message });
                        });
                }
            }
        })
        .catch(function (error) {
            res.status(500).json({ "message": error.message });
        });
})

// Delete Movie by ID
router.delete('/api/movies/:id', function (req, res) {
    let id = req.params.id;

    db.getMovieById(id)
        .then(function (response) {
            if (!response) {
                res.status(200).json({ "message": "Unable to find record to delete" });
            } else {
                //need to use the equals function for comparison because the organizer IDs are two different objects
                if (!res.locals.isAdmin) {
                    res.status(403).json({ "message": "You are not authorized to perform this action." });
                } else {
                    db.deleteMovieById(id)
                        .then(function (response) {
                            res.status(200).json({ "message": response });
                        })
                        .catch(function (error) {
                            res.status(500).json({ "message": error.message });
                        });
                }
            }
        })
        .catch(function (error) {
            res.status(500).json({ "message": error.message });
        });

})

// Add Ticket 
router.post('/api/tickets', function (req, res) {
    let data = req.body;
    db.addTicket(data.name, data.type, data.price)
        .then(function (response) {
            res.status(200).json({ "message": response });
        })
        .catch(function (error) {
            res.status(500).json({ "error": error.message });
        });
})

// Get Ticket
router.get('/api/tickets', function (req, res) {
    db.getAllTickets()
        .then(function (response) {
            res.status(200).json(response);
        })
        .catch(function (error) {
            res.status(500).json({ "error": error.message });
        });
})

// Search Ticket 
router.post('/api/tickets/search', function (req, res) {
    let data = req.body;
    db.searchTickets(data.name)
        .then(function (response) {
            res.status(200).json(response);
        })
        .catch(function (error) {
            res.status(500).json({ "message": error.message });
        });
})

// Create Playlist
router.post('/api/playlists', function (req, res) {
    let data = req.body;
    let accountId = res.locals.accountId;
    db.createPlaylist(data.name, data.movie, accountId)
        .then(function (response) {
            res.status(200).json({ "message": response });
        })
        .catch(function (error) {
            res.status(500).json({ "error": error.message });
        });
});

// Get Playlists
router.get('/api/playlists/', async function (req, res) {
    try {
        let playlists = await db.getAllPlaylists();
        res.status(200).json(playlists);
    } catch (error) {
        res.status(500).json({ "error": error.message });
    }
});

// Get Playlists by ID
router.get('/api/playlists/:id', function (req, res) {
    let id = req.params.id;
    db.getPlaylistById(id)
        .then(function (response) {
            res.status(200).json(response);
        })
        .catch(function (error) {
            res.status(500).json({ "message": error.message });
        });
})

// Delete Playlist by ID
router.delete('/api/playlists/:id', function (req, res) {
    let id = req.params.id;

    db.getPlaylistById(id)
        .then(function (response) {
            if (!response) {
                res.status(200).json({ "message": "Unable to find record to delete" });
            } else {
                db.deletePlaylistById(id)
                    .then(function (response) {
                        res.status(200).json({ "message": response });
                    })
                    .catch(function (error) {
                        res.status(500).json({ "message": error.message });
                    });
            }
        })
        .catch(function (error) {
            res.status(500).json({ "message": error.message });
        });
})

// Logout
router.get('/api/accounts/logout', authenticationCheck, function (req, res) {
    // retrieve the id that was stored earlier in the middleware.
    let id = res.locals.accountId;
    db.removeToken(id)
        .then(function (response) {
            res.status(200).json({ 'message': 'Logout Successful' });
        })
        .catch(function (error) {
            res.status(500).json({ "message": error.message });
        });
})

// Get Account by ID
router.get('/api/accounts/:id', authenticationCheck, async (req, res) => {
    let id = res.locals.accountId;
    try {
        let result = await db.getAccountById(id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ "message": error.message });
    }
})

// Update Account;s by ID
router.put('/api/accounts/:id', function (req, res) {
    let id = res.locals.accountId;
    let data = req.body;

    db.getAccountById(id)
        .then(function (response) {
            if (!response) {
                res.status(200).json({ "message": "Unable to find record to update" });
            } else {
                db.updateAccountById(id, { username: data.username, name: data.name, password: data.password })
                .then(function (response) {
                    res.status(200).json({ "message": response });
                })
                .catch(function (error) {
                    res.status(500).json({ "message": error.message });
                });
            }
        })
        .catch(function (error) {
            res.status(500).json({ "message": error.message });
        });
})

// Delete Account by ID
router.delete('/api/accounts/:id', function (req, res) {
    let id = res.locals.accountId;

    db.getAccountById(id)
        .then(function (response) {
            if (!response) {
                res.status(200).json({ "message": "Unable to find record to delete" });
            } else {
                db.deleteAccountById(id)
                    .then(function (response) {
                        res.status(200).json({ "message": response });
                    })
                    .catch(function (error) {
                        res.status(500).json({ "message": error.message });
                    });
            }
        })
        .catch(function (error) {
            res.status(500).json({ "message": error.message });
        });

})



module.exports = router;



/* //Update Movie by Title
router.put('/api/movies/title/:value', function (req, res) {
    let value = req.params.value;
    let data = req.body;
    db.updateMovie({ title: value }, { title: data.title, overview: data.overview, release_date: data.release_date, vote_average: data.vote_average})
        .then(function (response) {
            if (!response) {
                res.status(200).json({ "message": "Unable to find record to update" });
            } else {
                if (!res.locals.isAdmin) {
                    res.status(403).json({ "message": "You are not authorized to add a course." });
                } else {
                    db.updateMovie({ title: value }, { title: data.title, overview: data.overview, release_date: data.release_date, vote_average: data.vote_average})
                        .then(function (response) {
                            res.status(200).json({ "message": response });
                        })
                        .catch(function (error) {
                            res.status(500).json({ "message": error.message });
                        });
                }
            }
        })
        .catch(function (error) {
            res.status(500).json({ "error": error.message });
        });
})

//Delete Movie by Title
router.delete('/api/movies/title/:value', function (req, res) {
    let value = req.params.value;
    db.deleteMovie({ title: value })
        .then(function (response) {
            res.status(200).json({ "message": response });
        })
        .catch(function (error) {
            res.status(500).json({ "error": error.message });
        });
}) */

//Search Movie from MongoDB
/* router.post('/api/movies/search', function (req, res) {
    const { title, year, genre } = req.body;
    if (!title && !year && !genre) {
        return res.status(400).json({ "message": "At least one value is required." });
    } else {
        db.searchMovie(title, year, genre)
            .then(function (response) {
                res.status(200).json({ "message": response });
            })
            .catch(function (error) {
                res.status(500).json({ "message": error.message });
            });
    }
}); */
