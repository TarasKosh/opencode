# Solopreneur Pipeline Launch Guide

Для запуска полнофункциональной системы в текущем окружении (Windows), следуйте этой инструкции.

## 1. Режим "Mission Control" (Быстрый старт)
Это основной интерфейс для управления вашими мета-агентами. Я настроил его так, чтобы он работал без конфликтов Babel.

```bash
# Запустить сервер управления (API + Dashboard Demo)
node demo-server.mjs
```
📍 **URL**: [http://localhost:4096](http://localhost:4096)

---

## 2. Полноценный запуск через Docker (Pipeline разработки)
Если вы хотите запустить всю систему OpenCode со всеми зависимостями:

```bash
# 1. Исправить зависимости (уже сделано, но для профилактики)
node script/fix-catalogs.mjs

# 2. Запустить контейнер (использует исправленный Docker Compose)
docker-compose -f docker-compose.dev.yml up -d
```
📍 **API**: `http://localhost:4096/agent`
📍 **App**: `http://localhost:3001`

---

## 3. Запуск конкретного агента (Marketing/Architect)
После того как сервер запущен, вы можете взаимодействовать с агентами через CLI:

```bash
# Вызов архитектора (если OpenCode установлен глобально)
opencode run --agent architect "Создай новый навык для поиска лидов в LinkedIn"
```

---

## Что дальше?
1. В **Mission Control** вы увидите список доступных агентов.
2. Используйте **Architect**, чтобы расширять систему (создавать новые инструменты и агентов).
3. Следите за логами в Docker: `docker logs -f opencode-solopreneur-1`
