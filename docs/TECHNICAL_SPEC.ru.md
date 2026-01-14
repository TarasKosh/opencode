# Technical Spec: Solopreneur Expansion

## 1. Архитектура Плагина (`packages/solopreneur`)

### Структура Пакета
```text
packages/solopreneur/
├── package.json
├── src/
│   ├── index.ts              # Entry point (экспортирует плагин)
│   ├── agent/                # Логика специальных агентов
│   │   ├── architect.ts      # Definition агента Architect
│   │   └── cmo.ts            # Definition агента CMO
│   ├── tool/                 # Инструменты
│   │   ├── expert-creator.ts # Создание записи в opencode.json
│   │   ├── skill-scaffold.ts # Генерация .ts файлов навыков
│   │   └── dashboard-api.ts  # API для фронтенда
│   └── workflow/             # Шаблоны воркфлоу
```

### Интеграция
*   Плагин регистрируется в `opencode.json` через поле `plugin`.
*   При загрузке `index.ts` вызывает `Config.registerAgent` для добавления `Architect` в систему (динамически, в рантайме).

## 2. Реализация Агента "Architect"

### Конфигурация
Агент будет иметь доступ к критическим разрешениям, которые закрыты для остальных.
```typescript
// src/agent/architect.ts
export const ArchitectAgent = {
  name: "architect",
  description: "Meta-agent responsible for system evolution.",
  permission: {
    // Разрешаем писать в конфиги и исходный код плагина
    edit: {
      "opencode.json": "allow",
      "packages/solopreneur/src/**/*.ts": "allow"
    },
    // Разрешаем запускать терминальные команды для сборки
    bash: "allow"
  }
}
```

### Инструмент `expert_creator`
Этот инструмент будет безопасно модифицировать `opencode.json`.
*   **Использует**: `jsonc-parser` для сохранения комментариев и форматирования.
*   **Логика**:
    1.  Чтение `opencode.json`.
    2.  Валидация входящего конфига агента (Zod).
    3.  Вставка узла в JSON AST.
    4.  Запись файла.

## 3. Визуальный Дашборд (packages/web)

Поскольку `packages/web` — это Astro + SolidJS проект, мы добавим новые страницы.

### Маршрутизация
*   `/solopreneur` — Главная страница дашборда.
*   `/solopreneur/agents` — Сетка агентов.
*   `/solopreneur/workflows` — Редактор воркфлоу.

### Компоненты (SolidJS)
1.  **`AgentCard.tsx`**: Карточка агента с индикатором статуса (Idle/Working) и кнопкой "Edit Settings".
2.  **`MetricsChart.tsx`**: Графики (используем простую библиотеку вроде `chart.js` или SVG).
3.  **`ApprovalQueue.tsx`**: Список действий, ожидающих подтверждения от пользователя (хранятся в JSON файле `pending_approvals.json`).

### Data Fetching
*   Фронтенд будет опрашивать бэкенд (Astro endopoints) или читать локальные JSON-файлы (если это статика), но для динамики лучше использовать API эндпоинты в `pages/api/solopreneur/*`.

## 4. Workflows & State
*   Состояние воркфлоу хранится в `.opencode/state/solopreneur.db` (SQLite) или JSON файлах.
*   Мы создадим простой движок исполнения воркфлоу в `packages/solopreneur/src/engine.ts`.

## 5. План Реализации (Пошаговый)

1.  **Back-end Core**:
    *   Реализовать `architect.ts` и регистрацию агента.
    *   Реализовать `expert_creator.ts`.
2.  **Front-end Skeleton**:
    *   Создать роут `/solopreneur` в `packages/web`.
    *   Вывести список агентов (read-only).
3.  **Integration**:
    *   Связать фронт с бэком для отображения реальных данных.
