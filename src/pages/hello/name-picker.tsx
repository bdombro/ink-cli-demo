import { Select } from "@inkjs/ui";
import { Box, Text } from "ink";

const NAMES = ["Ada", "Bob", "Chen", "Dana"] as const;

const OPTIONS = NAMES.map((name) => ({ label: name, value: name }));

/** Interactive terminal list: user navigates with ↑/↓ and confirms with Enter. */
export function NamePicker({ onName }: { onName: (name: string) => void }) {
  return (
    <Box flexDirection="column">
      <Text>Pick a name</Text>
      <Select options={OPTIONS} onChange={onName} />
    </Box>
  );
}
