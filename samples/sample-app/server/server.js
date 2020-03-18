const express = require('express');
const router = express.Router();
const cors = require('cors');
const ImageKit = require('imagekit');
const uuid = require('uuid');
const fs = require('fs');
const path = require('path');


//const html = fs.readFileSync(path.join(__dirname, "../views/index.html"));
const js = fs.readFileSync(path.join(__dirname, "../../../dist/imagekit-min.js"));
const pugTemplatePath = path.join(__dirname, "../views/index.pug");


const app = express();
app.use(cors());
app.set('view engine', 'pug');

const startServer = (port = 3000, PUBLIC_KEY, PRIVATE_KEY, URL_ENDPOINT) => {
    return new Promise((resolve, reject) => {
        try {
            const imagekit = new ImageKit({
                publicKey: PUBLIC_KEY,
                privateKey: PRIVATE_KEY,
                urlEndpoint: URL_ENDPOINT
            });

    
            router.get("/auth", (req, res) => {
                try {
                    const token = req.query.token || uuid.v4();
                    const expiration = req.query.expire || parseInt(Date.now()/1000)+ (60 * 10); // Default expiration in 10 mins
    
                    const signatureObj = imagekit.getAuthenticationParameters(token, expiration);
    
                    // Alternate method for genrating signature
                    /*
                    const crypto = require('crypto');
                    const signatureObj = {
                        token,
                        expire: expiration,
                        signature :crypto.createHmac('sha1', privateAPIKey).update(token+expire).digest('hex') 
                    }
                    */
    
                    res.status(200).send(signatureObj);
    
                } catch (err) {
                    console.error("Error while responding to auth request:", JSON.stringify(err, undefined, 2));
                    res.status(500).send("Internal Server Error");
                }
            });

            router.get("/imagekit.js", (req, res) => {
                try {
                    res.set('Content-Type', 'text/javascript');
                    res.send(Buffer.from(js));
                } catch (err) {
                    console.error("Error while responding to static page request:", JSON.stringify(err, undefined, 2));
                    res.status(500).send("Internal Server Error");
                }
            });

            router.get("/", (req, res) => {
                try {
                    res.render(pugTemplatePath, {publicKey: PUBLIC_KEY, urlEndpoint: URL_ENDPOINT, authenticationEndpoint: `http://localhost:3000/auth`});
                } catch (err) {
                    console.error("Error while responding to static page request:", JSON.stringify(err, undefined, 2));
                    res.status(500).send("Internal Server Error");
                }
            });

            



            app.use("/",router);
    
            app.listen(port, () => {
                console.info(`Auth server running on port ${port}.`);
                resolve();
            });
        } catch (err) {
            console.error(JSON.stringify(err, undefined, 2));
            reject("Error starting auth server.")
        }
        
    });
}

module.exports = {
    startServer
}