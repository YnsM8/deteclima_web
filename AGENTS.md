<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Package Management Rules
- **USE PNPM ONLY**: All dependency management and script execution MUST use `pnpm`. Do not use `npm` or `yarn`.
- **Lockfile**: Ensure `pnpm-lock.yaml` is updated and committed.
- **Strict Dependencies**: Do not use phantom dependencies. If you need a package, add it to `package.json`.
