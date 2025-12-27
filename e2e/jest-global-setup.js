import {default as setupPuppeteer} from "jest-environment-puppeteer/setup";
import {setup as setupDevServer} from "jest-dev-server";

export default async function globalSetup(globalConfig, projectConfig) {
  await setupPuppeteer(globalConfig);

  globalThis.servers = await setupDevServer([
    {
      command: `PORT=${projectConfig.globals.TARGET_PORT} tsx ./src/test-server.ts`,
      port: projectConfig.globals.TARGET_PORT,
      launchTimeout: 30000,
    },
  ]);
}
