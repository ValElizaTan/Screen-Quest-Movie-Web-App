const mongoose = require('mongoose');
const movie = require("../models/movie.js");
const account = require("../models/account.js");
const ticket = require("../models/ticket.js");
const playlist = require("../models/playlist.js");

let db = {
  async connect() {
    try {
      await mongoose.connect('mongodb://127.0.0.1:27017/movieDB_Valerie');
      return "Connected to Mongo DB";
    }
    catch (e) {
      console.log(e.message);
      throw new Error("Error connecting to Mongo DB");
    }
  },

  //Register
  async addAccount(username, name, password, role = 'user') {
    try {
      await account.create({
        username: username,
        name: name,
        password: password,
        role: role
      })
      return `${username} has been added to the system`;
    }
    catch (e) {
      console.log(e.message);
      throw new Error(`Unable to add ${username} to the system`);
    }
  },

  //Add Movie
  async addMovie(title, overview, release_date, vote_average) {
    try {
      await movie.create({
        title: title,
        overview: overview,
        release_date: release_date,
        vote_average: vote_average
      })
      return `${title} has been added to the system`;
    }
    catch (e) {
      console.log(e.message);
      throw new Error(`${title} , Already exsist in the system`);
    }
  },

  //Get Movie
  async getAllMovies() {
    try {
      let results = await movie.find();
      if (!results) {
        throw new Error('Unable to find Movie');
      }
      return results;
    }
    catch (e) {
      console.log(e.message);
      throw new Error(`Unable to find Movie the system`);
    }
  },

  //Get Movie by ID
  async getMovieById(id) {
    try {
      let result = await movie.findById(id);
      return result;
    }
    catch (e) {
      console.log(e.message);
      throw new Error("Error retrieving movie");
    }
  },

  //Update Movie by ID
  async updateMovieById(id, updates) {
    try {
      let result = await movie.findByIdAndUpdate(id, updates);
      if (!result) return "Unable to find Movie to update";
      else return "Movie is updated!";
    }
    catch (e) {
      console.log(e.message);
      throw new Error("Error updating Movie");
    }
  },

  //Delete Movie by ID
  async deleteMovieById(id) {
    try {
      let result = await movie.findByIdAndDelete(id);
      if (!result) return "Unable to find Movie to delete.";
      else return "Movie is deleted!";
    }
    catch (e) {
      console.log(e.message);
      throw new Error("Error deleting Movie");
    }
  },

  //Add Ticket 
  async addTicket(name, type, price) {
    try {
      await ticket.create({
        name: name,
        type: type,
        price: price
      })
      return `${type} has been created.`;
    }
    catch (e) {
      console.log(e.message);
      throw new Error(`${type} , Already exsist in the system`);
    }
  },

  //Get Ticket
  async getAllTickets() {
    try {
      let results = await ticket.find();
      if (!results) {
        throw new Error('Unable to find Ticket');
      }
      return results;
    }
    catch (e) {
      console.log(e.message);
      throw new Error(`Unable to find Ticket the system`);
    }
  },

  //Search Ticket
  async searchTickets(name) {
    try {
      let results = await ticket.find({ name: new RegExp(name, 'i') });
      return results;
    }
    catch (e) {
      console.log(e.message);
      throw new Error(`Unable to retrieve records for ${username}`);
    }

  },

  // Create Playlist
  async createPlaylist(name, movieId, accountId) {
    try {
      await playlist.create({ name: name, movies: [movieId], account: accountId });
      return `${name} playlist has been created.`;
    } catch (e) {
      console.log(e.message);
      throw new Error(`Unable to create ${name} playlist.`);
    }
  },

  // Get PLaylist
  async getAllPlaylists() {
    try {
      let results = await playlist.find().populate({
        path: 'movies',
        select: 'title'
      });
      if (!results) {
        throw new Error('Unable to find playlists');
      }
      return results;
    } catch (e) {
      console.error(e.message);
      throw new Error('Unable to find playlists in the system');
    }
  },

  // Get Playlist by ID
  async getPlaylistById(id) {
    try {
      let result = await playlist.findById(id);
      return result;
    }
    catch (e) {
      console.log(e.message);
      throw new Error("Error retrieving movie");
    }
  },

  // Delete Playlist by ID
  async deletePlaylistById(id) {
    try {
      let result = await playlist.findByIdAndDelete(id);
      if (!result) return "Unable to find Playlist to delete.";
      else return "Playlist is deleted!";
    }
    catch (e) {
      console.log(e.message);
      throw new Error("Error deleting Playlist");
    }
  },

  // Get Account
  async getAllAccount() {
    try {
      let results = await account.find();
      if (!results) {
        throw new Error('Unable to find Account');
      }
      return results;
    }
    catch (e) {
      console.log(e.message);
      throw new Error(`Unable to find Account the system`);
    }
  },

  // Get Account by ID
  async getAccountById(id) {
    try {
      let result = await account.findById(id);
      return result;
    } catch (e) {
      console.error(e.message);
      throw new Error("Error retrieving Account's information.");
    }
  },

  // Update Account by ID
  async updateAccountById(id, updates) {
    try {
      let result = await account.findByIdAndUpdate(id, updates);
      if (!result) return "Unable to find Account to update";
      else return "Account is updated!";
    }
    catch (e) {
      console.log(e.message);
      throw new Error("Error updating Account");
    }
  },

  // Delete Account by ID
  async deleteAccountById(id) {
    try {
      let result = await account.findByIdAndDelete(id);
      if (!result) return "Unable to find Account to delete.";
      else return "Account is deleted!";
    }
    catch (e) {
      console.log(e.message);
      throw new Error("Error deleting Account");
    }
  },

  // Login
  async getAccount(username, password) {
    try {
      let results = await account.findOne({ username: username, password: password });
      return results;
    }
    catch (e) {
      console.log(e.message);
      throw new Error(`Unable to retrieve login credentials`);
    }
  },
  async updateToken(id, token) {
    try {
      await account.findByIdAndUpdate(id, { token: token });
      return;
    }
    catch (e) {
      console.log(e.message);
      throw new Error(`Error at the server. Please try again later.`);
    }
  },
  // Protect routes
  async checkToken(token) {
    try {
      let results = await account.findOne({ token: token });
      return results;
    }
    catch (e) {
      console.log(e.message);
      throw new Error(`Error at the server. Please try again later.`);
    }
  },
  // Logout routes
  async removeToken(id) {
    try {
      await account.findByIdAndUpdate(id, { $unset: { token: 1 } });
      return;
    }
    catch (e) {
      console.log(e.message);
      throw new Error(`Error at the server. Please try again later.`);
    }
  }
}

module.exports = db;


/*   //Search Movie
  async searchMovie(title, year, genre) {
    try {
      // Constructing the query object dynamically based on provided parameters
      let query = {};

      if (title) {
        query.title = { $regex: title, $options: 'i' };
      }

      if (year) {
        query.year = year;
      }

      if (genre) {
        query.genre = { $regex: genre, $options: 'i' };
      }

      // Using the constructed query to find movies
      let results = await movie.find(query);
      if (results.length == 0) {
        return "No movies found with the provided value.";
      }
      return results;
    }
    catch (e) {
      console.log(e.message);
      throw new Error("Error retrieving Movie");
    }
  }, 
   //Update Movie by Title
    async updateMovie(conditions, updates) {
      try {
        let result = await movie.findOneAndUpdate(conditions, updates)
        if (!result) return `Unable to find Movie to update.`;
        else return `Movie is updated!`;
      }
      catch (e) {
        console.log(e.message);
        throw new Error(`Error updating Movie`);
      }
    },
  
  
    //Delete Movie by Title
    async deleteMovie(conditions) {
      try {
        let result = await movie.findOneAndDelete(conditions);
        if (!result) return "Unable to find Movie to delete.";
        else return "Movie is deleted!";
      }
      catch (e) {
        console.log(e.message);
        throw new Error("Error deleting Movie");
      }
    }, */