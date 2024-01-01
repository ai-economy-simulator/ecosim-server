import { RestartRoom } from "../rooms/RestartRoom";
import { updateWorld } from "./updateWorld";

export const advancePlayerChance = async (room: RestartRoom) => {
  const playerRef = room.state.playerChanceIterator.next();

  if (playerRef.done) {
    room.state.playerChanceIterator = room.state.players.keys();
    advancePlayerChance(room);
  } else {
    console.log("Advancing player chance to ", playerRef.value);
    updateWorld(room);

    room.state.activePlayer = playerRef.value;

    // Node.js makes no guarantees about the exact timing of when callbacks will fire, nor of their ordering. The callback will be called as close as possible to the time specified.
    room.state.playerChanceTimer = room.clock.setTimeout(
      (room: RestartRoom) => {
        advancePlayerChance(room);
      },
      room.state.playerChanceLength,
      room,
    );
  }
};
