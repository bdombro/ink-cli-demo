#!/usr/bin/env bun
/** CLI entry: argsbarg routing; renders Hello component with optional --name and --verbose flags. */

import { cliRun, type CliCommand, CliOptionKind, CliFallbackMode } from "argsbarg";
import { render } from "ink";
import { Hello } from "./pages/hello";

/** Argsbarg program root: app id, default subcommand, and the `hello` command tree. */
const cli: CliCommand = {
  key: "ink-cli-demo",
  description: "Tiny demo.",
  commands: [
    {
      key: "hello",
      description: "Say hello.",
      options: [
        {
          name: "name",
          description: "Who to greet.",
          kind: CliOptionKind.String,
          shortName: "n",
        },
        {
          name: "verbose",
          description: "Enable extra logging.",
          kind: CliOptionKind.Presence,
          shortName: "v",
        },
      ],
      handler: async (ctx) => {
        await render(<Hello name={ctx.stringOpt("name")} verbose={ctx.hasFlag("verbose")} />).waitUntilExit()
      },
    },
  ],
  fallbackCommand: "hello",
  fallbackMode: CliFallbackMode.MissingOrUnknown,
};

await cliRun(cli);
