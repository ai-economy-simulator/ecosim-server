import { Schema, Context, MapSchema, type } from "@colyseus/schema";
import { Delayed } from "colyseus";

export class Player extends Schema {
  @type("string") playerName: string | undefined;
  @type("string") avatar: string | undefined;
  @type("boolean") isReady: boolean = false;
  @type("string") playerID: string;

  email: string | undefined;

  constructor({
    playerName,
    avatar,
    email,
    playerID,
  }: {
    playerName: string | undefined;
    avatar: string | undefined;
    email: string | undefined;
    playerID: string;
  }) {
    super();
    this.playerName = playerName;
    this.avatar = avatar;
    this.email = email;
    this.playerID = playerID;
  }
}

export class RestartRoomState extends Schema {
  // World states
  @type("float32") stockPrice: number = 100;
  @type("string") activePlayer: string = null;
  @type("boolean") isGameStarted: boolean = false;
  @type("string") gameAdmin: string = null;

  // Game Environment States
  @type("int32") playerChanceLength: number = Number(
    process.env.PLAYER_CHANCE_LENGTH,
  );
  playerChanceTimer: Delayed;
  playerChanceIterator: IterableIterator<string>;

  @type({ map: Player }) players = new MapSchema<Player>();
}
