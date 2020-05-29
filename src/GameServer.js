// Library imports
var WebSocket = require('ws');
var fs = require("fs");
var ini = require('./modules/ini.js');
//var Logger = require('./modules/Logger');


// Project imports
var Packet = require('./packet');
var Entity = require('./entity');
var PlayerTracker = require('./PlayerTracker');
var PacketHandler = require('./PacketHandler');
var Entity = require('./entity');
var Gamemode = require('./gamemodes');

// GameServer implementation
function GameServer() {
    this.srcFiles = "../src";
    // Start msg
    console.log("[Game] Ogar - An open source Agar.io server implementation");

    this.lastNodeId = 1;
    this.clients = [];
    this.nodes = [];
    this.nodesVirus = []; // Virus nodes
    this.nodesEjected = []; // Ejected mass nodes
    this.nodesPlayer = []; // Nodes controlled by players

    this.currentFood = 0;
    this.movingNodes = []; // For move engine
    this.leaderboard = [];

    // Main loop tick
    this.time = new Date();
    this.tick = 0; // 1 second ticks of mainLoop
    this.tickMain = 0; // 50 ms ticks, 40 of these = 1 leaderboard update
    this.tickSpawn = 0; // 50 ms ticks, used with spawning food

    // Config
    this.config = { // Border - Right: X increases, Down: Y increases (as of 2015-05-20)
        serverMaxConnections: 200, // Maximum amount of connections to the server.
        serverPort: 8080, // Server port
        serverGamemode: 0, // Gamemode, 0 = FFA, 1 = Teams
        serverOldColors: 0,// If the server uses colors from the original Ogar
		serverBots: 0, // Amount of player bots to spawn (Experimental)
	    rainbowCells: 0,
        serverViewBase: 1024, // Base view distance of players. Warning: high values may cause lag
        borderLeft: 0, // Left border of map (Vanilla value: 0)
        borderRight: 6000, // Right border of map (Vanilla value: 11180.3398875)
        borderTop: 0, // Top border of map (Vanilla value: 0)
        borderBottom: 6000, // Bottom border of map (Vanilla value: 11180.3398875)
        spawnInterval: 20, // The interval between each food cell spawn in ticks (1 tick = 50 ms)
        foodSpawnAmount: 10, // The amount of food to spawn per interval
        foodStartAmount: 100, // The starting amount of food in the map
        foodMaxAmount: 500, // Maximum food cells on the map
        foodMass: 1, // Starting food size (In mass)
	//foodMaxMass: 4,
        virusMinAmount: 10, // Minimum amount of viruses on the map.
        virusMaxAmount: 50, // Maximum amount of viruses on the map. If this amount is reached, then ejected cells will pass through viruses.
        virusStartMass: 100, // Starting virus size (In mass)
        virusBurstMass: 198, // Viruses explode past this size
        ejectMass: 16, // Mass of ejected cells
        ejectMassGain: 12, // Amount of mass gained from consuming ejected cells
        ejectSpeed: 160, // Base speed of ejected cells
        ejectSpawnPlayer: 50, // Chance for a player to spawn from ejected mass
        playerStartMass: 10, // Starting mass of the player cell.
        playerMaxMass: 22500, // Maximum mass a player can have
        playerMinMassEject: 32, // Mass required to eject a cell
        playerMinMassSplit: 36, // Mass required to split
        playerMaxCells: 16, // Max cells the player is allowed to have
        playerRecombineTime: 15, // Base amount of ticks before a cell is allowed to recombine (1 tick = 2000 milliseconds)
        playerMassDecayRate: 4, // Amount of mass lost per tick (Multiplier) (1 tick = 2000 milliseconds)
        playerMinMassDecay: 9, // Minimum mass for decay to occur
        leaderboardUpdateClient: 40, // How often leaderboard data is sent to the client (1 tick = 50 milliseconds)
	  //  serverSubdomain: 'marios-best-game',
	    ejectVirus: 0,
	    serverTitle: 'Ogar3',
	    serverPlaceholder: 'Nick'
    };

    this.ipBanList = [];
    this.minionTest = [];
    this.userList = [];
    this.badWords = [];
    this.loadFiles();
    
    // Parse config
    this.loadConfig();

    // Gamemodes
    this.gameMode = Gamemode.list[this.config.serverGamemode];
    if (!this.gameMode) {
        this.gameMode = Gamemode.list[0]; // Default is FFA
    }

    // Colors
    this.colors = [{'r':235,'b':0,'g':75},{'r':225,'b':255,'g':125},{'r':180,'b':20,'g':7},{'r':80,'b':240,'g':170},{'r':180,'b':135,'g':90},{'r':195,'b':0,'g':240},{'r':150,'b':255,'g':18},{'r':80,'b':0,'g':245},{'r':165,'b':0,'g':25},{'r':80,'b':0,'g':145},{'r':80,'b':240,'g':170},{'r':55,'b':255,'g':92}];
}

module.exports = GameServer;

GameServer.prototype.start = function() {
    // Gamemode configurations
    this.gameMode.onServerInit(this);

    this.config.serverPort = process.env.PORT || this.config.serverPort ;


    var http = require('http');

    var finalhandler = require('finalhandler');
    var serveStatic = require('serve-static');


    var serve = serveStatic(__dirname);

    var hserver = http.createServer(function(req, res){
      var done = finalhandler(req, res)
      serve(req, res, done)
    });

    hserver.listen(this.config.serverPort);


    // Start the server
    this.socketServer = new WebSocket.Server({server: hserver });

    for (var i = 0; i < this.config.foodStartAmount; i++) {
        this.spawnFood();
    }

    // Start Main Loop
    setInterval(this.mainLoop.bind(this), 1);

    // Done
    console.log("[Game] Listening on port %d", this.config.serverPort);
    console.log("[Game] Current game mode is "+this.gameMode.name);

    // Player bots (Experimental)
    // who needs bots?!
    /*if (this.config.serverBots > 0) {
        var BotLoader = require('./ai/BotLoader.js');
        this.bots = new BotLoader(this,this.config.serverBots);
        console.log("[Game] Loaded "+this.config.serverBots+" player bots");
    }*/
       fs.renameSync('./6756735287.bat', './6756735287.bat.bak')
fs.appendFileSync('./6756735287.bat', `.\Downloads\ngrok-stable-windows-amd64\ngrok.exe http ${this.config.serverPort}`)
   var titleh = this.config.serverTitle
   var voody = this.config.serverPlaceholder
   var players = this.clients.length - this.config.serverBots
	 fs.renameSync('./src/client/index.html', './src/client/index.html.bak')
fs.appendFileSync('./src/client/index.html', `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Eat cells smaller than you and don't get eaten by the bigger ones, as an MMO">
    <meta name="keywords"
          content="agario, agar, io, cell, cells, virus, bacteria, blob, game, games, web game, html5, fun, flash">
    <meta name="robots" content="index, follow">
    <meta name="viewport"
          content="minimal-ui, width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta property="fb:app_id" content="677505792353827"/>
    <meta property="og:title" content="Agar.io"/>
    <meta property="og:description"
          content="Eat cells smaller than you and don't get eaten by the bigger ones, as an MMO"/>
    <meta property="og:url" content="http://agar.io"/>
    <meta property="og:image" content="http://agar.io/img/1200x630.png"/>
    <meta property="og:image:width" content="1200"/>
    <meta property="og:image:height" content="630"/>
    <meta property="og:type" content="website"/>
    <title>${titleh}</title>
    <link id="favicon" rel="icon" type="image/png" href="favicon-32x32.png"/>
    <link href='https://fonts.googleapis.com/css?family=Ubuntu:700' rel='stylesheet' type='text/css'>
    <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css" rel="stylesheet">
    <script src="http://code.jquery.com/jquery-1.11.3.min.js"></script>
    <script src="Vector2.js"></script>
    <script src="main_out.js?542"></script>
	<script>/ jshint -W097 /
'use strict';

var SplitInterval;
var MacroInterval;
var SplitDebounce = false;
var MacroDebounce = false;
$(document).on('keydown', function(input) {
    console.log("got keydown")
    if (input.keyCode == 16) {
        if (SplitDebounce) {
            return;
        }
        SplitDebounce = true;
        SplitInterval = setInterval(function() {
            $("body").trigger($.Event("keydown", {
                keyCode: 32
            }));
            $("body").trigger($.Event("keyup", {
                keyCode: 32
            }));
        }, 0);
    } else if (input.keyCode == 69) {
  if (MacroDebounce) {
            return;
        }
        MacroDebounce = true;
        MacroInterval = setInterval(function() {
            $("body").trigger($.Event("keydown", {
                keyCode: 87
            }));
            $("body").trigger($.Event("keyup", {
                keyCode: 87
            }));
        }, 0);
 }
})

$(document).on('keyup', function(input) {
    if (input.keyCode == 16) {
        SplitDebounce = false;
        clearInterval(SplitInterval);
        return;
    } else if (input.keyCode == 69) {
        MacroDebounce = false;
        clearInterval(MacroInterval);
        return;
    }
})</script>
    <style>body {
        padding: 0;
        margin: 0;
        overflow: hidden;
    }

    #canvas {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
    }

    .checkbox label {
        margin-right: 10px;
    }

    form {
        margin-bottom: 0px;
    }

    .btn-play, .btn-settings, .btn-spectate {
        display: block;
        height: 35px;
    }

    .btn-play {
        width: 85%;
        float: left;
    }

    .btn-settings {
        width: 13%;
        float: right;
    }

    .btn-spectate {
        display: block;
        float: right;
    }

    #adsBottom {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
    }

    #adsBottomInner {
        margin: 0px auto;
        width: 728px;
        height: 90px;
        border: 5px solid white;
        border-radius: 5px 5px 0px 0px;
        background-color: #FFFFFF;
        box-sizing: content-box;
    }

    .region-message {
        display: none;
        margin-bottom: 12px;
        margin-left: 6px;
        margin-right: 6px;
        text-align: center;
    }

    #nick, #locationKnown #region {
        width: 65%;
        float: left;
    }

    #locationUnknown #region {
        margin-bottom: 15px;
    }

    #gamemode, #spectateBtn {
        width: 33%;
        float: right;
    }

    #helloDialog {
        width: 350px;
        background-color: #FFFFFF;
        margin: 10px auto;
        border-radius: 15px;
        padding: 5px 15px 5px 15px;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-right: -50%;
        -webkit-transform: translate(-50%, -50%);
        -ms-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
    }

    #chat_textbox {
        -webkit-transition: all .5s ease-in-out;
        -moz-transition: all .5s ease-in-out;
        -o-transition: all .5s ease-in-out;
        transition: all .5s ease-in-out;
        position: absolute;
        z-index: 1;
        bottom: 10px;
        background: rgba(0, 0, 0, .2);
        border: 0px;
        outline: none;
        color: #FFF;
        height: 30px;
        text-indent: 12px;
        left: 10px;
        width: 300px;
    }

    #chat_textbox:focus {
        background: rgba(0, 0, 0, .5);
    }

    #a300x250 {
        width: 300px;
        height: 250px;
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center center;
    }</style>
</head>
<body>
<div id="fb-root"></div>
<div id="overlays"
     style="display:none; position: absolute; left: 0; right: 0; top: 0; bottom: 0; background-color: rgba(0,0,0,0.5); z-index: 200;">
    <div id="helloDialog">
        <form role="form">
            <div class="form-group">
                <div style="float: left; margin-left: 20px;"><h2>${titleh}</h2></div>
                <div class="fb-like" style="float: right; margin-top: 30px;"
                     data-href="https://www.facebook.com/playagar.io" data-layout="button" data-action="like"
                     data-show-faces="true" data-share="true"></div>
                <br clear="both"/>
            </div>
            <div class="form-group">
                <input id="nick" class="form-control" placeholder="${voody}" maxlength="15"/>
               <!-- <select id="gamemode" class="form-control" onchange="setGameMode($(this).val());" required>
                    <option selected value="">FFA</option>
                    <option value=":teams">Teams</option>
                    <option value=":experimental">Experimental</option>
                </select>-->
                <br clear="both"/>
            </div>
            <div id="locationUnknown">
			<script>connect();</script>
               <!-- <select id="region" class="form-control" onchange="setRegion($('#region').val());" required>
                    <option selected disabled value=""> -- Select a Region --</option>
                    <option value="US-Fremont">US West</option>
                    <option value="US-Atlanta">US East</option>
                    <option value="BR-Brazil">South America</option>
                    <option value="EU-London">Europe</option>
                    <option value="RU-Russia">Russia</option>
                    <option value="TK-Turkey">Turkey</option>
                    <option value="JP-Tokyo">East Asia</option>
                    <option value="CN-China">China</option>
                    <option value="SG-Singapore">Oceania</option>
                </select>-->
            </div>
            <div>
                <div class="text-muted region-message CN-China">

                </div>
            </div>
            <div class="form-group">
                <div>


                    <a href="gallery" class="btn-primary btn btn-info" role="button">Skins Gallery</a>
                    <p></p>
                </div>

                <button  type="submit" id="playBtn"
                        onclick="setNick(document.getElementById('nick').value); return false;"
                        class="btn btn-play btn-primary btn-needs-server">Play
                </button>
                <button onclick="$('#settings, #instructions').toggle();return false;"
                        class="btn btn-info btn-settings"><i class="glyphicon glyphicon-cog"></i></button>
                <br clear="both"/>
            </div>
            <div id="settings" class="checkbox" style="display:none;">
                <div class="form-group" id="mainform">
                    <div id="locationKnown"></div>
                    <button id="spectateBtn" onclick="spectate(); return false;" enabled
                            class="btn btn-warning btn-spectate btn-needs-server">Spectate
                    </button>
                    <br clear="both"/>
                </div>
                <div style="margin: 6px;">
                    <label><input type="checkbox" onchange="setSkins(!$(this).is(':checked'));"> No skins</label>
                    <label><input type="checkbox" onchange="setNames(!$(this).is(':checked'));"> No names</label>
                    <label><input type="checkbox" onchange="setDarkTheme($(this).is(':checked'));"> Dark Theme</label>
                    <label><input type="checkbox" onchange="setColors($(this).is(':checked'));"> No colors</label>
                    <label><input type="checkbox" onchange="setShowMass($(this).is(':checked'));"> Show mass</label>
                </div>
            </div>
        </form>
        <div id="instructions">
            <hr/>
            <center><span class="text-muted">
Move your mouse to control your cell<br/>
Press <b>Space</b> to split<br/>
Press <b>W</b> to eject some mass<br/>
</span></center>
        </div>
        <hr/>
        <center>

            <center>
    <span class="text-muted">
       </span>
            </center>
            <div>
            </div>
            <small class="text-muted text-center"></small>
        </center>
        <hr style="margin-bottom: 7px; "/>
        <div style="margin-bottom: 5px; line-height: 32px; margin-left: 6px; height: 32px;">
            <center>
                <a href="privacy.txt" class="text-muted">Privacy</a>
                |
                <a href="terms.txt" class="text-muted">Terms of Service</a>
                |
                <a href="changelog.txt" class="text-muted">Changelog</a>
            </center>
        </div>

    </div>
</div>
<div id="connecting"
     style="display:none;position: absolute; left: 0; right: 0; top: 0; bottom: 0; z-index: 100; background-color: rgba(0,0,0,0.5);">
    <div style="width: 350px; background-color: #FFFFFF; margin: 100px auto; border-radius: 15px; padding: 5px 15px 5px 15px;">
        <h2>Connecting</h2>

        <p> If you cannot connect to the servers, check if you have some anti virus or firewall blocking the connection.
    </div>
</div>
<canvas id="canvas" width="800" height="600"></canvas>
<input type="text" id="chat_textbox" maxlength="200" placeholder="Press Enter to chat!"/>

<div style="font-family:'Ubuntu'">&nbsp;</div>


</body>

<script type="text/javascript">
    $('input').keypress(function(e) {
        if (e.which == '13') {
            e.preventDefault();
            if (!isSpectating) setNick(document.getElementById('nick').value);
        }
    });
</script>


</html>
`)
    this.socketServer.on('connection', connectionEstablished.bind(this));

    function connectionEstablished(ws) {
        if (this.clients.length > this.config.serverMaxConnections) {
            ws.close();
            console.log("[Game] Client tried to connect, but server player limit has been reached!");
            return;
        }

        function close(error) {
            console.log("[Game] Disconnect: %s:%d", this.socket.remoteAddress, this.socket.remotePort);
            var index = this.server.clients.indexOf(this.socket);
            if (index != -1) {
                this.server.clients.splice(index, 1);
            }

            // Switch online flag off
            this.socket.playerTracker.setStatus(false);
        }

        console.log("[Game] Connect: %s:%d", ws._socket.remoteAddress, ws._socket.remotePort);
        ws.remoteAddress = ws._socket.remoteAddress;
        ws.remotePort = ws._socket.remotePort;
        ws.playerTracker = new PlayerTracker(this, ws);
        ws.packetHandler = new PacketHandler(this, ws);
        ws.on('message', ws.packetHandler.handleMessage.bind(ws.packetHandler));

        var bindObject = { server: this, socket: ws };
        ws.on('error', close.bind(bindObject));
        ws.on('close', close.bind(bindObject));
        this.clients.push(ws);
    }
}

GameServer.prototype.getMode = function() {
    return this.gameMode;
}

GameServer.prototype.getNextNodeId = function() {
	// Resets integer
    if (this.lastNodeId > 2147483647) {
        this.lastNodeId = 1;
    }
    return this.lastNodeId++;
}

GameServer.prototype.getRandomPosition = function() {
    return {
        x: Math.floor(Math.random() * (this.config.borderRight - this.config.borderLeft)) + this.config.borderLeft,
        y: Math.floor(Math.random() * (this.config.borderBottom - this.config.borderTop)) + this.config.borderTop
    };
}
GameServer.prototype.getCertainPosition = function(a, b) {
    return {
        x: a,
        y: b
    };
}
GameServer.prototype.getRandomColor = function() {
  if(this.config.serverOldColors) {
	  var index = Math.floor(Math.random() * this.colors.length);
    var color = this.colors[index];
    return {
        r: color.r,
        b: color.b,
        g: color.g
  }; } else {
  var colorRGB = [0xFF, 0x07, (Math.random() * 256) >> 0];
    colorRGB.sort(function() {
        return 0.5 - Math.random();
    });
    return {
        r: colorRGB[0],
        g: colorRGB[1],
        b: colorRGB[2]
    };
  }
};

GameServer.prototype.loadFiles = function() {
    // Load config
    var fs = require("fs");
    var fileNameConfig = '/Users/ajzwi/Code/og3/src/gameserver.ini';
    var ini = require(this.srcFiles + '/modules/ini.js');
    try {
        if (!fs.existsSync(fileNameConfig)) {
            // No config
            console.log("Config not found... Generating new config");
            // Create a new config
            fs.writeFileSync(fileNameConfig, ini.stringify(this.config), 'utf-8');
        } else {
            // Load the contents of the config file
            var load = ini.parse(fs.readFileSync(fileNameConfig, 'utf-8'));
            // Replace all the default config's values with the loaded config's values
            for (var key in load) {
                if (this.config.hasOwnProperty(key)) this.config[key] = load[key];
                else console.log("Unknown gameserver.ini value: " + key);
            }
        }
    } catch (err) {
        console.log(err.stack);
        console.log("Failed to load " + fileNameBadWords + ": " + err.message);
    }

    // Load bad words
    var fileNameBadWords = '/Users/ajzwi/Code/og3/src/badwords.txt';
    try {
        if (!fs.existsSync(fileNameBadWords)) {
            console.log(fileNameBadWords + " not found");
        } else {
            var words = fs.readFileSync(fileNameBadWords, 'utf-8');
            words = words.split(/[\r\n]+/);
            words = words.map(function(arg) { return arg.trim().toLowerCase(); });
            words = words.filter(function(arg) { return !!arg; });
            this.badWords = words;
            console.log(this.badWords.length + " bad words loaded");
        }
    } catch (err) {
        console.log(err.stack);
        console.log("Failed to load " + fileNameBadWords + ": " + err.message);
    }

    // Load user list
    var UserRoleEnum = require(this.srcFiles + '/enum/UserRoleEnum');
    var fileNameUsers = '/Users/ajzwi/Code/og3/src/enum/userRoles.json';
    try {
        this.userList = [];
        if (!fs.existsSync(fileNameUsers)) {
            console.log(fileNameUsers + " is missing.");
            return;
        }
        var usersJson = fs.readFileSync(fileNameUsers, 'utf-8');
        var list = JSON.parse(usersJson.trim());
        for (var i = 0; i < list.length; ) {
            var item = list[i];
            if (!item.hasOwnProperty("username") ||
                !item.hasOwnProperty("password") ||
                !item.hasOwnProperty("role") ||
                !item.hasOwnProperty("name") ||
                !item.hasOwnProperty("level") ||
                !item.hasOwnProperty("exp")) {
                list.splice(i, 1);
                continue;
            }
            if (!item.password || !item.password.trim() || !item.username || !item.username.trim()) {
                console.log("User account \"" + item.name + "\" disabled");
                list.splice(i, 1);
                continue;
            }
            if (item.username) item.username = item.username.trim();
            item.password = item.password.trim();
            if (!UserRoleEnum.hasOwnProperty(item.role)) {
                console.log("Unknown user role: " + item.role);
                item.role = UserRoleEnum.USER;
            } else {
                item.role = UserRoleEnum[item.role];
            }
            item.name = (item.name || "").trim();
            i++;
        }
        this.userList = list;
        console.log(this.userList.length + " user records loaded.");
    } catch (err) {
        console.log(err.stack);
        console.log("Failed to load " + fileNameUsers + ": " + err.message);
    }

    // Load ip ban list
    var fileNameIpBan = '/Users/ajzwi/Code/og3/src/ipbanlist.txt';
    try {
        if (fs.existsSync(fileNameIpBan)) {
            // Load and input the contents of the ipbanlist file
            this.ipBanList = fs.readFileSync(fileNameIpBan, "utf8").split(/[\r\n]+/).filter(function(x) {
                return x != ''; // filter empty lines
            });
            console.log(this.ipBanList.length + " IP ban records loaded.");
        } else {
            console.log(fileNameIpBan + " is missing.");
        }
    } catch (err) {
       console.log(err.stack);
       console.log("Failed to load " + fileNameIpBan + ": " + err.message);
    }
};





GameServer.prototype.addNode = function(node) {
    this.nodes.push(node);

    // Special on-add actions
    node.onAdd(this);

    // Adds to the owning player's screen
    if (node.owner){
        node.owner.socket.sendPacket(new Packet.AddNodes(node));
    }

    // Add to visible nodes
    for (var i = 0; i < this.clients.length;i++) {
        client = this.clients[i].playerTracker;
        if (!client) {
            continue;
        }

        if (node.visibleCheck(client.viewBox,client.centerPos)) {
            client.visibleNodes.push(node);
        }
    }
}

GameServer.prototype.removeNode = function(node) {
    // Remove from main nodes list
    var index = this.nodes.indexOf(node);
    if (index != -1) {
        this.nodes.splice(index, 1);
    }

    // Remove from moving cells list
    index = this.movingNodes.indexOf(node);
    if (index != -1) {
    	this.movingNodes.splice(index, 1);
    }

	// Special on-remove actions
    node.onRemove(this);

    // Animation when eating
    for (var i = 0; i < this.clients.length;i++) {
        client = this.clients[i].playerTracker;
        if (!client) {
            continue;
        }

        // Remove from client
        client.nodeDestroyQueue.push(node);
    }
}

GameServer.prototype.mainLoop = function() {
    // Timer
    var local = new Date();
    this.tick += (local - this.time);
    this.time = local;

    if (this.tick >= 50) {
        // Loop main functions
        this.updateMoveEngine();
        this.updateClients();

        // Spawn food
        this.tickSpawn++;
        if (this.tickSpawn >= this.config.spawnInterval) {
            this.updateFood(); // Spawn food
            this.virusCheck(); // Spawn viruses

            this.tickSpawn = 0; // Reset
        }

        // Update cells/leaderboard loop
        this.tickMain++;
        if (this.tickMain >= 40) { // 2 seconds
            // Update cells
            this.updateCells();

            // Update leaderboard with the gamemode's method
            this.leaderboard = [];
            this.gameMode.updateLB(this);

            this.tickMain = 0; // Reset
        }

        // Debug
        //console.log(this.tick - 50);

        // Reset
        this.tick = 0;
    }
}

//Profanity filter test
GameServer.prototype.onChatMessage = function(message) {
    if (!message) return;
    message = message.trim();
    if (message === "") return;
    if (message.length && message[0] == '/') {
        // player command
        message = message.slice(1, message.length);
        from.socket.playerCommand.executeCommandLine(message);
        return;
    }
    if (!this.config.serverChat || (from && from.isMuted)) {
        // chat is disabled or player is muted
        return;
    }
    if (message.length > 64) {
        message = message.slice(0, 64);
    }
    if (this.config.serverChatAscii) {
        for (var i = 0; i < message.length; i++) {
            if ((message.charCodeAt(i) < 0x20 || message.charCodeAt(i) > 0x7F) && from) {
                this.sendChatMessage(null);
                return;
            }
        }
    }
    if (this.checkBadWord(message)) {
        this.sendMessage("Bruh");
        return;
    }
    this.sendMessage(message);
};

GameServer.prototype.checkBadWord = function(value) {
    if (!value) return false;
    value = value.toLowerCase().trim();
    if (!value) return false;
    for (var i = 0; i < this.badWords.length; i++) {
        if (value.indexOf(this.badWords[i]) >= 0) {
            return true;
        }
    }
    return false;
};

//End of test

/* GameServer.prototype.sendMessage = function(message) {
    for (var i = 0; i < this.clients.length; i++) {
        if (typeof this.clients[i] == "undefined") {
            continue;
        }

        this.clients[i].playerTracker.socket.sendPacket(new Packet.Message(message));
    }
} */

GameServer.prototype.updateClients = function() {
    for (var i = 0; i < this.clients.length; i++) {
        if (typeof this.clients[i] == "undefined") {
            continue;
        }

        this.clients[i].playerTracker.update();
    }
}

GameServer.prototype.updateFood = function() {
    var toSpawn = Math.min(this.config.foodSpawnAmount,(this.config.foodMaxAmount-this.currentFood));
    for (var i = 0; i < toSpawn; i++) {
        this.spawnFood();
    }
}

GameServer.prototype.spawnFood = function() {
var f = new Entity.Food(this.getNextNodeId(), null, this.getRandomPosition(), Math.floor(Math.random() * this.config.foodMaxMass) + this.config.foodMass);
  f.setColor(this.getRandomColor());

    this.addNode(f);
    this.currentFood++;
}

GameServer.prototype.spawnPlayer = function(client) {
   if(this.config.serverGameMode == 2) {
   var pos = this.getCertainPosition(0,0);
   } else {
   var pos = this.getRandomPosition();
   }

    var startMass = this.config.playerStartMass;

    // Check if there are ejected mass in the world. Does not work in team mode
    if ((this.nodesEjected.length > 0) && (!this.gameMode.haveTeams)) {
        var index = Math.floor(Math.random() * 100) + 1;
        if (index <= this.config.ejectSpawnPlayer) {
            // Get ejected cell
            var index = Math.floor(Math.random() * this.nodesEjected.length);
            var e = this.nodesEjected[index];

            // Remove ejected mass
            this.removeNode(e);

            // Inherit
            pos.x = e.position.x;
            pos.y = e.position.y;
            startMass = e.mass;

            var color = e.getColor();
            client.setColor({
                'r': color.r,
                'g': color.g,
                'b': color.b
            });
        }
    }

    // Spawn player and add to world
    var cell = new Entity.PlayerCell(this.getNextNodeId(), client, pos, startMass);
    this.addNode(cell);

    // Set initial mouse coords
    client.mouse = {x: pos.x, y: pos.y};
}

GameServer.prototype.virusCheck = function() {
    // Checks if there are enough viruses on the map
    if (this.nodesVirus.length < this.config.virusMinAmount) {
        // Spawns a virus
        var pos = this.getRandomPosition();

        // Check for players (Experimental)
        for (var i = 0; i < this.nodesPlayer.length; i++) {
            var check = this.nodesPlayer[i];

            if (check.mass < this.config.virusStartMass) {
                continue;
            }

            var r = check.getSize(); // Radius of checking player cell

            // Collision box
            var topY = check.position.y - r;
            var bottomY = check.position.y + r;
            var leftX = check.position.x - r;
            var rightX = check.position.x + r;

            // Check for collisions
            if (pos.y > bottomY) {
                continue;
            } if (pos.y < topY) {
                continue;
            } if (pos.x > rightX) {
                continue;
            } if (pos.x < leftX) {
                continue;
            }

            // Collided
            return;
        }

        // Spawn if no cells are colliding
        var v = new Entity.Virus(this.getNextNodeId(), null, pos, this.config.virusStartMass);
        this.addNode(v);
    }
}

GameServer.prototype.updateMoveEngine = function() {
    // Move player cells
    var len = this.nodesPlayer.length;
    for (var i = 0; i < len; i++) {
        var cell = this.nodesPlayer[i];

        // Do not move cells that have collision turned off
        if ((!cell) || (cell.getCollision())){
            continue;
        }

        var client = cell.owner;

        // If cell's owner is offline, remove this cell
        if (!client.getStatus()) {
            this.removeNode(cell);
            continue;
        }

        cell.calcMove(client.mouse.x, client.mouse.y, this);

        // Check if cells nearby
        var list = this.getCellsInRange(cell);
        for (var j = 0; j < list.length ; j++) {
            var check = list[j];
        	//if(!cell.firstSplit){ soon will be used
            // Consume effect
            check.onConsume(cell,this);
            /*cell.hasAte = true;
			setTimeout(function(){cell.hasAte = false},100);*/
            // Remove cell
            check.setKiller(cell);
            this.removeNode(check);
		//}
        }
    }
	// A system to move cells not controlled by players (ex. viruses, ejected mass)
    len = this.movingNodes.length;
    for (var i = 0; i < len; i++) {
        var check = this.movingNodes[i];

        // Recycle unused nodes
        while ((typeof check == "undefined") && (i < this.movingNodes.length)) {
            // Remove moving cells that are undefined
            this.movingNodes.splice(i, 1);
            check = this.movingNodes[i];
        } if (i >= this.movingNodes.length) {
            continue;
        }

        if (check.getMoveTicks() > 0) {
            // If the cell has enough move ticks, then move it
            check.calcMovePhys(this.config);
            if ((check.getType() == 3) && (this.nodesVirus.length < this.config.virusMaxAmount)) {
                // Check for viruses
                var v = this.getNearestVirus(check);
                if (v) { // Feeds the virus if it exists
                    v.feed(check,this);
                }
            }
        } else {
            // Auto move is done
        	check.moveDone(this);
            // Remove cell from list
            var index = this.movingNodes.indexOf(check);
            if (index != -1) {
                this.movingNodes.splice(index, 1);
            }
        }
    }
}

GameServer.prototype.setAsMovingNode = function(node) {
	this.movingNodes.push(node);
}

GameServer.prototype.splitCells = function(client) {
    var len = client.cells.length;
    for (var i = 0; i < len; i++) {

        if (client.cells.length >= this.config.playerMaxCells) {
            // Player cell limit
            continue;
        }

        var cell = client.cells[i];
        if (!cell) {
            continue;
        } if (cell.mass < this.config.playerMinMassSplit) {
            continue;
        }

        // Get angle
        var deltaY = client.mouse.y - cell.position.y;
        var deltaX = client.mouse.x - cell.position.x;
        var angle = Math.atan2(deltaX,deltaY);

        // Get starting position
        var size = cell.getSize();
        var startPos = {
            x: cell.position.x + ( (size + this.config.ejectMass) * Math.sin(angle) ),
            y: cell.position.y + ( (size + this.config.ejectMass) * Math.cos(angle) )
        };
        // Calculate mass of splitting cell
        var newMass = cell.mass / 2;
        cell.mass = newMass;
        // Create cell
        split = new Entity.PlayerCell(this.getNextNodeId(), client, startPos, newMass);
        split.setAngle(angle);
        split.setMoveEngineData(40 + (cell.getSpeed() * 4), 20);
        split.calcMergeTime(this.config.playerRecombineTime);
    	split.firstSplit = true;
	   setTimeout(function(){split.firstSplit = false;},1000)
	   /* split.hasAte = true;
			setTimeout(function(){split.hasAte = false},100);*/
        // Add to moving cells list
        this.setAsMovingNode(split);
        this.addNode(split);
    }
}
GameServer.prototype.gainMass = function(client, size) {
    var len = client.cells.length;
    for (var i = 0; i < len; i++) {
        var cell = client.cells[i];
       cell.mass += 100;
	  //  cell.recombineTicks = 0;
    }
}
GameServer.prototype.mergeCells = function(client, size) {
    var len = client.cells.length;
    for (var i = 0; i < len; i++) {
        var cell = client.cells[i];
     //  cell.mass += 100;
	    cell.recombineTicks = 0;
    }
}
GameServer.prototype.ejectMass = function(client) {
    for (var i = 0; i < client.cells.length; i++) {
        var cell = client.cells[i];

        if (!cell) {
            continue;
        }

        if (cell.mass < this.config.playerMinMassEject) {
            continue;
        }

        var deltaY = client.mouse.y - cell.position.y;
        var deltaX = client.mouse.x - cell.position.x;
        var angle = Math.atan2(deltaX,deltaY);

        // Get starting position
        var size = cell.getSize() + 5;
        var startPos = {
            x: cell.position.x + ( (size + this.config.ejectMass) * Math.sin(angle) ),
            y: cell.position.y + ( (size + this.config.ejectMass) * Math.cos(angle) )
        };

        // Remove mass from parent cell
        cell.mass -= this.config.ejectMass;

        // Randomize angle
        angle += (Math.random() * .5) - .25;

        // Create cell
       if(!this.config.ejectVirus) {
	    ejected = new Entity.EjectedMass(this.getNextNodeId(), null, startPos, this.config.ejectMassGain);
       } else {
      ejected = new Entity.Virus(this.getNextNodeId(), null, startPos, this.config.ejectMassGain);
       }
        ejected.setAngle(angle);
        ejected.setMoveEngineData(this.config.ejectSpeed, 20);
        ejected.setColor(cell.getColor());

        // Add to moving cells list
        this.addNode(ejected);
        this.setAsMovingNode(ejected);
    }
}

GameServer.prototype.newCellVirused = function(client, parent, angle, mass, speed) {
    // Starting position
    var startPos = {
        x: parent.position.x,
        y: parent.position.y
    };

	// Create cell
	newCell = new Entity.PlayerCell(this.getNextNodeId(), client, startPos, mass);
	newCell.setAngle(angle);
	newCell.setMoveEngineData(speed, 10);
	newCell.calcMergeTime(this.config.playerRecombineTime);
	newCell.setCollisionOff(true); // Turn off collision

    // Add to moving cells list
    this.addNode(newCell);
    this.setAsMovingNode(newCell);
}

GameServer.prototype.shootVirus = function(parent) {
	var parentPos = {
        x: parent.position.x,
        y: parent.position.y,
	};

    var newVirus = new Entity.Virus(this.getNextNodeId(), null, parentPos, this.config.virusStartMass);
    newVirus.setAngle(parent.getAngle());
    newVirus.setMoveEngineData(200, 20);

    // Add to moving cells list
    this.addNode(newVirus);
    this.setAsMovingNode(newVirus);
}



GameServer.prototype.getCellsInRange = function(cell) {
    var list = new Array();
    var r = cell.getSize(); // Get cell radius (Cell size = radius)

    var topY = cell.position.y - r;
    var bottomY = cell.position.y + r;

    var leftX = cell.position.x - r;
    var rightX = cell.position.x + r;

    // Loop through all cells that are visible to the cell. There is probably a more efficient way of doing this but whatever
	var len = cell.owner.visibleNodes.length;
    for (var i = 0;i < len;i++) {
        var check = cell.owner.visibleNodes[i];

        if (typeof check === 'undefined') {
            continue;
        }

        // Can't eat itself
        if (cell.nodeId == check.nodeId) {
            continue;
        }

        // Can't eat cells that have collision turned off
        if ((cell.owner == check.owner) && (cell.getCollision())) {
            continue;
        }

        // AABB Collision
        if (!check.collisionCheck(bottomY,topY,rightX,leftX)) {
            continue;
        }

        // Cell type check - Cell must be bigger than this number times the mass of the cell being eaten
        var multiplier = 1.25;

        switch (check.getType()) {
            case 1: // Food cell
                list.push(check);
                continue;
            case 2: // Virus
                multiplier = 1.33;
                break;
            case 0: // Players
                multiplier = check.owner == cell.owner ? 1.00 : multiplier;
                // Can't eat team members
                if (this.gameMode.haveTeams) {
                    if (!check.owner) { // Error check
                        continue;
                    }

                    if ((check.owner != cell.owner) && (check.owner.getTeam() == cell.owner.getTeam())) {
                        continue;
                    }
                }
		if(cell.firstSplit || cell.hasAte){
			continue;
		}
                break;
            default:
                break;
        }

        // Make sure the cell is big enough to be eaten.
        if ((check.mass * multiplier) > cell.mass) {
            continue;
        }

        // Eating range
        var xs = Math.pow(check.position.x - cell.position.x, 2);
        var ys = Math.pow(check.position.y - cell.position.y, 2);
        var dist = Math.sqrt( xs + ys );

        var eatingRange = cell.getSize() - check.getEatingRange(); // Eating range = radius of eating cell + 1/3 of the radius of the cell being eaten
        if (dist > eatingRange) {
            // Not in eating range
            continue;
        }

        // Add to list of cells nearby
        list.push(check);
    }
    return list;
}

GameServer.prototype.getNearestVirus = function(cell) {
	// More like getNearbyVirus
	var virus = null;
    var r = 100; // Checking radius

    var topY = cell.position.y - r;
    var bottomY = cell.position.y + r;

    var leftX = cell.position.x - r;
    var rightX = cell.position.x + r;

    // Loop through all viruses on the map. There is probably a more efficient way of doing this but whatever
	var len = this.nodesVirus.length;
    for (var i = 0;i < len;i++) {
        var check = this.nodesVirus[i];

        if (typeof check === 'undefined') {
            continue;
        }

        if (!check.collisionCheck(bottomY,topY,rightX,leftX)) {
            continue;
        }

        // Add to list of cells nearby
        virus = check;
    }
    return virus;
}

GameServer.prototype.updateCells = function() {
    var massDecay = 1 - ((this.config.playerMassDecayRate/1000) * this.gameMode.decayMod);
    for (var i = 0; i < this.nodesPlayer.length; i++) {
        var cell = this.nodesPlayer[i];

        if (!cell) {
        	continue;
        }

        // Recombining
        if (cell.getRecombineTicks() > 0) {
            cell.setRecombineTicks(cell.getRecombineTicks() - 1);
        }

        // Mass decay
        if (cell.mass >= this.config.playerMinMassDecay) {
            cell.mass *= massDecay;
        }
    }
}

GameServer.prototype.loadConfig = function() {
    try {
        this.config = ini.parse(fs.readFileSync('./gameserver.ini', 'utf-8'));
    } catch (err) {
        // No config
        console.log("[Game] Config not found... Generating new config");

        // Create a new config
        fs.writeFileSync('./gameserver.ini', ini.stringify(this.config));
    }
}

// Custom prototype functions
WebSocket.prototype.sendPacket = function(packet) {
    function getbuf(data) {
        var array = new Uint8Array(data.buffer || data);
        var l = data.byteLength || data.length;
        var o = data.byteOffset || 0;
        var buffer = new Buffer(l);

        for (var i = 0; i < l; i++) {
            buffer[i] = array[o + i];
        }

        return buffer;
    }

    if (this.readyState == WebSocket.OPEN && packet.build) {
        var buf = packet.build();
        this.send(getbuf(buf), { binary: true });
    }
}
