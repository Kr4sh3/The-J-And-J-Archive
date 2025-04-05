//Imports
import express from 'express';
import morgan from "morgan";
import routes from './routes.js';
import cors from 'cors';

//Env variables
const HOST = process.env.HOST;
const PORT = process.env.PORT;

const app = express();

//enable cross origin resource sharing
app.use(cors({origin: true,credentials: true}));

//HTTP request logging
app.use(morgan('dev'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
      );
    next();
});

//Home route
app.get('/', (req, res) => {
    return res.send("Welcome to the J & J Archive");
})

// Add routes.
app.use('/api', routes);

// Send 404 if no other route matched.
app.use((req, res) => {
    res.status(404).json({
        message: 'Route Not Found',
    });
});

// Setup a global error handler.
app.use((err, req, res, next) => {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);

    res.status(500).json({
        message: err.message,
        error: process.env.NODE_ENV === 'production' ? {} : err,
    });
});

app.listen(PORT, HOST, () => {
    console.log(`Server running on ${HOST}:${PORT}`);
});