import { Room, Client } from "@colyseus/core";
import { Player, RestartRoomState } from "./schema/RestartRoomState";
import { generateRoomId } from "../services/roomID";
import { RoomOnJoinOptionsData } from "../interfaces/room";
import { messageBroker } from "../services/messagesBroker";
import { IncomingMessage } from "http";
import { valdiateToken } from "../services/token";

export class RestartRoom extends Room<RestartRoomState> {
  maxClients = 8;
  LOBBY_CHANNEL = "$restartlobby";

  async onCreate(options: any) {
    this.roomId = await generateRoomId(this.presence, this.LOBBY_CHANNEL);
    console.log("Room created with ID: ", this.roomId);
    // Create logic to dispose rooms after a certain time if there is <= 1 connected client
    this.autoDispose = false;
    // make all these rooms private for added security
    this.setState(new RestartRoomState());

    this.onMessage("*", (client, type, message) => {
      messageBroker(this, client, type as string, message);
    });
  }

  async onAuth(
    client: Client,
    options: RoomOnJoinOptionsData,
    request: IncomingMessage,
  ) {
    // log IP address of client available in request object
    console.log(`${options.email} attempting to join.`);
    return await valdiateToken(options.accessToken);
  }

  onJoin(client: Client, options: RoomOnJoinOptionsData) {
    // a client should be identified by email or some other user ID instead of session ID
    // a client should not be allowed to join concurrently from two tabs
    console.log(client.sessionId, "joined room", this.roomId);
    this.state.players.set(
      client.sessionId,
      new Player({
        playerName: options.playerName,
        avatar: options.avatar,
        email: options.email,
        playerID: client.sessionId,
      }),
    );
  }

  onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, "left room", this.roomId);
    this.state.players.delete(client.sessionId);
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
    this.presence.srem(this.LOBBY_CHANNEL, this.roomId);
  }
}
