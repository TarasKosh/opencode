import { type Plugin } from "@opencode-ai/plugin"
import { ArchitectAgent } from "./agent/architect"
import { ExpertCreatorTool } from "./tool/expert-creator"

const plugin: Plugin = async () => {
  return {
    agent: {
      architect: ArchitectAgent,
    },
    tool: {
      expert_creator: ExpertCreatorTool,
    },
  }
}

export default plugin
