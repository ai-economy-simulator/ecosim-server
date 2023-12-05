import { Room, Client } from "@colyseus/core";
import { Player, RestartRoomState } from "./schema/RestartRoomState";
import { generateRoomId } from "../services/roomID";
import { RoomOnJoinOptionsData } from "../interfaces/room";

export class RestartRoom extends Room<RestartRoomState> {
  maxClients = 8;
  LOBBY_CHANNEL = "$restartlobby";

  async onCreate(options: any) {
    this.roomId = await generateRoomId(this.presence, this.LOBBY_CHANNEL);
    this.setState(new RestartRoomState());

    this.onMessage("type", (client, message) => {
      //
      // handle "type" message
      //
    });
  }

  onJoin(client: Client, options: RoomOnJoinOptionsData) {
    console.log(client.sessionId, "joined room", this.roomId);
    this.state.players.set(
      client.sessionId,
      new Player({
        playerName: options.playerName,
        avatar: options.avatar,
        email: options.email,
      }),
    );
  }

  onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
    this.presence.srem(this.LOBBY_CHANNEL, this.roomId);
  }
}
