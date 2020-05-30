var Logger = require('./modules/Logger');
var Commands = require('./modules/CommandList');

var runMaster = false;
var runGame = true;

var showConsole = true;

Logger.start();

process.on('exit', function (code) {
    Logger.debug("process.exit(" + code + ")");
    Logger.shutdown();
});

process.on('uncaughtException', function (err) {
    Logger.fatal(err.stack);
    process.exit(3);
});

process.argv.forEach(function(val) {
    if (val == "--master") {
        runMaster = true;
    } else if (val == "--game") {
        runGame = true;
    } else if (val == "--help") {
        console.log("Proper Usage: %s [--master] [--game]", process.argv[0]);
        console.log("    --master            Run the Agar master server.");
        console.log("    --game              Run the Agar game server.");
        console.log("    --help              Help menu.");
        console.log("");
        console.log("You can use both options simultaneously to run both the master and game server.");
        console.log("");
    } 
});

if (runMaster) {
    // Initialize the master server
    var MasterServer = require('./MasterServer');
    var master = new MasterServer(8080);
    master.start();
}

if (runGame) {
    // Initialize the game server
    var GameServer = require('./GameServer');
    var game = new GameServer();
    game.start();

    //Console stuff
    if (showConsole) {
        var readline = require('readline');
        var in_ = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        setTimeout(prompt, 100);
    }

    function prompt() {
        in_.question(">", function (str) {
            try {
                parseCommands(str);
            } catch (err) {
                Logger.error(err.stack);
            } finally {
                setTimeout(prompt, 0);
            }
        });
    }
    
    function parseCommands(str) {
        // Log the string
        Logger.write(">" + str);
        
        // Don't process ENTER
        if (str === '')
            return;
        
        // Splits the string
        var split = str.split(" ");
        
        // Process the first string value
        var first = split[0].toLowerCase();
        
        // Get command function
        var execute = Commands.list[first];
        if (typeof execute != 'undefined') {
            execute(game, split);
        } else {
            Logger.warn("Invalid Command!");
        }
    }
}
