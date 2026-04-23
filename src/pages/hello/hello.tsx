import { useState, useEffect } from "react";
import { Box, Text, useApp } from "ink";
import { NamePicker } from "./name-picker.tsx";

/** Greets the user by name. Renders NamePicker if name is not provided, otherwise displays the greeting with optional verbose output. */
export function Hello({ name, verbose }: { name?: string; verbose: boolean }) {
  const { exit } = useApp();
  const [resolvedName, setResolvedName] = useState<string | null>(name ?? null);

  useEffect(() => {
    if (resolvedName !== null) exit();
  }, [resolvedName]);

  if (resolvedName === null) {
    return <NamePicker onName={setResolvedName} />;
  }

  return (
    <Box flexDirection="column">
      {verbose && <Text>verbose mode</Text>}
      <Text>hello {resolvedName}</Text>
    </Box>
  );
}

