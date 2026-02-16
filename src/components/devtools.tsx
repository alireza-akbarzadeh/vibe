import { TanStackDevtools } from "@tanstack/react-devtools";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import TanStackQueryDevtools from "@/integrations/tanstack-query/devtools";
import AiDevtoolsPlugin from "@/lib/ai-devtools";

export default function Devtools() {
    return (
        <TanStackDevtools
            config={{ position: "bottom-right" }}
            plugins={[
                {
                    name: "Tanstack Router",
                    render: <TanStackRouterDevtoolsPanel />,
                },
                TanStackQueryDevtools,
                // Ensure proper prop passing if necessary
                { ...AiDevtoolsPlugin, render: AiDevtoolsPlugin.render },
            ]}
        />
    );
}
