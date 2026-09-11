import type { Finding } from "./legal-guard";

// The repository is public: commit messages carry the editor's display
// name for the audit trail, never their email address. The history panel
// reads the name back out of the "Edited by … via" line.
export const commitMessage = (summary: string, who: string, acknowledged: Finding[] = []) =>
  `${summary}\n\n` +
  (acknowledged.length
    ? `Published despite legal-guard warnings:\n${acknowledged.map((f) => `- "${f.excerpt}" — ${f.rule}`).join("\n")}\n\n`
    : "") +
  `Edited by ${who} via onarestore.com/admin`;
