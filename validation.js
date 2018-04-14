const cheerio = require('cheerio');

const addressRegEx = '^(?:(?:https?):\/\/)?(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$';

const validAddress = new RegExp(addressRegEx, 'i');

const guidRegEx = '^[A-F0-9]{32}$';
const validGuid = new RegExp(guidRegEx, 'i');

class ServerValidator {
    constructor() {}

    validateAndClean(s) {
        const cserver = {};

        if(!this.isValidID(s.iD)) {
            console.log('invalid id');
            return null;
        }

        cserver.iD = this.clean(s.iD);

        if(!this.isValidIcon(s.icon)) {
            cserver.icon = this.clamp(s.icon,0,4);
        }
        else {
            cserver.icon = s.icon;
        }

        if(!this.isValidAddress(s.address)) {
            console.log('invalid address');
            return null;
        }

        cserver.address = this.clean(s.address);

        if(!this.isValidName(s.name)) {
            console.log('invalid name');
            return null;
        }

        cserver.name = this.clean(s.name);

        if(!this.isValidDescription(s.description)) {
            console.log('invalid description');
            return null;
        }

        cserver.description = this.clean(s.description);

        if(!this.isValidPlayers(s.maxPlayers)) {
            console.log('invalid max players');
            return null;
        }

        cserver.maxPlayers = s.maxPlayers;

        if(!this.isValidPlayers(s.numPlayers)) {
            console.log('invalid num players');
            return null;
        }

        cserver.numPlayers = s.numPlayers;

        if(!this.isValidPing(s.ping)) {
            console.log('invalid ping');
            return null;
        }

        cserver.ping = s.ping;

        if(!this.isValidBeacon(s.beaconPort)) {
            console.log('invalid beacon port');
            return null;
        }

        cserver.beaconPort = s.beaconPort;

        return cserver;
    }

    clamp(t, min, max) {
        if(t < min) return min;
        if(t > max) return max;
        return t;
    }

    clean(t) {
        const $ = cheerio.load('<div>' + t + '</div>');
        return $.text();
    }

    isValidIcon(i) {
        if(typeof i != 'number') {
            return false;
        }

        if(i >= 0 && i <= 4) {
            return true;
        }

        return false;
    }

    isValidPing(n) {
        if(typeof n != 'number') {
            return false;
        }

        if(n >= 0 && n <= 999) {
            return true;
        }

        return false;
    }

    isValidName(n) {
        if(typeof n != 'string') {
            return false;
        }

        if(n.length <= 256) {
            return true;
        }

        return flase;
    }

    isValidDescription(d) {
        if(typeof d != 'string') {
            return false;
        }

        if(d.length <= 2048) {
            return true;
        }

        return false;
    }

    isValidPlayers(n) {
        if(typeof n != 'number') {
            return false;
        }

        if(n <= 200 && n >= 0) {
            return true;
        }

        return false;
    }

    isValidBeacon(b) {
        if(typeof b != 'number') {
            return false;
        }

        if(b <= 64000 && b >= 0) {
            return true;
        }

        return false;
    }

    isValidID(id) {
        if(typeof id != 'string') {
            return false;
        }

        if(id.match(validGuid)) {
            return true;
        }

        return false;
    }

    isValidIP4(ip) {
        if(typeof ip != 'string') {
            return false;
        }

        const portSplit = ip.split(':');

        if(portSplit.length != 2) {
            console.log('invalid port split');
            return false;
        }

        const port = parseInt(portSplit[1]);

        if(port < 0 || port >= 65535) return false;

        const split = portSplit[0].split('.');

        if(split.length != 4) {
            console.log('invalid ip split');
            return false;
        }
        
        for(let i = 0; i < split.length; i++) {
            const value = parseInt(split[i]);
            if(value < 0 || value > 255) return false;
        }

        return true;
    }

    isValidAddress(a) {
        if(typeof a != 'string') {
            console.log('address isnt a string...');
            return false;
        }

        if((a.match(validAddress) && a.length < 2048) || this.isValidIP4(a)) {
            return true;
        }

        return false;
    }
}

module.exports = exports = ServerValidator;