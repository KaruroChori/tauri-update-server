import http from 'http';
import { promises as fs } from 'fs';
import { Sequelize, Op, Model, DataTypes } from 'sequelize';

import initModels from'./models/init-models.js'

const host = 'localhost';
const port = 8000;

const requestListener = async function (req, res) {
    try{
        //let tmp = JSON.stringify(await file().catch(err => { throw new Error('DirError') }))
        let tmp = `{"hello":"World"}`
        res.setHeader("Content-Type", "application/json");
        res.writeHead(200);
        res.end(tmp);
    }
    catch(e) {
        res.writeHead(500);
        res.end(e);
    };
};

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
    const { events, licences, releases } = initModels(db)
    console.log('Entities have been initialized.')
    //licences;
    const li1 = await licences.create({ 'public-key': "OSSA" })
    console.log("Auto-generated ID:", li1.id);
} catch (error) {
  console.error('Writing error:', error);
}



const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});