import { Presence } from "colyseus";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const NUMBERS = "0123456789";

function generateRoomIdSingle(): string {
  let result = "";
  for (var i = 0; i < 2; i++) {
    result += LETTERS.charAt(Math.floor(Math.random() * LETTERS.length));
  }
  for (var i = 0; i < 2; i++) {
    result += NUMBERS.charAt(Math.floor(Math.random() * NUMBERS.length));
  }
  return result;
}

export async function generateRoomId(
  presence: Presence,
  lobbyChannel: string,
): Promise<string> {
  const currentIds = await presence.smembers(lobbyChannel);
  let id;
  do {
    id = generateRoomIdSingle();
  } while (currentIds.includes(id));

  await presence.sadd(lobbyChannel, id);
  return id;
}
