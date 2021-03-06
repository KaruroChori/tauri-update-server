import http from 'http';
import url from 'url';
import path from 'path';
import { fileURLToPath } from 'url';

import crypto from 'crypto';
import { promises as fs } from 'fs';
import { Sequelize, Op, Model, DataTypes } from 'sequelize';

//import initModels from'./models/init-models.js'
import {dbSchemas,apiSchemas} from '@taus-services/commons'


import { fastify } from 'fastify'

const default_config = {
    host: 'localhost',
    port: 8000,
    db: {
        dialect: 'sqlite',
        storage: './example/db'
    },
    default_channel: 'free',
    default_secret: 'free-licence',
    fastify: {},
    storage: {
        protocol:"http",
        base:"/s/"
    },
    update: {
        protocol: "http",
        base:"/u/"
    },
    dbSchemas: dbSchemas
}

export const taus = async (configi) => {

    let config = {}
    //Use default_config as backup values
    Object.keys({...configi,...default_config}).map(key=>{
        config[key]=configi[key]||default_config[key]
    })

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const server = fastify(config.fastify);

    const host = config.host;
    const port = config.port;


    const db = new Sequelize(config.db);

    try {
    await db.authenticate();
    console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        throw new Error('DB failure')
    }

    const { events, licences, releases, channels, subscriptions, archs } = config.dbSchemas(db)
    
    //This is here until a new version of Sequelize will add a specific directive to prevent the automatic generation of a primary key.
    subscriptions.removeAttribute('id')


    //Set default values for channels and licences in case applications do not have one.
    const default_channel = config.default_channel
    const default_secret = config.default_secret

    server.get(config.storage.base+'*', async (req, res) => {
        try {
            const parts = req.url.split('/');
            let token = ""
            if (parts.length == 3) {
                token = parts[2];
            }
            else {
                throw new Error('Malformed URL');
            }

            const token_match = await events.findAll({
                where: {
                    token: token
                }
            })

            if (token_match.length == 0) { res.code(404).send('Error 404: Content does not exist'); return; }                      // No token under this name
            if (token_match[0].used == true) { res.code(410).send('Error 410: Content expired'); return;}                   // Token already being used.

            await events.update({ used: true }, {
                where: {
                    id: token_match[0].id
                }
            });

            const release_match = await releases.findAll({
                where: {
                    id: token_match[0].release
                }
            })

            if (release_match.length == 0) { res.code(404).send('Error 404: Content does not exist'); return; }                      // Release does not exists. It should never happen.
            console.log(release_match[0].path)
            const buffer = await fs.readFile(release_match[0].path)
            res.header("Content-Disposition", 'attachment;')
            res.header("Content-Type", "application/octet-stream");
            res.code(200)
            res.send(buffer)
        }
        catch (e) {
            console.log(e)
            res.header("Content-Type", "application/json");
            res.code(500).send(JSON.stringify(e));
        };
    })


    server.get(config.update.base+'*', async (req, res) => {
        try {
            const parts = req.url.split('/');
            let client_arch = ""
            let client_release = ""
            if (parts.length == 4) {
                client_arch = parts[2];
                client_release = parts[3];
            }
            else {
                throw new Error('Malformed URL');
            }

            const client_channel = req.headers['channel'] ? req.headers['channel'] : default_channel;
            const client_secret = req.headers['secret'] ? req.headers['secret'] : default_secret;

            const secret_match = await licences.findAll({
                where: {
                    secret: client_secret
                }
            })

            if (secret_match.length == 0) { res.code(204).send(); return; }                // No licence found
            if (secret_match[0]['enabled'] == false) { res.code(204).send(); return; }     // Licence is not enabled

            const arch_match = await archs.findAll({
                where: {
                    label: client_arch
                }
            })

            if (arch_match.length == 0) {res.code(204).send();return;}                   // No arch under this name

            const channel_match = await channels.findAll({
                where: {
                    label: client_channel
                }
            })

            if (channel_match.length == 0) {res.code(204).send();return;}                   // No channel under this name

            // Check if the current licence has permission
            const subscription_match = await subscriptions.count({
                where: {
                    licence: secret_match[0].id,
                    channel: channel_match[0].id
                }
            })

            if (subscription_match == 0) { res.code(204).send(); return; }              // No permission for the current licence
            
            // Generate the list of compatible releases.
            // At the moment the suggested release value is ignored since the updater server does not have to respect it.
            const release_match = await releases.findAll({
                where: {
                    arch: arch_match[0].id,
                    enabled: true,
                    version: {
                        [Op.gt]: client_release
                    },
                    channel: channel_match[0].id
                },
                order: [['version', 'DESC']],
                limit: 1
            })

            if (release_match.length == 0) { res.code(204).send(); return; }             // The "good" failure. No update exists; period.

            // Register the update event on events
            const timestamp = Date.now();

            const event_submit = await events.create({
                licence: secret_match[0].id,
                initial: client_release,
                release: release_match[0].id,
                date: timestamp,
                token: timestamp+"_"+crypto.randomBytes(64).toString('hex')
            });

            let tmp = {
                "url": config.storage.protocol+"://"+req.hostname+config.storage.base+event_submit.token,
                "version": release_match[0].version,
            }
            if (release_match[0].notes) tmp["notes"] = release_match[0].notes;
            if (release_match[0].date) tmp["pub_date"] = release_match[0].date;
            if (release_match[0].signature) tmp["signature"] = release_match[0].signature;

            res.header("Content-Type", "application/json");
            res.code(200);
            res.send(JSON.stringify(tmp));
        }
        catch (e) {
            console.log(e)
            res.header("Content-Type", "application/json");
            res.code(500).send(JSON.stringify(e));
        };
    })

    try {
        await server.listen(port)
    } catch (err) {
        server.log.error(err)
        process.exit(1)
    }
}
