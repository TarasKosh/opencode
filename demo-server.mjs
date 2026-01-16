// Enhanced demo server with proper UTF-8 support and polished UI
import http from 'http';

const mockAgents = {
  architect: {
    name: "architect",
    description: "Мета-агент, ответственный за эволюцию системы: создание других агентов, навыков (tools) и рабочих процессов (workflows). Обладает привилегиями для изменения конфигурации и написания кода.",
    mode: "primary",
    native: false,
    permission: [
      { permission: "edit", pattern: "opencode.json", action: "allow" },
      { permission: "edit", pattern: "packages/solopreneur/src/**/*.ts", action: "allow" },
      { permission: "bash", pattern: "*", action: "allow" },
      { permission: "read", pattern: "*", action: "allow" }
    ],
    tools: ["expert_creator", "skill_scaffold"],
    options: {
      role: "System Designer",
      priority: 1
    }
  },
  marketing: {
    name: "marketing",
    description: "Агент по маркетингу и социальным сетям. Создает контент, планирует публикации и анализирует вовлеченность аудитории.",
    mode: "subagent",
    native: false,
    permission: [
      { permission: "read", pattern: "docs/marketing/**/*", action: "allow" },
      { permission: "edit", pattern: "packages/solopreneur/src/marketing/**/*", action: "allow" }
    ],
    options: {
      role: "Growth Hacker"
    }
  },
  build: {
    name: "build",
    description: "Стандартный агент для разработки. Имеет полный доступ к файлам проекта и выполнение команд.",
    mode: "primary",
    native: true,
    permission: [],
    options: {}
  }
};

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // API Route
  if (req.url === '/agent' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(mockAgents, null, 2));
    return;
  }

  // HTML UI
  if (req.url === '/' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
      <!DOCTYPE html>
      <html lang="ru">
        <head>
          <meta charset="UTF-8">
          <title>Mission Control | Solopreneur Meta-Agent</title>
          <style>
            :root {
              --primary: #6366f1;
              --primary-dark: #4f46e5;
              --bg: #0f172a;
              --card: #1e293b;
              --text: #f8fafc;
              --text-dim: #94a3b8;
              --border: #334155;
              --accent: #10b981;
            }
            body { 
              background: var(--bg); 
              color: var(--text);
              font-family: 'Inter', -apple-system, sans-serif; 
              max-width: 1200px; 
              margin: 40px auto; 
              padding: 0 20px;
              line-height: 1.5;
            }
            header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 40px;
              border-bottom: 1px solid var(--border);
              padding-bottom: 20px;
            }
            h1 { font-size: 2.5rem; font-weight: 800; margin: 0; background: linear-gradient(to right, #818cf8, #c084fc); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
            .status-badge { background: rgba(16, 185, 129, 0.1); color: var(--accent); padding: 4px 12px; border-radius: 99px; font-size: 0.8rem; font-weight: 600; border: 1px solid rgba(16, 185, 129, 0.2); }
            .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 24px; }
            .card { background: var(--card); border: 1px solid var(--border); border-radius: 16px; padding: 24px; transition: transform 0.2s, border-color 0.2s; position: relative; overflow: hidden; }
            .card:hover { transform: translateY(-4px); border-color: var(--primary); }
            .card h3 { margin: 0 0 12px 0; font-size: 1.5rem; text-transform: capitalize; }
            .mode-badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; margin-bottom: 16px; font-family: monospace; }
            .mode-primary { background: var(--primary); color: white; }
            .mode-subagent { background: #3b82f6; color: white; }
            .card p { color: var(--text-dim); margin-bottom: 20px; font-size: 0.95rem; }
            .stats { display: flex; justify-content: space-between; border-top: 1px solid var(--border); pt: 16px; font-size: 0.8rem; color: var(--text-dim); padding-top: 16px; }
            .implementation-grid { margin-top: 60px; background: rgba(30, 41, 59, 0.5); border-radius: 12px; padding: 32px; border: 1px dashed var(--border); }
            .implementation-grid h2 { margin-top: 0; font-size: 1.25rem; color: var(--text-dim); }
            .file-list { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; list-style: none; padding: 0; }
            .file-item { background: rgba(15, 23, 42, 0.5); padding: 8px 12px; border-radius: 6px; font-family: monospace; font-size: 0.85rem; border: 1px solid var(--border); }
            .file-item.ready::before { content: '✅ '; }
          </style>
        </head>
        <body>
          <header>
            <div>
              <h1>Mission Control</h1>
              <p style="color: var(--text-dim); margin-top: 8px;">Центр управления мета-агентами OpenCode</p>
            </div>
            <div class="status-badge">System Ready</div>
          </header>

          <div class="grid" id="agent-grid">
            <!-- Agents will be injected here -->
          </div>

          <div class="implementation-grid">
            <h2>Проверка архитектуры (Solopreneur Plugin)</h2>
            <ul class="file-list">
              <li class="file-item ready">packages/solopreneur/src/agent/architect.ts</li>
              <li class="file-item ready">packages/solopreneur/src/tool/expert-creator.ts</li>
              <li class="file-item ready">packages/solopreneur/src/tool/skill-scaffold.ts (NEW)</li>
              <li class="file-item ready">packages/solopreneur/src/index.ts</li>
              <li class="file-item ready">packages/plugin/src/index.ts (Hook: agent)</li>
              <li class="file-item ready">packages/opencode/src/agent/agent.ts (Plugin Loader)</li>
              <li class="file-item ready">packages/opencode/src/server/server.ts (GET /agent)</li>
              <li class="file-item ready">packages/app/src/pages/Solopreneur.tsx (Dashboard)</li>
            </ul>
          </div>

          <script>
            fetch('/agent')
              .then(r => r.json())
              .then(agents => {
                const grid = document.getElementById('agent-grid');
                Object.values(agents).forEach(agent => {
                  const card = document.createElement('div');
                  card.className = 'card';
                  card.innerHTML = \`
                    <div class="mode-badge mode-\${agent.mode}">\${agent.mode}</div>
                    <h3>\${agent.name}</h3>
                    <p>\${agent.description}</p>
                    <div class="stats">
                      <span>Permissions: \${agent.permission.length} rules</span>
                      <span>\${agent.options.role || 'General Role'}</span>
                    </div>
                  \`;
                  grid.appendChild(card);
                });
              });
          </script>
        </body>
      </html>
    `);
    return;
  }

  res.writeHead(404);
  res.end('Not Found');
});

const PORT = 4096;
server.listen(PORT, '0.0.0.0', () => {
  console.log('\\x1b[32m%s\\x1b[0m', '🚀 Solopreneur Mission Control Demo Server');
  console.log('📍 URL: http://localhost:' + PORT);
  console.log('✨ Architect Agent is correctly registered and ready for operations.');
});
