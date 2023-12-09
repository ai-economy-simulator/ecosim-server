import { Client } from "colyseus";
import { RestartRoom } from "../rooms/RestartRoom";
import {
  changePlayerReadyStatus,
  setGameAdmin,
  startGame,
} from "./messagesHandler";
import { MessageTypes } from "../interfaces/messages";

export const messageBroker = async (
  room: RestartRoom,
  client: Client,
  type: string,
  message: any,
) => {
  // check if room or client still exists when this code is run

  // how to assert types for incoming messages?
  switch (type) {
    case MessageTypes.setGameAdmin:
      setGameAdmin(room, client, message);
      break;
    case MessageTypes.playerReady:
      changePlayerReadyStatus(room, client, message);
      break;
    case MessageTypes.startGame:
      startGame(room, client, message);
      break;
    default:
      console.error(
        `Invalid message type: ${type} received from client ${client.sessionId} in room ${room.roomId}`,
      );
      break;
  }
};
