import { z } from "zod"
import { modify, applyEdits, type formattingOptions } from "jsonc-parser"
import fs from "node:fs/promises"
import path from "node:path"

export const ExpertCreatorTool = {
    description: "Creates or updates an agent configuration in opencode.json. Use this to spawn new agents.",
    args: {
        name: z.string().describe("The unique identifier for the agent (e.g. 'twitter_writer')"),
        description: z.string().describe("What this agent does"),
        prompt: z.string().describe("The system prompt for importance context"),
        mode: z.enum(["primary", "subagent", "all"]).optional().default("subagent"),
        model: z.string().optional().describe("Specific model ID if needed"),
    },
    execute: async (args: { name: string; description: string; prompt: string; mode?: string; model?: string }) => {
        const configPath = path.resolve(process.cwd(), "opencode.json")

        let content = "{}"
        try {
            content = await fs.readFile(configPath, "utf-8")
        } catch (e) {
            // If file doesn't exist, we start with empty object
        }

        const { name, ...agentConfig } = args

        // Path to insert: ["agent", name]
        const edits = modify(content, ["agent", name], agentConfig, {
            formattingOptions: {
                tabSize: 2,
                insertSpaces: true,
            }
        })

        const newContent = applyEdits(content, edits)
        await fs.writeFile(configPath, newContent)

        return `Successfully configured agent '${name}' in ${configPath}`
    },
}
