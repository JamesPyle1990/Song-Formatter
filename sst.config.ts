import { SSTConfig } from "sst";
import { API } from "./stacks/MyStack.js";
import { Web } from "./stacks/WebStack.js";

export default {
  config(_input) {
    return {
      name: "song-formatter",
      region: "us-east-2",
    };
  },
  stacks(app) {
    app.stack(API);
    app.stack(Web)
  }
} satisfies SSTConfig;
