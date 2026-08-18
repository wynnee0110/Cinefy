/**
 * memory.js — ProjectBrain Memory System
 *
 * The persistence layer. Handles reading, writing, and formatting
 * of memory stored as markdown files inside /project-brain.
 */

const fs = require('fs');
const path = require('path');

const BRAIN_DIR = path.join(__dirname, 'project-brain');
const BRAIN_FILE = path.join(__dirname, 'BRAIN.md');

const MEMORY_TYPES = ['tasks', 'lessons', 'decisions', 'architecture'];

// ─── Ensure all brain directories exist ──────────────────────────────────────

function ensureBrainDirs() {
  for (const type of MEMORY_TYPES) {
    const dir = path.join(BRAIN_DIR, type);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }
}

// ─── Read Memory ─────────────────────────────────────────────────────────────

/**
 * Loads all markdown files from every project-brain subdirectory.
 * Returns an object keyed by memory type, each containing an array of
 * { filename, content } entries sorted newest-first.
 */
function readMemory() {
  ensureBrainDirs();

  const memory = {};

  for (const type of MEMORY_TYPES) {
    const dir = path.join(BRAIN_DIR, type);
    const files = fs.readdirSync(dir)
      .filter(f => f.endsWith('.md'))
      .sort()
      .reverse(); // newest first

    memory[type] = files.map(filename => ({
      filename,
      content: fs.readFileSync(path.join(dir, filename), 'utf-8'),
    }));
  }

  return memory;
}

// ─── Format Memory ───────────────────────────────────────────────────────────

/**
 * Converts the raw memory object into a clean prompt-ready string.
 */
function formatMemory(memory) {
  const sections = [];

  for (const type of MEMORY_TYPES) {
    const entries = memory[type];
    if (!entries || entries.length === 0) continue;

    const heading = type.charAt(0).toUpperCase() + type.slice(1);
    const body = entries
      .slice(0, 15) // keep the 15 most recent
      .map(e => `### ${e.filename}\n${e.content}`)
      .join('\n\n');

    sections.push(`## ${heading}\n\n${body}`);
  }

  if (sections.length === 0) {
    return '*(No previous memory found — this is a fresh project brain.)*';
  }

  return sections.join('\n\n---\n\n');
}

// ─── Write Memory ────────────────────────────────────────────────────────────

/**
 * Persists a memory entry as a dated markdown file.
 *
 * @param {'tasks'|'lessons'|'decisions'|'architecture'} type
 * @param {string} content   — the memory text
 * @param {string} relatedTask — the original task context
 */
function writeMemory(type, content, relatedTask = '') {
  ensureBrainDirs();

  if (!MEMORY_TYPES.includes(type)) {
    console.error(`[memory] Unknown type "${type}" — skipping.`);
    return null;
  }

  if (!content || content.trim() === '' || content.trim().toLowerCase() === 'none') {
    return null;
  }

  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const timeStr = now.toISOString().split('T')[1].replace(/:/g, '-').replace('.', '-'); // includes ms

  const filename = `${dateStr}_${timeStr}.md`;
  const filepath = path.join(BRAIN_DIR, type, filename);

  const fileContent = [
    `# ${type.charAt(0).toUpperCase() + type.slice(1)} Entry`,
    '',
    `**Date:** ${now.toISOString()}`,
    `**Related Task:** ${relatedTask || 'N/A'}`,
    '',
    '---',
    '',
    content,
    '',
  ].join('\n');

  fs.writeFileSync(filepath, fileContent, 'utf-8');
  return filepath;
}

// ─── Refresh BRAIN.md ────────────────────────────────────────────────────────

/**
 * Rebuilds the root BRAIN.md file from all memory entries.
 * This is the file that agents (Antigravity, Copilot, Cursor, etc.) read.
 */
function refreshBrain() {
  const memory = readMemory();
  const totalEntries = Object.values(memory).reduce((sum, arr) => sum + arr.length, 0);

  const content = [
    '# 🧠 ProjectBrain — Persistent Memory',
    '',
    '> **Auto-generated context file.** Any AI agent in this project should read this',
    '> for prior context. After completing a task, save new memories using:',
    '> ```',
    '> node brain-cli.js save task "what was done"',
    '> node brain-cli.js save lesson "what was learned"',
    '> node brain-cli.js save decision "what was decided"',
    '> ```',
    '',
    `**Last updated:** ${new Date().toISOString()}`,
    `**Total memories:** ${totalEntries}`,
    '',
    '---',
    '',
    formatMemory(memory),
    '',
  ].join('\n');

  fs.writeFileSync(BRAIN_FILE, content, 'utf-8');
  return { totalEntries, path: BRAIN_FILE };
}

module.exports = { readMemory, writeMemory, formatMemory, ensureBrainDirs, refreshBrain, MEMORY_TYPES };
