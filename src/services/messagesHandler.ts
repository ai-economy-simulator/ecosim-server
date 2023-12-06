import { Client } from "colyseus";
import { RestartRoom } from "../rooms/RestartRoom";
import { Player } from "../rooms/schema/RestartRoomState";
import { playerReadyMessageData } from "../interfaces/messages";

export const changePlayerReadyStatus = async (
  room: RestartRoom,
  client: Client,
  message: playerReadyMessageData,
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
