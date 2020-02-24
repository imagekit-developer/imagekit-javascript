const path = require('path');
const open = require('open');
const dotenv = require('dotenv').config({path: path.join(__dirname, ".env")});
const server = require('./server/server.js');


const STATIC_PAGE = path.join(__dirname, "client/index.html")

if (dotenv.error) {
    throw new Error(dotenv.error);
    process.exit(1);
} 

const {PRIVATE_KEY, PUBLIC_KEY, URL_ENDPOINT, SERVER_PORT} = dotenv.parsed;

if (!PRIVATE_KEY || !PUBLIC_KEY || !URL_ENDPOINT || !SERVER_PORT) {
    throw new Error("Missing values in the '.env' file.")
}


server
    .startServer(SERVER_PORT, PUBLIC_KEY, PRIVATE_KEY, URL_ENDPOINT)
    .then(() => {
        try {
            return open(`http://localhost:${SERVER_PORT}`, {wait: true});
        } catch (err){
            console.error(JSON.stringify(err, undefined, 2))
            throw new Error(`Error opening the static page ${STATIC_PAGE}.`)
        }
    })
    .then(() => {
        console.log("Exiting app.");
        process.exit(0);
    })
    .catch(err => {
        console.log("Error:", JSON.stringify(err, undefined, 2));
        process.exit(1);
    });
    


