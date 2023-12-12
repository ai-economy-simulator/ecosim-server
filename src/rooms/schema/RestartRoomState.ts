import { Schema, MapSchema, type, filter } from "@colyseus/schema";
import { Client, Delayed } from "colyseus";

export class PlayerPrivate extends Schema {
  @type("string") email: string | undefined;
}

export class Player extends Schema {
  @type("string") playerName: string | undefined;
  @type("string") avatar: string | undefined;
  @type("boolean") isReady: boolean = false;
  @type("string") playerID: string;

  // Do not use arrow function here as per Colyseus docs https://docs.colyseus.io/state/schema/#filter-property-decorator
  @filter(function (
    this: Player,
    client: Client,
    value: PlayerPrivate,
    root: Schema,
  ) {
    return this.playerID === client.sessionId;
  })
  @type(PlayerPrivate)
  private: PlayerPrivate = new PlayerPrivate();

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
    this.private.email = email;
    this.playerID = playerID;
  }
}

export class RestartRoomState extends Schema {
  // World states
  @type("float32") stockPrice: number = 100;

  // Game Environment States
  @type("string") activePlayer: string = null;
  @type("boolean") isGameStarted: boolean = false;
  @type("string") gameAdmin: string = null;
  @type("int32") playerChanceLength: number = Number(
    process.env.PLAYER_CHANCE_LENGTH,
  );
  playerChanceTimer: Delayed;
  playerChanceIterator: IterableIterator<string>;

  @type({ map: Player }) players = new MapSchema<Player>();
}
