const cheerio = require('cheerio');

const addressRegEx = '^(https?):\/\/' +                     // protocol
'(([a-z0-9$_\.\+!\*\'\(\),;\?&=-]|%[0-9a-f]{2})+' +         // username
'(:([a-z0-9$_\.\+!\*\'\(\),;\?&=-]|%[0-9a-f]{2})+)?' +      // password
'@)?(?#' +                                                  // auth requires @
')((([a-z0-9]\.|[a-z0-9][a-z0-9-]*[a-z0-9]\.)*' +           // domain segments AND
'[a-z][a-z0-9-]*[a-z0-9]' +                                 // top level domain  OR
'|((\d|[1-9]\d|1\d{2}|2[0-4][0-9]|25[0-5])\.){3}' +
'(\d|[1-9]\d|1\d{2}|2[0-4][0-9]|25[0-5])' +                 // IP address
')(:\d+)?' +                                                // port
')(((\/+([a-z0-9$_\.\+!\*\'\(\),;:@&=-]|%[0-9a-f]{2})*)*' + // path
'(\?([a-z0-9$_\.\+!\*\'\(\),;:@&=-]|%[0-9a-f]{2})*)' +      // query string
'?)?)?' +                                                   // path and query string optional
'(#([a-z0-9$_\.\+!\*\'\(\),;:@&=-]|%[0-9a-f]{2})*)?' +      // fragment
'$'

const validAddress = new RegExp(addressRegEx, 'i');

const guidRegEx = '^{?[0-9a-f]{8}-?[0-9a-f]{4}-?[1-5][0-9a-f]{3}-?[89ab][0-9a-f]{3}-?[0-9a-f]{12}}?$';
const validGuid = new RegExp(guidRegEx, 'i');

class ServerValidator {
    constructor() {}

    validateAndClean(s) {
        const cserver = {};

        if(!this.isValidID(s.iD)) {
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
            return null;
        }

        cserver.address = this.clean(s.address);

        if(!this.isValidName(s.name)) {
            return null;
        }

        cserver.name = this.clean(s.name);

        if(!this.isValidDescription(s.description)) {
            return null;
        }

        cserver.description = this.clean(s.description);

        if(!this.isValidPlayers(s.maxPlayers)) {
            return null;
        }

        cserver.maxPlayers = s.maxPlayers;

        if(!this.isValidPlayers(s.numPlayers)) {
            return null;
        }

        cserver.numPlayers = s.numPlayers;

        if(!this.isValidPing(s.ping)) {
            return null;
        }

        cserver.ping = s.ping;

        if(!this.isValidBeacon(s.beaconPort)) {
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

    isValidAddress(a) {
        if(typeof a != 'string') {
            return false;
        }

        if(a.match(validAddress) && a.length < 2048) {
            return true;
        }

        return false;
    }
}

module.exports = exports = ServerValidator;