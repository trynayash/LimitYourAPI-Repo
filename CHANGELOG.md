# Changelog

All notable changes to the LimitYourAPI project will be documented in this file.

---

## [2.0.1] - 2026-06-18

### 🚀 Improvements
- **Production SDK Stability:** Enhanced socket connection pool performance, optimized keep-alive connections, and added auto-retry mechanisms for improved network resiliency.
- **Improved TypeScript Support:** Added complete static type definitions and explicit interface contracts (`LimitOptions`, `CheckParams`, `CheckResult`) to resolve structural overlap.
- **Better Error Handling:** Implemented robust local circuit breakers to enforce graceful fail-open defaults, preventing local caching outages from failing client requests.
- **Enhanced Documentation:** Restructured JavaScript and TypeScript integrations into separated, quickstart-focused and advanced reference guides, complete with before/after middleware examples.
- **Updated Examples:** Added production-ready Express, FastAPI, and Go Fiber configuration templates.

---

## [1.2.0] - 2026-04-13
- Node.js SDK initial feature implementation.
- Added Express middleware route throttling wrappers.
- Integrated fallback support for local client-side memory locks.
