import { RestartRoom } from "../rooms/RestartRoom";
import { openai, waitForRunCompletion } from "./openai";

export const updateWorld = async (room: RestartRoom) => {
  const message = await openai.beta.threads.messages.create(
    room.state.economyAssistantThread.id,
    {
      role: "user",
      content: `Current stock price is ${room.state.stockPrice}. What should be the new stock price chosen randomly? Reply only with a number and nothing else.`,
    },
  );

  const run = await openai.beta.threads.runs.create(
    room.state.economyAssistantThread.id,
    {
      assistant_id: room.state.economyAssistant.id,
      additional_instructions: "",
    },
  );

  const result = await waitForRunCompletion(
    run.id,
    room.state.economyAssistantThread.id,
  );

  console.log(JSON.stringify(result.messages.data));
};
