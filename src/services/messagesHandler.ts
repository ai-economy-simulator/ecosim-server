import { Client } from "colyseus";
import { RestartRoom } from "../rooms/RestartRoom";
import { Player } from "../rooms/schema/RestartRoomState";
import { PlayerReadyMessageData } from "../interfaces/messages";

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
