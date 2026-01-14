import { createResource, For, Show } from "solid-js"
import { useServer } from "@/context/server"
import { Card } from "@opencode-ai/ui/card"
import { Text } from "@opencode-ai/ui/text"
import { Button } from "@opencode-ai/ui/button"

interface AgentInfo {
    name: string
    description?: string
    mode: string
    model?: {
        modelID: string
        providerID: string
    }
}

export default function Solopreneur() {
    const server = useServer()

    const [agents] = createResource(async () => {
        const res = await fetch(`${server.url}/agent`)
        const data = await res.json()
        return Object.values(data) as AgentInfo[]
    })

    return (
        <div class="p-8 w-full max-w-6xl mx-auto">
            <div class="flex items-center justify-between mb-8">
                <div>
                    <Text.H1>Mission Control</Text.H1>
                    <Text.P class="text-text-weak mt-2">Solopreneur Operations Center</Text.P>
                </div>
                <Button onClick={() => alert("Creating agents via UI not yet implemented")}>+ New Agent</Button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <For each={agents() ?? []}>
                    {(agent) => (
                        <Card class="p-6">
                            <div class="flex items-center justify-between mb-4">
                                <Text.H3 class="capitalize">{agent.name}</Text.H3>
                                <div class={`px-2 py-1 rounded text-xs font-mono uppercase ${agent.mode === "primary" ? "bg-primary/20 text-primary" : "bg-surface-hover text-text-weak"}`}>
                                    {agent.mode}
                                </div>
                            </div>
                            <Text.P class="text-text-weak text-sm mb-4 line-clamp-3">
                                {agent.description || "No description provided"}
                            </Text.P>

                            <div class="flex items-center justify-between mt-auto pt-4 border-t border-border">
                                <span class="text-xs text-text-tertiary">
                                    {agent.model?.modelID ?? "Default Model"}
                                </span>
                                <Button size="sm" variant="ghost">Manage</Button>
                            </div>
                        </Card>
                    )}
                </For>
            </div>
        </div>
    )
}
