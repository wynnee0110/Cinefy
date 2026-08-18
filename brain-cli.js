#!/usr/bin/env node

/**
 * brain-cli.js — ProjectBrain CLI
 *
 * A simple tool to manage your project's AI memory.
 * Works alongside ANY agent (Antigravity, Copilot, Cursor, Cline, etc.)
 *
 * Usage:
 *   node brain-cli.js save task "implemented user authentication"
 *   node brain-cli.js save lesson "always hash passwords with bcrypt"
 *   node brain-cli.js save decision "using JWT for stateless auth"
 *   node brain-cli.js save architecture "microservices with API gateway"
 *   node brain-cli.js refresh          ← rebuilds BRAIN.md
 *   node brain-cli.js status           ← shows memory stats
 *   node brain-cli.js view [type]      ← shows recent entries
 */

const { readMemory, writeMemory, ensureBrainDirs, refreshBrain, MEMORY_TYPES } = require('./brain-memory');

const [,, command, ...args] = process.argv;

function printHelp() {
  console.log(`
╔══════════════════════════════════════════════════════╗
║                 🧠 ProjectBrain CLI                  ║
║        Persistent AI Memory for Any Agent            ║
╚══════════════════════════════════════════════════════╝

Commands:

  save <type> "<content>"  Save a memory entry
    Types: task, lesson, decision, architecture

    Examples:
      node brain-cli.js save task "built login system with OAuth"
      node brain-cli.js save lesson "JWT tokens need expiry validation"
      node brain-cli.js save decision "using PostgreSQL over MongoDB"
      node brain-cli.js save architecture "REST API with middleware pattern"

  refresh                  Rebuild BRAIN.md from all memories
                           (run after saving new entries)

  status                   Show memory statistics

  view [type]              View recent memory entries
                           Omit type to see all

How it works:
  1. Chat with ANY AI agent in your IDE
  2. After a productive session, save key takeaways:
       node brain-cli.js save lesson "input validation at boundaries"
  3. Refresh the brain file:
       node brain-cli.js refresh
  4. Next time any agent reads your project, it sees BRAIN.md
     and has full context of your project history.
`);
}

// ─── Commands ────────────────────────────────────────────────────────────────

function cmdSave() {
  const typeArg = args[0];
  const content = args.slice(1).join(' ').trim();

  // Normalize: allow singular forms
  const typeMap = {
    task: 'tasks', tasks: 'tasks',
    lesson: 'lessons', lessons: 'lessons',
    decision: 'decisions', decisions: 'decisions',
    architecture: 'architecture', arch: 'architecture',
  };

  const type = typeMap[typeArg];
  if (!type) {
    console.error(`❌ Unknown type "${typeArg}". Use: task, lesson, decision, architecture`);
    process.exit(1);
  }

  if (!content) {
    console.error('❌ No content provided. Usage: node brain-cli.js save task "your content"');
    process.exit(1);
  }

  const filepath = writeMemory(type, content);
  if (filepath) {
    console.log(`✅ Saved ${typeArg} → ${filepath.split('/').pop()}`);
    // Auto-refresh BRAIN.md after saving
    const result = refreshBrain();
    console.log(`🔄 BRAIN.md refreshed (${result.totalEntries} total memories)`);
  } else {
    console.error('❌ Failed to save — content might be empty.');
  }
}

function cmdRefresh() {
  const result = refreshBrain();
  console.log(`✅ BRAIN.md refreshed`);
  console.log(`   📊 ${result.totalEntries} total memories`);
  console.log(`   📄 ${result.path}`);
}

function cmdStatus() {
  ensureBrainDirs();
  const memory = readMemory();

  console.log('\n🧠 ProjectBrain Status\n');
  console.log('─'.repeat(40));

  let total = 0;
  for (const type of MEMORY_TYPES) {
    const count = memory[type].length;
    total += count;
    const icon = { tasks: '📋', lessons: '📖', decisions: '⚖️', architecture: '🏗️' }[type];
    console.log(`  ${icon}  ${type.padEnd(15)} ${count} entries`);
  }

  console.log('─'.repeat(40));
  console.log(`  📊 Total:          ${total} entries`);

  const fs = require('fs');
  const path = require('path');
  const brainFile = path.join(__dirname, 'BRAIN.md');
  if (fs.existsSync(brainFile)) {
    const stat = fs.statSync(brainFile);
    console.log(`  📄 BRAIN.md:       ${(stat.size / 1024).toFixed(1)} KB`);
    console.log(`  🕐 Last refresh:   ${stat.mtime.toISOString()}`);
  } else {
    console.log('  ⚠️  BRAIN.md:       not yet generated (run: node brain-cli.js refresh)');
  }
  console.log('');
}

function cmdView() {
  const filterType = args[0];
  const memory = readMemory();
  const typesToShow = filterType
    ? [MEMORY_TYPES.find(t => t.startsWith(filterType)) || filterType]
    : MEMORY_TYPES;

  for (const type of typesToShow) {
    const entries = memory[type];
    if (!entries || entries.length === 0) continue;

    console.log(`\n${'═'.repeat(50)}`);
    console.log(`  ${type.toUpperCase()} (${entries.length} entries)`);
    console.log('═'.repeat(50));

    entries.slice(0, 5).forEach(e => {
      console.log(`\n📄 ${e.filename}`);
      console.log('─'.repeat(40));
      console.log(e.content.trim());
    });
  }
  console.log('');
}

// ─── Router ──────────────────────────────────────────────────────────────────

switch (command) {
  case 'save':
    cmdSave();
    break;
  case 'refresh':
    cmdRefresh();
    break;
  case 'status':
    cmdStatus();
    break;
  case 'view':
    cmdView();
    break;
  case 'help':
  case '--help':
  case '-h':
  case undefined:
    printHelp();
    break;
  default:
    console.error(`❌ Unknown command "${command}". Run: node brain-cli.js help`);
    process.exit(1);
}
