const envConfig = require("dotenv").config();
const express = require("express");
const Ably = require("ably");
const p2 = require("p2");
const app =  express();
const ABLY_API_KEY = process.env.ABLY_API_KEY;

const CANVAS_HEIGHT = 750;
const CANVAS_WIDTH = 1400;
const SHIP_PLATFORM = 718;
const PLAYER_VERTICAL_INCREMENT = 5;
const PLAYER_VERTICAL_MOVEMENT_UPDATE_INTERVAL = 1000;
const PLAYER_SCORE_INCREMENT = 5;
const P2_WORLD_TIME_STEP = 1/16;
const MIN_PLAYERS_TO_START_GAME = 3;
const GAME_TICKER_MS = 100;

let peopleAccessingWebsite = 0;
let players = {};
let playerChannels = {};
let shipX = Math.floor((Math.random() * 1370 + 30) * 1000) /1000;
let shipY = SHIP_PLATFORM;
let avatarColors = ["green", "cyan", "yellow"];
let avatarTypes = ["A", "B", "C"];
let gameOn = false;
let alivePlayers = 0;
let totalPlayers = 0;
let gameRoom;
let deadPlayerChannel;
let gameTickerOn = false;
let bullerTimer = 0;
let shipBody;
let world;
let shipVelocityTimer = 0;
let killerBulletId = "";
let copyOfShipBody = {
    position : "",
    velocity : ""
};


const realtime = Ably.realtime({
    key: ABLY_API_KEY,
    echoMessages: false //so server doesn't receive its own messages
});

const uniqueID = function() {
    return "id-" + totalPlayers + Math.random().toString(36).substr(2,16);
};

app.use(express.static("js"));

app.get("/auth", (req, res) => {
    const tokenParams = {clientId : uniqueID()};
    realtime.auth.createTokenRequest(tokenParams, function(err, tokenRequest) {
        if(err){
            res.status(500).send("Error requesting token: " + JSON.stringify(err));
        }
        else {
            res.setHeader("Content-Type", "application/json");
            res.send(JSON.stringify(tokenRequest));
        }
    });
});

app.get("/", (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");

    //If we have enough players to start the game, go to game room full view, else go to intro view
    if(++peopleAccessingWebsite > MIN_PLAYERS_TO_START_GAME){
        res.sendFile(__dirname + "/views/gameRoomFull.html");
    }
    else{
        res.sendFile(_dirname + "/views/intro.html");
    }
});

app.get("/gameplay", () => {
    res.sendFile(_dirname + "/views/index.html");
});


app.get("/winner", () => {
    res.sendFile(_dirname + "/views/winner.html");
});

app.get("/gameover", () => {
    res.sendFile(_dirname + "/views/gameover.html");
});


realtime.connection.once("connected", () => {
    //For updates on game context and player entering/leaving
    gameRoom = realtime.channels.get("game-room"); 
    //For updates on a player's death
    deadPlayerChannel = realtimer.channels.get("dead-player");

    gameRoom.presence.subscribe("enter", (player) => {
        let newPlayerId;
        let newPlayerData;
        alivePlayers++;
        totalPlayers++;

        if(totalPlayers === 1){
            gameTickerOn = true;
            startGameDataTicker();
        }

        newPlayerId = player.clientId;
        playerChannels[newPlayerId] = realtime.channels.get("clientChannel-" + player.clientId); //new channel for player to publish input

        newPlayerObject = {
            id: newPlayerId,
            x: Math.floor((Math.random() * 1370 + 30) * 1000) / 1000,
            y: 20,
            invaderAvatarType: avatarTypes[randomAvaterSelector()],
            invaderAvatarColor: avatarColors[randomAvaterSelector()],
            score: 0,
            nickname: player.data,
            isAlive: true
        };

        players[newPlayerId] = newPlayerObject;
        if(totalPlayers === MIN_PLAYERS_TO_START_GAME) {
            startShipAndBullets();
        }

        subscribeToPlayerInput(playerChannels[newPlayerId], newPlayerId); //subscribe to newly created channel of new player
    });

    //Invoked when player is disconnected from internet or closes game window
    gameRoom.presence.subscribe("leave", (player) => {
        let leavingPlayer = player.clientId;
        alivePlayers--;
        totalPlayers--;
        delete players[leavingPlayer];
        if(totalPlayers <= 0) {
            resetServerState();
        }
    });

    deadPlayerChannel.subscribe("dead-notification", (msg) => {
        players[msg.data.deadPlayerId].isAlive = false;
        killerBulletId = msg.data.killerBulletId;
        alivePlayers--;
        if(alivePlayers == 0) {
            setTimeout(() => {
                finishGame("");
            }, 1000);
        }
    });
});


const startGameDataTicker = function() {
    
};

const subscribeToPlayerInput = function() {

};


const startDownwardMovement = function() {

};


const finishGame = function() {

};


const resetServerState = function() {

};

const startShipAndBullets = function() {

};


const startMovingPhysicsWorld = function() {

};


const calculateRandomVelocity = function() {

};


const randomAvaterSelector = function() {

};


const listener = app.listen(process.env.PORT, () => {
    console.log("App listening on port " + listener.address().port);
})