import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { User, Pokemon } from './models/index.js'
import authenticateUser from './auth-user.js';
//import { recursivePokemonFetch } from './models/pokemon.js';

// Construct a router instance.
const router = express.Router();

//Set static folder
router.use(express.static(path.resolve(import.meta.dirname, 'public')));

//Helper function to get filename extension
function getFileExtension(filename) {
    if (typeof filename !== 'string') {
        return '';
    }
    const parts = filename.split('.');
    if (parts.length <= 1) {
        return '';
    }
    return parts.pop();
}

//Set location and names of pokefiles to be stored
var storage = multer.diskStorage({
    destination: async function (req, file, callback) {
        const user = await User.findOne({ where: { name: req.params.user } })
        if (!user)
            callback(new Error("That user does not exist in the database!"));

        const pokemon = await Pokemon.findByPk(req.params.id);
        if (!pokemon)
            callback(new Error("No pokemon with that id!"))
        const filePath = `${req.params.id}/${req.params.user}`;
        req.publicFilePath = `/api/${filePath}`;
        fs.mkdirSync(`./src/public/${filePath}`, { recursive: true })
        callback(null, `./src/public/${filePath}`);

    },
    filename: async function (req, file, callback) {
        const pokemon = await Pokemon.findByPk(req.params.id);
        if (pokemon) {
            const fileName = `${pokemon.name}.${getFileExtension(file.originalname)}`;
            req.fileName = fileName;
            callback(null, fileName);
        } else {
            callback(new Error("No pokemon with that id!"))
        }

    }
});

//Configure multer
const upload = multer({ dest: path.resolve(import.meta.dirname, 'public'), storage: storage });

// Handler function to wrap each route and handle unhandled errors
function asyncHandler(cb) {
    return async (req, res, next) => {
        try {
            await cb(req, res, next);
        } catch (error) {
            // Forward error to the global error handler
            next(error);
        }
    }
}

//Routes

//Pokeget all
router.get('/pokemon', asyncHandler(async (req, res) => {
    const pokemon = await Pokemon.findAll({ attributes: ['id', 'name', 'jessehas', 'jasminehas', 'jesselocation', 'jasminelocation'], });
    res.json(pokemon)
}));

//Pokeget 1
router.get('/pokemon/:id', asyncHandler(async (req, res) => {
    const pokemon = await Pokemon.findOne({ where: { id: req.params.id }, attributes: { exclude: ['createdAt','updatedAt'] }, });
    res.json(pokemon)
}));

//Pokeupload
router.post('/pokemon/:id/:user', authenticateUser, upload.any(), asyncHandler(async (req, res) => {
    const pokemon = await Pokemon.findByPk(req.params.id);
    if (!pokemon)
        return res.send("Couldnt find a pokemon with that id!");
    if (req.params.user === "Jesse") {
        if (req.publicFilePath) {
            pokemon.jessehas = true;
            pokemon.jesselocation = `${req.publicFilePath}/${req.fileName}`;
        }
        if (req.body.note)
            req.body.note === "empty" ? pokemon.jessenote = null : pokemon.jessenote = req.body.note;
        if (req.body.chasecard)
            req.body.chasecard === "empty" ? pokemon.jessechasecard = null : pokemon.jessechasecard = req.body.chasecard;
        pokemon.save();
        return res.send(`Jesse's information for ${pokemon.name} has now been updated!`);
    } else if (req.params.user === "Jasmine") {
        if (req.publicFilePath) {
            pokemon.jasminehas = true;
            pokemon.jasminelocation = `${req.publicFilePath}/${req.fileName}`;
        }
        if (req.body.note)
            req.body.note === "empty" ? pokemon.jasminenote = null : pokemon.jasminenote = req.body.note;
        if (req.body.chasecard)
            req.body.chasecard === "empty" ? pokemon.jasminechasecard = null : pokemon.jasminechasecard = req.body.chasecard;
        pokemon.save();
        return res.send(`Jasmine's information for ${pokemon.name} has now been updated!`);
    } else {
        return res.send(`Incorrect url!`);
    }
}));

//Pokedelete
router.delete('/pokemon/:id/:user', authenticateUser, asyncHandler(async (req, res) => {
    const pokemon = await Pokemon.findByPk(req.params.id);
    if (!pokemon)
        return res.send("Couldnt find a pokemon with that id!");

    const root = "./src/public/";
    if (req.params.user === "Jesse") {
        const jesselocation = pokemon.jesselocation.slice(5);
        const filelocation = `${root}${jesselocation}`;
        fs.unlink(filelocation, (err) => {
            if (err) throw err;
            console.log(`${filelocation} was deleted!`);
        })
        pokemon.jesselocation = null;
        pokemon.jessehas = false;
        pokemon.save();
        return res.send(`${pokemon.name} was successfully deleted!`);
    } else if (req.params.user === "Jasmine") {
        const jasminelocation = pokemon.jasminelocation.slice(5);
        const filelocation = `${root}${jasminelocation}`;
        fs.unlink(filelocation, (err) => {
            if (err) throw err;
            console.log(`${filelocation} was deleted!`);
        })
        pokemon.jasminelocation = null;
        pokemon.jasminehas = false;
        pokemon.save();
        return res.send(`${pokemon.name} was successfully deleted!`);
    } else {
        return res.send(`Incorrect url!`);
    }
}));

//User creation
router.post('/user', upload.none(), asyncHandler(async (req, res) => {
    try {
        if (req.body.email.toUpperCase() === "pokemonjm@gmail.com".toUpperCase() || req.body.email.toUpperCase() === "jasminevtemple@gmail.com".toUpperCase()) {
            await User.create(req.body);
            res.status(201);
            return res.send("User successfully created!");
        } else {
            return res.send("Sorry! You're not authenticated to use this site!");
        }
    } catch (err) {
        const errors = err.errors.map((error) => { return error.message });
        res.status(400)
        return res.json(errors);
    }

}));

//User Authenticate
router.get('/user', authenticateUser, upload.none(), asyncHandler(async (req, res) => {
    const returnDetails = { name: req.currentUser["name"], email: req.currentUser["email"] }
    return res.json(returnDetails);
}));

//User Delete (For resetting passwords)
router.delete('/user/:user', authenticateUser, asyncHandler(async (req, res) => {
    try {
        const user = await User.findOne({ where: { name: req.params.user } });
        console.log(user);
        if (user === null)
            return res.send("That user does not exist!");
        user.destroy();
        return res.send(`${req.params.user} has been deleted!`);
    } catch (err) {
        return res.send(err);
    }
}));

/*
//Seed database
router.post('/pokemon/seed', authenticateUser, asyncHandler(async (req, res) => {
    recursivePokemonFetch('https://pokeapi.co/api/v2/pokemon/');
    res.send("Database seeded!");
}));
*/

export default router;