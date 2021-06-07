const express = require('express');
const methodOverride  = require('method-override');
const mongoose = require ('mongoose');
const db = mongoose.connection;

// App configuration
const app = express();
const PORT = process.env.PORT || 3000;

// Express Middleware
app.use(express.urlencoded({ extended: true }));


// This makes and names the database whatever is after the /
mongoose.connect('mongodb://localhost:27017/project2',{         useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false 
});

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/'+ 'project2';

// mongoose.connect(MONGODB_URI ,  { useNewUrlParser: true});

mongoose.connection.once('open', () => {
    console.log('connected to mongo');
});

// Error / success
db.on('error', (err) => console.log(err.message + ' is Mongod not running?'));
db.on('connected', () => console.log('mongo connected: ', MONGODB_URI));
db.on('disconnected', () => console.log('mongo disconnected'));

// open the connection to mongo
db.on('open' , ()=>{});


app.use(express.static('public'));

// populates req.body with parsed info from forms - if no data from forms will return an empty object {}
app.use(express.urlencoded({ extended: false }));// extended: false - does not allow nested objects in query strings
app.use(express.json());// returns middleware that only parses JSON - may or may not need it depending on your project


//use method override
app.use(methodOverride('_method'));// allow POST, PUT and DELETE from a form


// import our models
const Game = require('./models/fruits.js');


// ROUTES
app.get('/games', (req, res) => {
    Game.find({}, (error, allGames) => {
        if (error) {
            res.send(error)
        } else {
            res.render('index.ejs', { 
                games: allGames 
            });
        }
    })

});

app.get('/games/new', (req, res) => {
    res.render('new.ejs');
});


app.post('/games', (req, res) => {
    console.log(req.body);

    if (req.body.iPlayed === 'on') {
        req.body.iPlayed = true;
    } else {
        req.body.iPlayed = false;
    }
    console.log(req.body);

    Game.create(req.body, (error, createdGame) => {
        res.send(createdGame);
    });
});

app.get('/games/:id', (req, res) => {
    console.log(req.params.id)
    Game.findById(req.params.id, (error, foundGame) => {
        res.render('show.ejs', {
            games: foundGame
        })
    })
})

app.delete('/games/:id', (req, res) => {
    Game.findByIdAndRemove(req.params.id, (error, deletedGame) => console.log(deletedGame))
    res.send('destroying');
});

app.get('/games/:id/edit', (req, res) => {
    Game.findById(req.params.id, (error, foundGame) => {
        res.render('edit.ejs', {
            games: foundGame
        })
    })
})

app.put('/games/:id', (req, res) => {
    if (req.body.iPlayed === 'on') {
        req.body.iPlayed = true;
    } else {
        req.body.iPlayed = false;
    }
    Game.findByIdAndUpdate(req.params.id, req.body, {new:true}, (err, updatedModel) => {
        console.log(updatedModel)
        res.redirect('/games')
    })
})
app.listen(PORT, () => {
    console.log('Server is up and running on port ' + PORT);
});