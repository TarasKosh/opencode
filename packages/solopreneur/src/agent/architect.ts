import { type Agent } from "@opencode-ai/plugin"

export const ArchitectAgent: Agent = {
    name: "architect",
    description: "Meta-agent responsible for system evolution, configuring other agents, and writing new capabilities.",
    mode: "primary",
    permission: {
        edit: {
            "opencode.json": "allow",
            "packages/solopreneur/src/**/*.ts": "allow",
        },
        // Allow running build commands if necessary
        bash: "allow",
        // Allow reading all files to understand the system
        read: {
            "*": "allow",
        },
    },
}
