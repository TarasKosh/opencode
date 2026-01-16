import { z } from "zod";
import fs from "node:fs/promises";
import path from "node:path";

/**
 * SkillScaffoldTool allows the Architect agent to generate the boilerplate code
 * for a new tool (skill) within the solopreneur package.
 */
export const SkillScaffoldTool = {
    description: "Генерирует шаблон (scaffold) для нового навыка (инструмента) в пакете solopreneur. Используйте это, когда системе нужно расширить свои возможности новым инструментом.",
    args: {
        toolName: z.string().describe("Название инструмента в snake_case (например, 'twitter_poster')"),
        className: z.string().describe("Название класса в PascalCase (например, 'TwitterPosterTool')"),
        description: z.string().describe("Краткое описание того, что делает этот инструмент"),
    },
    execute: async (args: { toolName: string; className: string; description: string }) => {
        const fileName = `${args.toolName.replace(/_/g, "-")}.ts`;
        const targetPath = path.resolve(process.cwd(), "packages", "solopreneur", "src", "tool", fileName);

        // Template for the new tool (consistent with ExpertCreator structure)
        const template = `import { z } from "zod";
// import fs from "node:fs/promises";
// import path from "node:path";

/**
 * ${args.className} - ${args.description}
 * Сгенерировано агентом Architect.
 */
export const ${args.className} = {
  description: "${args.description}",
  args: {
    // Опишите входные параметры здесь (zod schema)
    example: z.string().describe("Пример параметра"),
  },
  execute: async (args: { example?: string }) => {
    // Реализуйте логику инструмента здесь
    console.log("Выполнение ${args.toolName} с параметрами:", args);
    return {
      success: true,
      message: "Инструмент ${args.toolName} успешно выполнен (заглушка)",
    };
  },
};
`;

        try {
            // Ensure directory exists
            await fs.mkdir(path.dirname(targetPath), { recursive: true });

            // Check if already exists
            try {
                await fs.access(targetPath);
                return `Файл ${fileName} уже существует. Используйте стандартные средства редактирования файлов для его изменения.`;
            } catch {
                // File doesn't exist, proceed
            }

            await fs.writeFile(targetPath, template, "utf8");

            return `Шаблон для ${args.className} успешно создан в ${fileName}.
Инструкции:
1. Допишите логику в ${fileName}.
2. Экспортируйте его в packages/solopreneur/src/index.ts.`;
        } catch (error: any) {
            return `Ошибка: Не удалось создать файл: ${error.message}`;
        }
    },
};
