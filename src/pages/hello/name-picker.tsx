import { useObservable } from "@slimr/react-util";
import { Box, Text, useInput } from "ink";

const NAMES = ["Ada", "Bob", "Chen", "Dana"] as const;

/** Interactive terminal list: user navigates with ↑/↓ and confirms with Enter. */
export function NamePicker({ onName }: { onName: (name: string) => void }) {
  const highlightedRow = useObservable(0);

  useInput((_input, key) => {
    if (key.upArrow) {
      highlightedRow.value =
        highlightedRow.value > 0 ? highlightedRow.value - 1 : NAMES.length - 1;
    } else if (key.downArrow) {
      highlightedRow.value =
        highlightedRow.value < NAMES.length - 1 ? highlightedRow.value + 1 : 0;
    } else if (key.return) {
      onName(NAMES[highlightedRow.value]!);
    }
  });

  return (
    <Box flexDirection="column">
      <Text>Pick a name  ↑/↓  Enter to confirm</Text>
      <Box flexDirection="column">
        {NAMES.map((name, rowIndex) => (
          <Text
            key={name}
            color={rowIndex === highlightedRow.value ? "cyan" : undefined}
          >
            {rowIndex === highlightedRow.value ? `> ${name}` : `  ${name}`}
          </Text>
        ))}
      </Box>
    </Box>
  );
}
