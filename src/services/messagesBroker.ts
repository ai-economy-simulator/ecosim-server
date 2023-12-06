import { Client } from "colyseus";
import { RestartRoom } from "../rooms/RestartRoom";
import { changePlayerReadyStatus } from "./messagesHandler";
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
    case MessageTypes.playerReady:
      changePlayerReadyStatus(room, client, message);
      break;
    case MessageTypes.startGame:
      break;
    default:
      console.error(
        `Invalid message type: ${type} received from client ${client.sessionId} in room ${room.roomId}`,
      );
      break;
  }
};
