# Travel & Tours Agency Website - Implementation Plan

## 1. Repo Research Conclusion

The current project is a **Capacitor-based mobile app** scaffolding with a vanilla HTML/CSS/JavaScript frontend in the `www/` directory. It currently contains an offline music player app. The project configuration includes:

- **Tech Stack**: Vanilla JavaScript (no framework), HTML5, CSS3, Capacitor for mobile wrapping
- **Build Tooling**: http-server for local dev, no build step/bundler
- **Entry Points**: [www/index.html](file:///home/shan/vs.code/www/index.html), [www/style.css](file:///home/shan/vs.code/www/style.css), [www/app.js](file:///home/shan/vs.code/www/app.js)
- **Color Scheme Requirement**: Skyblue background, golden accents, white text, touches of red (from custom user instruction)

The music app content will be **completely replaced** with the travel agency site. We retain the same file structure and Capacitor configuration for mobile compatibility.

---

## 2. Files and Modules to Be Edited / Created

### Files to Overwrite/Modify
| File | Purpose |
|------|---------|
| [www/index.html](file:///home/shan/vs.code/www/index.html) | Complete rewrite: multi-section SPA layout with nav, hero, services, packages, requirements modal, document upload, payment flow |
| [www/style.css](file:///home/shan/vs.code/www/style.css) | Complete rewrite: skyblue/golden/white/red theme, responsive grid, cards, modals, forms, stepper UI |
| [www/app.js](file:///home/shan/vs.code/www/app.js) | Complete rewrite: navigation/routing state, package data model, requirements engine, document checklist, cart/payment state machine |
| [package.json](file:///home/shan/vs.code/package.json) | Update `name`, `scripts` description, and `cap:init` app name/ID to reflect the travel agency |
| [capacitor.config.json](file:///home/shan/vs.code/capacitor.config.json) | Update app ID and name if needed |

### New Files to Create
| File | Purpose |
|------|---------|
| `www/data/packages.js` | Data module: all visa/work/study/PR/tour packages with countries, pricing, required documents |
| `www/data/requirements.js` | Document requirement templates per visa type (common + per-country variants) |

---

## 3. Steps for Modifications / New Features

### Step 1: Foundation — Data Model & Constants
Create `www/data/packages.js` exporting structured data:
- **Visa Countries**: UAE, Kazakhstan, India, Oman, Saudi, Qatar, Bahrain, Georgia (+ more placeholder)
- **Work Visa Countries**: Czech Republic, Germany, Latvia, Serbia, Montenegro, Slovakia, Poland, Portugal, Estonia (+ more)
- **Service Categories**: Jobs, Work Visa, Schengen Visa, Study Visa, Canada PR, East Africa Local Tours
- Each package has: `id`, `category`, `country`, `priceProcessing`, `priceTicket`, `estimatedDays`, `requirements[]` (document IDs)
- East Africa local tour packages: safari destinations (Kenya, Tanzania, Uganda, Rwanda), itinerary days, inclusions

Create `www/data/requirements.js` exporting a document requirement library:
- Documents: passport, photos, bank statement, invitation letter, employment contract, CV, diploma, police clearance, medical, travel insurance, flight itinerary, hotel booking, sponsorship letter, proof of funds, etc.
- Each with description, format hints (PDF/JPG, max size)

### Step 2: HTML Structure — www/index.html
Build a **single-page multi-view** application (no page reloads):
1. **Navbar** — Logo, nav links (Home, Services, Visa Packages, Work Visas, East Africa Tours, Contact), CTA "Book Now"
2. **Hero Section** — Headline, subheadline, featured badges, CTA buttons
3. **Services Grid Section** — 6 service cards (Jobs, Work Visas, Schengen, Study Visa, Canada PR, East Africa) each with icon, title, desc, "Explore" button
4. **Visa Packages Section** — Filter tabs (Travel Visa / Work Visa / Study Visa), country cards with flag, price, "View Details"
5. **East Africa Local Tours Section** — Tour cards with destination image, itinerary, price, "Select Package"
6. **Why Choose Us / Testimonials** — Trust signals
7. **Contact / Footer** — Agency details, socials, form

**Dynamic Views (hidden by default, rendered by JS)**:
8. **Package Details View** — Shows selected package info, PRICING breakdown, and **REQUIREMENTS checklist** (toggles when package chosen per user requirement)
9. **Document Submission Stepper** — Step 1: Personal Info Form → Step 2: Document Upload checklist per requirement with file inputs and preview → Step 3: Review & Auth confirmation → Step 4: Payment (visa processing fee + ticket)
10. **Payment View** — Styled payment form (card details), order summary, "Pay Now" button
11. **Success View** — Booking reference, next steps message

### Step 3: Styling — www/style.css
Adhere strictly to the required **skyblue/golden/white/red** palette:
- **Backgrounds**: Primary `#87CEEB` (skyblue), gradient variations for hero, card backgrounds in lighter `#E0F4FF`
- **Accent / Primary Action**: `#FFD700` (golden) — buttons, badges, highlights, card borders
- **Text**: `#FFFFFF` (white) on skyblue sections; `#1E3A5F` (dark blue-gray) on light card sections
- **Alert / Danger**: `#E53E3E` (red) — required field markers, error text, delete actions
- **Typography**: Clean sans (Inter/system), golden gradient for hero headline
- **Components**:
  - Glassmorphism cards (white/20 opacity on skyblue) with golden 2px borders
  - Rounded corners (16-24px), soft shadows (golden glow on hover)
  - Stepper component with golden active steps, gray inactive
  - Document checklist items: checkmark icon, file upload drop zones
  - Responsive: mobile-first, grid adapts 1→2→3 columns
  - Modal overlay for quick views

### Step 4: Application Logic — www/app.js
Build a **state machine** managing the user flow:

#### State Object
```
{
  currentView: 'home' | 'packageDetail' | 'submitDocs' | 'payment' | 'success',
  selectedPackage: Package | null,
  step: 1-4 (document submission stepper),
  personalInfo: { name, email, phone, passport },
  uploadedDocs: { [requirementId]: { fileName, dataUrl, uploaded:boolean } },
  cart: { processingFee, ticketFee, total }
}
```

#### Core Functions
1. `initApp()` — Load data, render home, attach nav listeners
2. `renderHome()` / `renderServices()` / `renderVisaPackages(filter)` / `renderEastAfricaTours()` — populate sections from data modules
3. `selectPackage(packageId)` — **Critical**: Sets selected package → transitions to package detail view → calls `renderRequirements(package.requirements)` to show the package-specific requirements list (fulfills: "Once the user chooses a package the requirements for that specific package should show up")
4. `renderRequirements(reqIds)` — Renders each required document as checklist row with title, description, upload button, preview
5. `proceedToDocumentSubmission()` — Verifies package selected → initializes stepper
6. `handleFileUpload(requirementId, file)` — Validates type/size, converts to DataURL (demo), marks requirement complete, updates progress
7. `validateAllDocsSubmitted()` — Checks every requirement has uploaded doc, shows errors in red
8. `proceedToPayment()` — Calculates total (processing + ticket), renders order summary + payment form
9. `submitPayment(formData)` — Mock payment processing (setTimeout + success), transitions to success view, generates booking ref
10. `navigate(view)` — View transition helper with fade animation
11. Stepper validation between steps (can't go forward if current step incomplete)

#### Data Loading
- Add `<script src="data/packages.js">` and `<script src="data/requirements.js">` in index.html **before** app.js
- Expose data via global `window.PACKAGES_DATA` and `window.REQUIREMENTS_DATA` (simple approach for no-bundler setup)

### Step 5: Update Project Metadata
- [package.json](file:///home/shan/vs.code/package.json): `name` → `"travel-tours-agency"`, cap:init values
- Update HTML `<title>` to "Global Travel & Tours Agency"
- (Optional) Update `capacitor.config.json` app name if mobile build intended

---

## 4. Potential Dependencies or Considerations

- **No new npm dependencies** needed: pure vanilla JS with native File API for uploads
- **Image sourcing**: Country flags and tour visuals use `https://coresg-normal.trae.ai/api/ide/v1/text_to_image` API per guidelines (prompt=flag of [country], image_size=square_hd)
- **Storage**: localStorage for persisting in-progress bookings (optional nice-to-have)
- **Payment**: Mock implementation (no real Stripe/PayPal SDK) per no-new-deps constraint; form is UI-only demo
- **File handling**: Frontend-only (Blob/DataURL) — no real backend upload; simulate auth approval with setTimeout after all docs uploaded
- **Mobile responsive**: Tested at 360px, 768px, 1024px breakpoints
- **Capacitor compatibility**: File inputs work natively; no plugins needed for web demo

---

## 5. Risk Handling

| Risk | Mitigation |
|------|------------|
| Large generated file sizes (HTML/CSS/JS exceeding 500 lines) | **Split data into separate files** (`packages.js`, `requirements.js`) as planned. If app.js grows beyond 500 lines, further split into `views.js`, `state.js`, `handlers.js` |
| Stepper state getting out of sync | Centralize all state in single `appState` object; every state mutation goes through `setState()` helper that re-renders affected parts |
| Image API placeholders failing | Use emoji flags (🇦🇪 🇩🇪 🇰🇪 etc.) as **fallback** if image URLs don't load — always have inline alt fallback |
| User trying to pay without uploading all docs | Payment button disabled until `validateAllDocsSubmitted()` passes; missing docs highlighted in red border + error list |
| Mobile layout breakage | Mobile-first CSS; test breakpoint: navbar collapses to hamburger menu for <768px (drawer implemented in JS) |
| Color scheme not matching spec | Create CSS custom properties (`--skyblue`, `--golden`, `--white`, `--red`) at `:root` and use **only** variables throughout; no hardcoded colors |

---

## 6. User Flow Summary (End-to-End)

1. User lands on Home → sees Hero + Services cards
2. User clicks "Visa Packages" → browses countries (UAE, Germany, etc.)
3. User clicks "View Details" on UAE Travel Visa → **Requirements for UAE visa automatically appear** (passport, photos, bank statement, hotel booking, flight itinerary...)
4. User clicks "Start Application" → Stepper begins
5. **Step 1** Personal Info → fill name/email/phone/passport → Next
6. **Step 2** Document Upload → each requirement has drop zone; user uploads PDF/JPG → each shows ✅ golden checkmark when done → Next (disabled until all ✅)
7. **Step 3** Review → summary of package, docs, personal info → "All requirements met" badge (golden) → "Continue to Payment"
8. **Step 4** Payment → Order summary: Visa Processing $199 + Ticket $650 = $849 → Card form → "Pay $849" (golden button)
9. Loading spinner (golden) → 1.5s → **Success View**: "Booking #TT-78291 confirmed! We will contact you shortly for authentication follow-up."
