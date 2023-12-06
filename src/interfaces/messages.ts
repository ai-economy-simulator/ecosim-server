export enum MessageTypes {
  playerReady = "playerReady",
  startGame = "startGame",
}

export interface playerReadyMessageData {
  playerReady: boolean;
}
