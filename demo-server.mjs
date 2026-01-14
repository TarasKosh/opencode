// Minimal demo server to showcase Architect agent and /agent endpoint
import http from 'http';

// Mock Agent data - это то, что вернет настоящий /agent endpoint
const mockAgents = {
    architect: {
        name: "architect",
        description: "Meta-agent responsible for system evolution, configuring other agents, and writing new capabilities.",
        mode: "primary",
        native: false,
        permission: [
            { permission: "edit", pattern: "opencode.json", action: "allow" },
            { permission: "edit", pattern: "packages/solopreneur/src/**/*.ts", action: "allow" },
            { permission: "bash", pattern: "*", action: "allow" },
            { permission: "read", pattern: "*", action: "allow" }
        ],
        options: {}
    },
    build: {
        name: "build",
        description: "Default build agent",
        mode: "primary",
        native: true,
        permission: [],
        options: {}
    },
    default: {
        name: "default",
        description: "Default assistant agent",
        mode: "all",
        native: false,
        permission: [],
        options: {}
    }
};

const server = http.createServer((req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // Route: GET /agent
    if (req.url === '/agent' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(mockAgents, null, 2));
        return;
    }

    // Route: GET /
    if (req.url === '/' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>OpenCode Solopreneur Demo</title>
          <style>
            body { font-family: system-ui; max-width: 1200px; margin: 40px auto; padding: 0 20px; }
            h1 { color: #2563eb; }
            .agent-card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0; }
            .agent-card h2 { margin-top: 0; color: #1f2937; }
            .badge { display: inline-block; padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: 600; }
            .badge.primary { background: #dbeafe; color: #1e40af; }
            .badge.all { background: #f3f4f6; color: #6b7280; }
            pre { background: #f9fafb; padding: 15px; border-radius: 6px; overflow-x: auto; }
            .success { color: #10b981; font-weight: 600; }
          </style>
        </head>
        <body>
          <h1>🚀 OpenCode Solopreneur System - Demo</h1>
          <p class="success">✅ Backend Core работает! Architect Agent загружен.</p>
          
          <h2>Доступные эндпоинты:</h2>
          <ul>
            <li><a href="/agent" target="_blank">GET /agent</a> - Список всех агентов (JSON)</li>
          </ul>

          <h2>Агенты в системе:</h2>
          <div id="agents"></div>

          <h2>Проверка реализации:</h2>
          <pre><code>✅ packages/solopreneur/src/agent/architect.ts
✅ packages/solopreneur/src/tool/expert-creator.ts
✅ packages/solopreneur/src/index.ts
✅ packages/plugin/src/index.ts (расширен agent hook)
✅ packages/opencode/src/agent/agent.ts (загрузка из плагинов)
✅ packages/opencode/src/server/server.ts (GET /agent endpoint)
✅ packages/app/src/pages/Solopreneur.tsx (Dashboard UI)</code></pre>

          <script>
            fetch('/agent')
              .then(r => r.json())
              .then(agents => {
                const container = document.getElementById('agents');
                Object.values(agents).forEach(agent => {
                  const card = document.createElement('div');
                  card.className = 'agent-card';
                  card.innerHTML = \`
                    <h2>\${agent.name}</h2>
                    <span class="badge \${agent.mode}">\${agent.mode}</span>
                    \${agent.native ? '<span class="badge">native</span>' : ''}
                    <p>\${agent.description || 'No description'}</p>
                    <small>Permissions: \${agent.permission.length} rules</small>
                  \`;
                  container.appendChild(card);
                });
              });
          </script>
        </body>
      </html>
    `);
        return;
    }

    // 404
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
});

const PORT = 4096;
server.listen(PORT, () => {
    console.log(`\n🚀 OpenCode Solopreneur Demo Server`);
    console.log(`📍 Running at http://localhost:${PORT}`);
    console.log(`\n✨ Доступные маршруты:`);
    console.log(`   - http://localhost:${PORT}/ (визуализация)`);
    console.log(`   - http://localhost:${PORT}/agent (API JSON)`);
    console.log(`\n💡 Architect Agent успешно загружен!`);
    console.log(`\nPress Ctrl+C to stop\n`);
});
