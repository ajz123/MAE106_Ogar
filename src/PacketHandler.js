var Packet = require('./packet');
var Logger = require('./modules/Logger');

function PacketHandler(gameServer, socket) {
    this.gameServer = gameServer;
    this.socket = socket;
    this.merg = false;
    this.pressW = false;
    this.pressSpace = false;
    this.pressShift = false;
    this.massSize = false;
    this.badWords = [];
}

module.exports = PacketHandler;

PacketHandler.prototype.handleMessage = function(message) {
    function stobuf(buf) {
        var length = buf.length;
        var arrayBuf = new ArrayBuffer(length);
        var view = new Uint8Array(arrayBuf);

        for (var i = 0; i < length; i++) {
            view[i] = buf[i];
        }

        return view.buffer;
    }

    var buffer = stobuf(message);
    var view = new DataView(buffer);
    var packetId = view.getUint8(0, true);

    switch (packetId) {
        case 0:
            // Set Nickname
            var nick = "";
            for (var i = 1; i < view.byteLength; i += 2) {
                var charCode = view.getUint16(i, true);
                if (charCode == 0) {
                    break;
                }

                nick += String.fromCharCode(charCode);
            }
            this.setNickname(nick);
            Logger.info(nick + " has joined the server!");
            break;
        case 1:
            // Spectate mode
            if (this.socket.playerTracker.cells.length <= 0) {
                // Make sure client has no cells
                this.socket.playerTracker.spectate = true;
            }
            break;
        case 30:
            // Shift Press - Spectator Switch Mode
            this.pressShift = true;
            break;
        case 16:
            // Mouse Move
            var client = this.socket.playerTracker;
            client.mouse.x = view.getFloat64(1, true);
            client.mouse.y = view.getFloat64(9, true);
            break;

		case 17: 
            // Space Press - Split cell
            this.pressSpace = true;
            break;
		    	 case 87:
this.massSize = true;
		    break;
		     case 52:
this.merg = true;
		    break;
        case 21: 
            // W Press - Eject mass
            this.pressW = true;
            break;
        case 42:
            var message = "";
            for (var i = 1; i < view.byteLength; i += 2) {
                var charCode = view.getUint16(i, true);
                if (charCode == 0) {
                    break;
                }

                message += String.fromCharCode(charCode);
            }
            //console.log("here's the message:" + message);
            this.gameServer.sendMessage(message);
        case 255:
            // Connection Start - Send SetBorder packet first
            var c = this.gameServer.config;
            this.socket.sendPacket(new Packet.SetBorder(c.borderLeft, c.borderRight, c.borderTop, c.borderBottom));
            break;
         case 99:
            var message = "";
            var maxLen = 200 * 2; // 2 bytes per char
            var offset = 2;
            var flags = view.getUint8(1); // for future use (e.g. broadcast vs local message)
            if (flags & 2) {
                offset += 4;
            }
            if (flags & 4) {
                offset += 8;
            }
            if (flags & 8) {
                offset += 16;
            }
            for (var i = offset; i < view.byteLength && i <= maxLen; i += 2) {
                var charCode = view.getUint16(i, true);
                if (charCode == 0) {
                    break;
                }
                message += String.fromCharCode(charCode);
                


            }

            //Chat message debug
            //Logger.info(this.name.playerTracker + "here's the message:" + message);
            //console.log("here's the message:" + message);

            //Command Checker
            if (message[0] =='/') {
                // player command
                message = message.slice(1, message.length);
                //this is causing a lot of problems!!
                //from.socket.playerCommand.executeCommandLine(message);
                return; }

            //Bad word checker
            if (this.checkBadWord(message))
            {   // TODO: LOG that a certain player said a no no word. 
                var packet = new Packet.Chat(this.socket.playerTracker, "Bad word");}
            else
            {var packet = new Packet.Chat(this.socket.playerTracker, message);}
            // Send to all clients (broadcast)
            for (var i = 0; i < this.gameServer.clients.length; i++) {
                this.gameServer.clients[i].sendPacket(packet);
            }
            break;
default:
            break;
    }
}

PacketHandler.prototype.setNickname = function(newNick) {
    //Logger.info(newNick + "has joined the server!");
    var client = this.socket.playerTracker;
    if (client.cells.length < 1) {
        // If client has no cells... then spawn a player
        this.gameServer.spawnPlayer(client);
        
        // Turn off spectate mode
        client.spectate = false;
    }
	client.setName(newNick);
}

PacketHandler.prototype.checkBadWord = function(value) {
    if (!value) return false;
    value = value.toLowerCase().trim();
    //console.log("here's the word: " + value);
    if (!value) return false;
    //console.log("still working");
    for (var i = 0; i < this.gameServer.badWords.length; i++) {
        //console.log(this.gameServer.badWords[i]);
        if (value.indexOf(this.gameServer.badWords[i]) >= 0) {
            return true;
        }
    }
    return false;
}

PacketHandler.prototype.Command = function(val)
{








}