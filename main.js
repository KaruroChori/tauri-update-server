import http from 'http';
import url from 'url';
import { promises as fs } from 'fs';
import { Sequelize, Op, Model, DataTypes } from 'sequelize';

import initModels from'./models/init-models.js'
import licences from './models/licences.js';
import { c } from 'tar';

const host = 'localhost';
const port = 8000;


const db = new Sequelize({
  dialect: 'sqlite',
  storage: './private/db'
});

try {
  await db.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}


try {
    const { events, licences, releases, channels, subscriptions } = initModels(db)
    console.log('Entities have been initialized.')
}
catch (error) {
    console.error('DB initialization error (by sequelize):', error);
}

//Set default values for channels and licences in case applications do not have one.
const default_channel = 'free'
const default_licence = 'free-licence'


const requestListener = async function (req, res) {
    try {
        const parts = req.url.split('/');
        let arch = ""
        let current_release = ""
        let target_release = ""
        console.log(parts);
        if (parts.length == 4 || parts.length == 3) {
            arch = parts[1];
            current_release = parts[2];
            if(parts.length == 4)target_release = parts[3]
        }
        else {
            throw new Error('Malformed URL');
        }
        const client_secret = req.headers['secret'] ? req.headers['secret'] : default_licence;

        //Look for licences matching the client's secret.
        const secret_match = await licences.findAll({
            where: {
                secret: client_secret
            }
        })

        //No match found. For the user this means no update has been discovered.
        if (secret_match.length == 0) {
            res.writeHead(204);
            res.end();
            return;
        }

        //Match found, but the licence is not enabled.
        if (secret_match[0]['enabled'] == false) {
            res.writeHead(204);
            res.end();
            return;            
        }

        //let tmp = JSON.stringify(await file().catch(err => { throw new Error('DirError') }))
        let tmp = `{"hello":"World","url":"`+req.url+`"}`
        res.setHeader("Content-Type", "application/json");
        res.writeHead(200);
        res.end(tmp);
    }
    catch (e) {
        console.log(e)
        res.writeHead(500);
        res.end(JSON.stringify(e));
    };
};



const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});