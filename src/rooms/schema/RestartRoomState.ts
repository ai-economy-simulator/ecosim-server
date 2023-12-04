import { Schema, Context, type } from "@colyseus/schema";

export class RestartRoomState extends Schema {
  @type("string") mySynchronizedProperty: string = "Hello world";
}
