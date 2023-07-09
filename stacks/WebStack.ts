import { StackContext, StaticSite, use } from "sst/constructs";
import { API } from "./MyStack.js";


export function Web({ stack }: StackContext) {
    const { api } = use(API);

    const web = new StaticSite(stack, "web", {
        path: "packages/web",
        buildOutput: "dist",
        buildCommand: "npm run build",
        environment: {
        VITE_APP_API_URL: api.url,
        },
    });
}