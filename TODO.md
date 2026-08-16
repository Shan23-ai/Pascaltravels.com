# Pascal Travels & Tour — Feature Implementation TODO

## Status Legend
- [ ] Not started
- [x] Completed

## Tasks

### 1. CSS Additions (`www/style.css`)
- [x] Append Jobs board styles (`.jobs-view`, `.jobs-header`, `.jobs-toolbar`, `.jobs-search`, `.jobs-filter`, `.jobs-grid`, `.job-card`, `.jobs-empty`, `.apply-form`, `.apply-success`)
- [x] Append general modal styles (`.modal-overlay`, `.modal-card`, `.modal-close`)
- [x] Append Agent registration + dashboard styles (`.agent-register-view`, `.agent-register-layout`, `.agent-benefits`, `.agent-form`, `.checkbox-grid`, `.agent-success`, `.agent-login-box`, `.agent-dash-header`, `.agent-status-badge`, `.agent-stats .stat-card`, `.agent-dash-grid`, `.agent-submit-card`, `.agent-candidates-card`, `.agent-commissions-card`)
- [x] Append WhatsApp AI modal styles (`.wa-modal-overlay`, `.wa-modal-card`, `.wa-modal-header`, `.wa-chat`, `.wa-msg`, `.wa-quick-options`, `.wa-quick`, `.wa-input-form`)
- [x] Append premium WhatsApp floating widget styles (`.wa-widget-wrap`, `.wa-widget-text`, `.wa-widget-btn`, `.wa-widget-icon`, `.wa-widget-pulse`)
- [x] Verify CSS brace balance (685 open : 685 close)

### 2. JavaScript Additions (`www/app.js`)
- [x] Add Jobs rendering, filter/search, quick-apply logic
- [x] Add Agent registration, login, dashboard, candidate submission, commissions logic
- [x] Add WhatsApp AI chat modal + premium widget logic
- [x] Wire new views into `setView()` / `attachGlobalHandlers()` / `init()`
- [x] Fix `waQuote` HTML-escaping bug
- [x] Verify JS syntax with `node --check` (passes)

### 3. Backend (`www/server/`)
- [x] Jobs API routes (`routes/jobs.js`) — list, filter, create, update, delete, quick-apply
- [x] Agents API routes (`routes/agents.js`) — register, login, candidates, commissions, admin status
- [x] Store methods for jobs, agents, candidates, commissions (memory + postgres)
- [x] Mount jobs & agents routes in `server.js`

### 4. Data (`www/data/jobs.js`)
- [x] Sample jobs data (Canada, UK, Australia, UAE, Germany, Qatar, Saudi, Estonia)

### 5. Verification
- [x] Server boots on port 3000
- [x] Health check OK
- [x] Agent registration API tested (creates PENDING agent)
- [x] Agent login correctly blocks PENDING accounts
- [x] JS syntax passes `node --check`
- [x] CSS brace balance verified (685/685)
