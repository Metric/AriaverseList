'use strict';

const Express = require('express');
const io = require('dataio');
const UUID = require('node-uuid');
const _ = require('underscore');
const Config = require('./config');

const serverList = [];

const app = Express();

app.get('/servers', (req, res) => {
    res.json(serverList);
});

const nio = new io(app.listen(Config.port, Config.address, () => {console.log('listening on ' + Config.address + ":" + Config.port)})).on('connection', (socket) => {
    socket.id = UUID.v4();
    socket.on('close', function() {
        var i = _.findIndex(serverList, (item) => {
                if(item.id == this.id) {
                    return true;
                }

                return false;
        });

        if(i > -1) {
            console.log('listing removed');
            serverList.splice(i,1);
        }
    });
    socket.on('list', function(name, desc, host, port) {
        var h = {
            id: socket.id,
            name: name,
            description: desc,
            host: host,
            port: port
        };

        var i = _.findIndex(serverList, (item) => {
            if(item.id == this.id) {
                return true;
            }

            return false;
        });

        if(i == -1) {
            console.log('new listing received');
            serverList.push(h);
        }
        //otherwise just update the listing
        else {
            console.log('updating listing');
            var old = serverList[i];

            old.name = name;
            old.port = port;
            old.description = desc;
            old.host = host;
        }
    });
});

