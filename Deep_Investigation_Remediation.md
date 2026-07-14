You are taking over the 'Fundamental Rights Enforcement App' project to fix critical bugs in the Admin CMS.

Context:
We are experiencing database insertion failures and frontend UI/Editor bugs. You have access to the Supabase MCP server. Do not write any fix code or execute any SQL yet.

Task 1: Deep Investigation
Please use your MCP tools and codebase access to investigate the following four issues:

1. Authority RLS Error (permission denied for table authorities):

  - Query the Supabase database to inspect the current Row Level Security (RLS) policies on the authorities table.

  - Hypothesis: The policies likely still contain placeholder emails instead of our actual admin emails (cektopventures@gmail.com and cektopv@gmail.com).

2. Chapter Schema Error (Could not find the 'is_published' column of 'chapters'):

  - Query the Supabase schema for the chapters table.

  - Hypothesis: The 'Save Draft' logic in the frontend is trying to pass an is_published boolean, but this column does not exist in the chapters table.

3. TipTap Editor Error (Duplicate extension names found: ['link', 'underline']):

  - Inspect src/components/admin/RichTextEditor.tsx.

  - Hypothesis: The extensions array inside the useEditor hook has duplicate imports or duplicate declarations for the Link and Underline extensions.

4. Invisible Sidebar Logo (Light Mode):

  - Inspect src/components/admin/AdminShell.tsx.

  - Hypothesis: The 'FHR CMS Portal' logo text/SVG is missing a strict text-white or fill-white class, causing it to inherit dark text in light mode against a navy background.

Task 2: Investigation & Remediation Report
Output a detailed Markdown report with your findings for all four issues.
Below your findings, provide a Phased Remediation Plan detailing the exact SQL statements you will run via MCP to fix the database, and the exact code changes you will make to the frontend.

Wait for my explicit approval of this report before executing any fixes.