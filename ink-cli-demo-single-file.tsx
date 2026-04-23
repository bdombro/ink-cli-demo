#!/usr/bin/env bun

/*

# Ink CLI Demo



*/


import "bun";
import { Select } from "@inkjs/ui";
import { Box, Text, render, useApp } from "ink";
import { useState, useEffect } from "react";
import { cliRun, type CliCommand, CliOptionKind, CliFallbackMode } from "argsbarg";

const NAMES = ["Ada", "Bob", "Chen", "Dana"] as const;
const NAME_OPTIONS = NAMES.map((name) => ({ label: name, value: name }));

class HelloHandler {
    /** Interactive terminal list: user navigates with ↑/↓ and confirms with Enter. */
    private static NamePicker({ onName }: { onName: (name: string) => void }) {
        return (
            <Box flexDirection="column">
                <Text>Pick a name</Text>
                <Select options={NAME_OPTIONS} onChange={onName} />
            </Box>
        );
    }

    /** Greets the user by name. Renders NamePicker if name is not provided, otherwise displays the greeting with optional verbose output. */
    static Main({ name, verbose }: { name?: string; verbose: boolean }) {
    const { exit } = useApp();
    const [resolvedName, setResolvedName] = useState<string | null>(name ?? null);

    useEffect(() => {
        if (resolvedName !== null) exit();
    }, [resolvedName]);

    if (resolvedName === null) {
        // return <NamePicker onName={setResolvedName} />;
        return <HelloHandler.NamePicker onName={setResolvedName} />;
    }

    return (
        <Box flexDirection="column">
        {verbose && <Text>verbose mode</Text>}
        <Text>hello {resolvedName}</Text>
        </Box>
    );
    }
}

/** Argsbarg program root: app id, default subcommand, and the `hello` command tree. */
const cli: CliCommand = {
  key: "ink-cli-demo-single-file.tsx",
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
        await render(<HelloHandler.Main name={ctx.stringOpt("name")} verbose={ctx.hasFlag("verbose")} />).waitUntilExit()
      },
    },
  ],
  fallbackCommand: "hello",
  fallbackMode: CliFallbackMode.MissingOrUnknown,
};

await cliRun(cli);
