import { Room, Client } from "@colyseus/core";
import { Player, RestartRoomState } from "./schema/RestartRoomState";
import { generateRoomId } from "../services/roomID";
import { RoomOnJoinOptionsData } from "../interfaces/room";
import { messageBroker } from "../services/messagesBroker";
import { IncomingMessage } from "http";
import { valdiateToken } from "../services/token";
import { initAIEngine, openai } from "../services/openai";

export class RestartRoom extends Room<RestartRoomState> {
  maxClients = 8;
  LOBBY_CHANNEL = "$restartlobby";

  async onCreate(options: any) {
    this.roomId = await generateRoomId(this.presence, this.LOBBY_CHANNEL);
    console.log("Room created with ID: ", this.roomId);
    // Create logic to dispose rooms after a certain time if there is <= 1 connected client
    this.autoDispose = false;
    this.clock.setInterval(() => {
      if (this.clients.length <= 1) {
        this.disconnect(); // Disconnect clients and dispose if conditions are met
      }
    }, 60 * 1000); // 60 seconds in milliseconds

    this.setState(new RestartRoomState());

    this.onMessage("*", (client, type, message) => {
      messageBroker(this, client, type as string, message);
    });

    // Make this failsafe and handle errors here
    initAIEngine(this);
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

    this.clock.setInterval(() => {
      if (this.clients.length <= 1) {
        this.disconnect(); // Disconnect clients and dispose if conditions are met
      }
    }, 10 * 1000); // 60 seconds in milliseconds
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
    this.presence.srem(this.LOBBY_CHANNEL, this.roomId);
  }
}
