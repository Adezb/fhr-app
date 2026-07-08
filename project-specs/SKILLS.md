# AGENT OPERATIONAL SKILLS

This document outlines the mandatory operational skills the IDE agent must use to manage architecture, UI consistency, debugging, session memory, and code review.

## 1. The `/architect` Skill
Think through what you are about to build like a senior engineer before writing any code[cite: 1]. Surfaces decisions, aligns on language, and produces a clear implementation plan you confirm before anything starts[cite: 1].
*   **Step 1 - Understand:** Read the feature description and any context files to build a clear picture before asking questions[cite: 1].
*   **Step 2 - Align on Language:** Identify 3-5 terms from the feature description that could be interpreted multiple ways, define them, and present them for confirmation[cite: 1].
*   **Step 3 - Think Through Decisions:** Surface only decisions that meaningfully change implementation[cite: 1]. Share your approach and ask for the developer's input one decision at a time[cite: 1].
*   **Step 4 - Produce Plan:** Once all critical decisions are resolved, say "Blueprint ready" and write a clear Implementation Plan outlining what to build, agreed language, decisions made, assumptions, and implementation steps[cite: 1]. Wait for explicit confirmation before coding[cite: 1].

## 2. The `/imprint` Skill
After building any UI component, extract the visual patterns that matter for consistency and save them to `ui-registry.md`[cite: 2].
*   **Usage:** Run `/imprint` to capture recent components, `/imprint [filepath]` for a specific file, or `/imprint audit` to scan the codebase for inconsistencies[cite: 2].
*   **Extraction:** Capture the background, borders, radius, text colors/sizes, spacing, interactive states, and shadows[cite: 2]. Do not extract context-dependent structural properties like width, height, flex, grid, or absolute positioning[cite: 2].
*   **Writing:** Append or update the entry in `ui-registry.md` with the file path, date, and mapped classes[cite: 2].
*   **Confirmation:** Output a summary of the captured patterns to the developer so future components match these rules[cite: 2].

## 3. The `/recover` Skill
When something goes wrong during a build, diagnose what type of failure it is before deciding how to respond[cite: 3]. 
*   **Diagnosis:** Ask the developer to specify what was expected, what happened instead, and how many fixes have been attempted[cite: 3].
*   **Mode 1 (Targeted Fix):** For an isolated bug, find the root cause, suggest a precise fix, and explain why it resolves the issue[cite: 3].
*   **Mode 2 (Hard Reset):** If the session is polluted from multiple failed fix attempts, acknowledge the situation, write a Reset Note capturing what went wrong and what to keep, and instruct the developer to start a fresh session[cite: 3].
*   **Mode 3 (Rethink):** If the foundational approach is wrong, name the incorrect assumption, propose the correct approach, and wait for confirmation before rebuilding[cite: 3].

## 4. The `/remember` Skill
Save what matters at the end of a session so the next session picks up exactly where you left off[cite: 4]. Restore context at the start of a new session so nothing is lost[cite: 4].
*   **Security Boundary:** Never persist sensitive secrets (API keys, passwords, tokens, auth headers) in the memory file; use redacted placeholders instead[cite: 4].
*   **Save Mode (`/remember save`):** Capture exactly what was built, decisions made, problems solved, current state, next steps, and open questions[cite: 4]. Write this to `memory.md` in the project root[cite: 4]. If the file exists, ask for confirmation before overwriting[cite: 4].
*   **Restore Mode (`/remember restore`):** Read `memory.md` and specific context files (like `.cursorrules` or `CLAUDE.md`)[cite: 4]. Summarize what was restored and ask the developer to confirm before continuing[cite: 4].

## 5. The `/review` Skill
After building a feature, verify it matches what was planned, respects the system architecture and design standards, and is ready for production[cite: 5]. Reports issues clearly so the developer decides what to fix[cite: 5].
*   **Benchmark:** Read the implementation plan, feature description, and context files to understand what should have been built[cite: 5].
*   **Layer 1 (Plan Alignment):** Compare what was built against the planned scope and flag missing or unrequested additions[cite: 5].
*   **Layer 2 (System Integrity):** Check for architecture boundary violations, design system drift (e.g., hardcoded values), and code standard adherence[cite: 5].
*   **Layer 3 (Production Readiness):** Verify error handling, edge cases, and check for obvious bugs or console errors[cite: 5].
*   **Report:** Provide a review report detailing PASS/ISSUES FOUND for each layer[cite: 5]. Label issues by severity (Critical, Important, Minor) and wait for the developer to decide on fixes[cite: 5].