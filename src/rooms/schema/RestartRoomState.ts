import { Schema, Context, MapSchema, type } from "@colyseus/schema";

export class Player extends Schema {
  @type("string") playerName: string | undefined;
  @type("string") avatar: string | undefined;

  email: string | undefined;

  constructor({
    playerName,
    avatar,
    email,
  }: {
    playerName: string | undefined;
    avatar: string | undefined;
    email: string | undefined;
  }) {
    super();
    this.playerName = playerName;
    this.avatar = avatar;
    this.email = email;
  }
}

export class RestartRoomState extends Schema {
  // World states
  @type("float32") stockPrice: number = 100;

  @type({ map: Player }) players = new MapSchema<Player>();
}
