import { Client } from "colyseus";
import { RestartRoom } from "../rooms/RestartRoom";
import { Player } from "../rooms/schema/RestartRoomState";
import {
  PlayerReadyMessageData,
  SetGameAdminMessageData,
  StartGameMessageData,
} from "../interfaces/messages";
import { playerChanceLoop } from "./playerChanceLoop";

export const changePlayerReadyStatus = async (
  room: RestartRoom,
  client: Client,
  message: PlayerReadyMessageData,
) => {
  const player = room.state.players.get(client.sessionId);
  if (player) {
    player.isReady = message.playerReady;
    console.log(
      `Player ${client.sessionId} ready status: ${message.playerReady}`,
    );
  } else {
    console.error(
      `Player ${client.sessionId} not found in room ${room.roomId} but sent a playerReady message`,
    );
  }
};

export const setGameAdmin = async (
  room: RestartRoom,
  client: Client,
  message: SetGameAdminMessageData,
) => {
  // verify that this request is coming from legit source
  room.state.gameAdmin = message.playerID;
};

export const startGame = async (
  room: RestartRoom,
  client: Client,
  message: StartGameMessageData,
) => {
  // verify that this request is coming from legit source
  room.state.isGameStarted = message.startGame;
  let iterator = room.state.players.keys();
  playerChanceLoop(room, iterator);
};
