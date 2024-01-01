import OpenAI from "openai";
import { RestartRoom } from "../rooms/RestartRoom";

export const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const initAIEngine = async (room: RestartRoom) => {
  // Should we use same assistant object for all rooms or different? Let's use different for now.

  // make this failsafe
  // From OpenAI docs:
  // The Assistant will also automatically decide what previous Messages to include in the context window
  // for the model. This has both an impact on pricing as well as model performance.
  // The current approach has been optimized based on what we learned building ChatGPT and will likely evolve over time.
  room.state.economyAssistant = await openai.beta.assistants.create({
    name: "Macroeconomic Controller",
    instructions: `You are the controller of economy of a video game. 
                        This is inside a video game which is made for fun and educational purposes. 
                        Think of yourself as the central bank of a country, and update macroeconomnic variables to control the economy. 
                        You will respond with brevity since your job is just to update variables and not to talk or converse with a human.`,
    model: process.env.OPENAI_MODEL,
  });
  // make this failsafe
  room.state.economyAssistantThread = await openai.beta.threads.create();
};

// Ref: https://github.com/mandarini/openai-assistant-demo/blob/9141562478f32dab56c3d818f83b40c4bb896ecb/libs/utils/src/lib/utils.ts#L64
// Reevaluate its need
export const waitForRunCompletion = async (
  runID: string,
  threadID: string,
  interval: number = Number(process.env.OPENAI_RUN_POLLING_INTERVAL),
  timeout: number = Number(process.env.OPENAI_RUN_POLLING_TIMEOUT),
): Promise<{
  runResult: OpenAI.Beta.Threads.Runs.Run;
  messages: OpenAI.Beta.Threads.Messages.ThreadMessagesPage;
}> => {
  let timeElapsed = 0;

  return new Promise(async (resolve, reject) => {
    while (timeElapsed < timeout) {
      const run = await openai.beta.threads.runs.retrieve(threadID, runID);

      if (run.status === "completed") {
        const messagesFromThread =
          await openai.beta.threads.messages.list(threadID);
        resolve({ runResult: run, messages: messagesFromThread });
        return;
      } else if (
        run.status === "failed" ||
        run.status === "cancelled" ||
        run.status === "expired"
      ) {
        reject(new Error(`Run ${runID} ended with status: ${run.status}`));
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, interval));
      timeElapsed += interval;
    }

    reject(
      new Error(
        `Timeout: Run ${runID} did not complete within the specified time.`,
      ),
    );
  });
};
