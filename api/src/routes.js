import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { User, Pokemon } from './models/index.js'
import authenticateUser from './auth-user.js';

// Construct a router instance.
const router = express.Router();

//Set static folder
router.use(express.static('../storage/static'));

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
        const filePath = `${req.params.user}/${req.params.id}`;
        req.publicFilePath = `/api/${filePath}`;
        fs.mkdirSync(`../storage/static${filePath}`, { recursive: true })
        callback(null, `../storage/static${filePath}`);

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
    const pokemon = await Pokemon.findAll({ attributes: ['id', 'name', 'jessehas', 'jasminehas', 'jesselocation', 'jasminelocation', 'defaultlocation'], });
    res.json(pokemon)
}));

//Pokeget 1
router.get('/pokemon/:id', asyncHandler(async (req, res) => {
    const pokemon = await Pokemon.findOne({ where: { id: req.params.id }, attributes: { exclude: ['createdAt', 'updatedAt'] }, });
    res.json(pokemon)
}));

//Pokeupload
router.post('/pokemon/:id/:user', authenticateUser, upload.any(), asyncHandler(async (req, res) => {
    const pokemon = await Pokemon.findByPk(req.params.id);
    if (!pokemon)
        return res.json("Couldnt find a pokemon with that id!");
    const root = "./src/public/";
    if (req.params.user === "Jesse") {
        if (req.publicFilePath) {
            pokemon.jessehas = true;
            if (pokemon.jesselocation && pokemon.jesselocation !== `${req.publicFilePath}/${req.fileName}`)
                fs.unlink(`${root}${pokemon.jesselocation.slice(5)}`, (err) => {
                    if (err) throw err;
                    console.log(`${root}${pokemon.jesselocation.slice(5)} was deleted!`);
                })
            pokemon.jesselocation = `${req.publicFilePath}/${req.fileName}`;
        }
        if (req.body.note)
            req.body.note === "empty" ? pokemon.jessenote = null : pokemon.jessenote = req.body.note;
        if (req.body.chasecard)
            req.body.chasecard === "empty" ? pokemon.jessechasecard = null : pokemon.jessechasecard = req.body.chasecard;
        pokemon.save();
        return res.json(`Jesse's information for ${pokemon.name} has now been updated!`);
    } else if (req.params.user === "Jasmine") {
        if (req.publicFilePath) {
            pokemon.jasminehas = true;
            if (pokemon.jasminelocation && pokemon.jasminelocation !== `${req.publicFilePath}/${req.fileName}`)
                fs.unlink(`${root}${pokemon.jasminelocation.slice(5)}`, (err) => {
                    if (err) throw err;
                    console.log(`${root}${pokemon.jesselocation.slice(5)} was deleted!`);
                })
            pokemon.jasminelocation = `${req.publicFilePath}/${req.fileName}`;
        }
        if (req.body.note)
            req.body.note === "empty" ? pokemon.jasminenote = null : pokemon.jasminenote = req.body.note;
        if (req.body.chasecard)
            req.body.chasecard === "empty" ? pokemon.jasminechasecard = null : pokemon.jasminechasecard = req.body.chasecard;
        pokemon.save();
        return res.json(`Jasmine's information for ${pokemon.name} has now been updated!`);
    } else {
        return res.json(`Incorrect url!`);
    }
}));

//Pokedelete
router.delete('/pokemon/:id/:user', authenticateUser, asyncHandler(async (req, res) => {
    const pokemon = await Pokemon.findByPk(req.params.id);
    if (!pokemon)
        return res.json("Couldnt find a pokemon with that id!");

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
        return res.json(`${pokemon.name} was successfully deleted!`);
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
        return res.json(`${pokemon.name} was successfully deleted!`);
    } else {
        return res.json(`Incorrect url!`);
    }
}));

//User creation
router.post('/user', upload.none(), asyncHandler(async (req, res) => {
    try {
        if (req.body.email === null || req.body.email === "" || req.body.email === undefined) {
            res.status(400);
            return res.json(["Error! Please provide a email!"]);
        }

        if (req.body.email.toUpperCase() === "pokemonjm@gmail.com".toUpperCase() || req.body.email.toUpperCase() === "jasminevtemple@gmail.com".toUpperCase()) {
            await User.create(req.body);
            res.status(201);
            return res.json("User successfully created!");
        } else {
            res.status(401);
            return res.json(["Sorry! You're not authenticated to use this site!"]);
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
        if (user === null)
            return res.send("That user does not exist!");
        user.destroy();
        return res.json(`${req.params.user} has been deleted!`);
    } catch (err) {
        return res.json(err);
    }
}));

//Setup calls

/*
function isEmptyArray(arr) {
    return Array.isArray(arr) && arr.length === 0;
}

const recursivePokemonFetch = async (next) => {
    await fetch(next)
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
        })
        .then(async (data) => {
            const fetches = data.results.map((pokemon, index) => {
                const tcg_api = `https://api.pokemontcg.io/v2/cards?q=name:${pokemon.name}`;
                const tcgOptions = {
                    headers: {
                        "X-Api-Key": "API KEY GOES HERE"
                    }
                };
                return fetch(tcg_api, tcgOptions).then(res => res.json());
            });
            const locations = await Promise.all(fetches).then((fetchData) => {
                const filteredData = fetchData.filter((value) => value !== undefined);
                const locationData = filteredData.map((fetch) => {
                    if(isEmptyArray(fetch.data)){
                        return "MISSING DATA";
                    }
                    console.log(fetch.data[0].name);
                    const location = fetch.data[0].images.large;
                    return location;
                })
                return locationData;
            });
            data.results.map((pokemon, index) => {
                Pokemon.create({
                    name: pokemon.name, jessehas: false, jasminehas: false, defaultlocation: locations[index]
                })
            })
            if (data.next) {
                recursivePokemonFetch(data.next);
            }
        })
        .catch(error => {
            console.log('Fetch error: ', error);
        });
}
*/

/*
//Seed database
router.post('/pokemon/seed', authenticateUser, asyncHandler(async (req, res) => {
    recursivePokemonFetch('https://pokeapi.co/api/v2/pokemon/');
    res.send("Database seeded!");
}));
*/

/*
//Drop all unnecessary pokemon
router.delete('/pokemon/dropextra', authenticateUser, asyncHandler(async (req, res) => {
    for (let i = 1026; i <= 1302; i++) {
        const pokemon = await Pokemon.findByPk(i);
        pokemon.destroy();
    }
    res.send("Extras dropped!");
}));
*/

/*
//Add default image for pokemon
router.put('/pokemon/default/:id', upload.none(), authenticateUser, asyncHandler(async (req, res) => {
    const pokemon = await Pokemon.findByPk(req.params.id);
    pokemon.defaultlocation = req.body.location;
    pokemon.save();
    res.send("Pokemon Default Updated!");
}));
*/

export default router;