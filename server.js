'use strict';

const Express = require('express');
const _ = require('underscore');
const Config = require('./config');
const bodyparser = require('body-parser');
const ServerValidator = require('./validation');

const validator = new ServerValidator();
const timeOut = 60;
const serverList = [];

const serverUpdateCheck = setInterval(() => {	
	for(let i = 0; i < serverList.length; i++) {
		let s = serverList[i];
		const diff = (new Date().getTime() - s.lastUpdate) / 1000;
		
		if(diff >= timeOut) {
			serverList.splice(i,1);
			i--;
		}
	}
}, 60000);

const app = Express();

app.use(bodyparser.json());

app.get('/servers', (req, res) => {
    let l = '';
	
	for(let i = 0; i < serverList.length; i++) {
        const line = JSON.stringify(serverList[i]).replace(/\r\n/gi,'');
        l += line + '\r\n';
    }
    l = l.substring(0, l.length - 2);

    res.end(l);
});

app.post('/list', (req, res) => {
	let listing = req.body;
    
    console.log('incoming before clean: ' + JSON.stringify(listing));
    
	listing = validator.validateAndClean(listing);

    console.log('incoming after clean: ' + JSON.stringify(listing));

	if(!listing) {
		res.end('OK');
		return;
	}

    let i = _.findIndex(serverList, (item) => {
        if(item.iD == listing.iD) {
            return true;
        }

        return false;
    });

    if(i > -1) {
        console.log('updating server listing: ' + JSON.stringify(listing));
        const already = serverList[i];
        already.maxPlayers = listing.maxPlayers;
        already.numPlayers = listing.numPlayers;
        already.name = listing.name;
        already.description = listing.description;
		already.lastUpdate = (new Date().getTime());
    }
    else {
        console.log('listing new server: ' + JSON.stringify(listing));
		listing.lastUpdate = (new Date().getTime());
		serverList.push(listing);
    }

    res.end('OK');
});

app.post('/unlist', (req, res) => {
	console.log('unlist called');
	let listing = req.body;
	
	listing = validator.validateAndClean(listing);

	if(!listing) {
		res.end('OK');
		return;
	}

    let i = _.findIndex(serverList, (item) => {
        if(item.iD == listing.iD) {
            return true;
        }

        return false;
    });

    if(i > -1) {
        console.log('unlisting server');
        serverList.splice(i,1);
    }

    res.end('OK');
});

app.listen(Config.port, Config.address, () => {console.log('listening on ' + Config.address + ":" + Config.port)});