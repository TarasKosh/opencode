import { type Plugin } from "@opencode-ai/plugin"
import { ArchitectAgent } from "./agent/architect"
import { ExpertCreatorTool } from "./tool/expert-creator"
import { SkillScaffoldTool } from "./tool/skill-scaffold"

const plugin: Plugin = async () => {
  return {
    agent: {
      architect: ArchitectAgent,
    },
    tool: {
      expert_creator: ExpertCreatorTool,
      skill_scaffold: SkillScaffoldTool,
    },
  }
}

export default plugin
