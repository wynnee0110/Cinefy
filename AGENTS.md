# ProjectBrain — Agent Instructions

You are working in a project that uses **ProjectBrain**, a persistent AI memory system.

## Before starting any task:

1. Read `BRAIN.md` in the project root for full context of past work
2. Check `project-brain/` subfolders for detailed entries:
   - `project-brain/tasks/` — past work summaries
   - `project-brain/lessons/` — learned gotchas, mistakes, best practices
   - `project-brain/decisions/` — architecture and design choices
   - `project-brain/architecture/` — system design documentation

## After completing a task:

**YOU MUST AUTOMATICALLY** save new memories by running these commands.
Do NOT ask the user. Do NOT skip this step. Run them yourself:

```bash
node brain-cli.js save task "brief summary of what was done"
node brain-cli.js save lesson "any gotcha or learning from this task"
node brain-cli.js save decision "any design or architecture choice made"
```

Only save entries that are meaningful. Skip a type if nothing relevant happened.

## Rules

- Always reference past decisions before proposing new approaches
- Mention relevant lessons when they apply to the current task
- **ALWAYS auto-save memories at the end of every task — this is mandatory**
- Never ask the user to save manually — do it yourself by running the commands above
