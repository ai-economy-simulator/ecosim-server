import { RestartRoom } from "../rooms/RestartRoom";

export const playerChanceLoop = async (
  room: RestartRoom,
  iterator: IterableIterator<string>,
) => {
  const playerRef = iterator.next();

  if (playerRef.done) {
    playerChanceLoop(room, room.state.players.keys());
  } else {
    room.state.activePlayer = playerRef.value;

    // Node.js makes no guarantees about the exact timing of when callbacks will fire, nor of their ordering. The callback will be called as close as possible to the time specified.
    setTimeout(
      (room, iterator) => {
        playerChanceLoop(room, iterator);
      },
      room.state.playerChanceLength,
      room,
      iterator,
    );
  }
};
