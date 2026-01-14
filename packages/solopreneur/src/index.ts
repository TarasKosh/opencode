import { type Plugin } from "@opencode-ai/plugin"
import z from "zod"

const HelloTool = {
  description: "A test tool to verify solopreneur plugin is loaded",
  args: {
    name: z.string().describe("Your name"),
  },
  execute: async ({ name }: { name: string }) => {
    return `Hello, ${name}! The Solopreneur plugin is active.`
  },
}

const plugin: Plugin = async () => {
  return {
    tool: {
      hello_solopreneur: HelloTool,
    },
  }
}

export default plugin
