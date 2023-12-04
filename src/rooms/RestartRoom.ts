import { Room, Client } from "@colyseus/core";
import { RestartRoomState } from "./schema/RestartRoomState";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const NUMBERS = "0123456789";

export class RestartRoom extends Room<RestartRoomState> {
  maxClients = 8;

  LOBBY_CHANNEL = "$restartlobby";

  generateRoomIdSingle(): string {
    let result = "";
    for (var i = 0; i < 2; i++) {
      result += LETTERS.charAt(Math.floor(Math.random() * LETTERS.length));
    }
    for (var i = 0; i < 2; i++) {
      result += NUMBERS.charAt(Math.floor(Math.random() * NUMBERS.length));
    }
    return result;
  }
  async generateRoomId(): Promise<string> {
    const currentIds = await this.presence.smembers(this.LOBBY_CHANNEL);
    let id;
    do {
      id = this.generateRoomIdSingle();
    } while (currentIds.includes(id));

    await this.presence.sadd(this.LOBBY_CHANNEL, id);
    return id;
  }

  async onCreate(options: any) {
    this.roomId = await this.generateRoomId();

    this.setState(new RestartRoomState());

    this.onMessage("type", (client, message) => {
      //
      // handle "type" message
      //
    });
  }

  onJoin(client: Client, options: any) {
    console.log(client.sessionId, "joined!");
  }

  onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
    this.presence.srem(this.LOBBY_CHANNEL, this.roomId);
  }
}
