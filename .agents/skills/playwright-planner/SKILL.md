---
name: playwright-planner
description: Explores the NSU SIMS portal via read-only browser automation and produces structured, numbered Markdown test plans in specs/<feature>.md.
---

# Playwright Test Planner for NSU SIMS

## Purpose
The `playwright-planner` skill guides the agent in exploring and mapping user journeys, forms, and features of the **North South University (NSU) SIMS Portal**. It produces structured, numbered Markdown test plans without generating code, ensuring full requirement coverage before automation starts.

---

## Operational Workflow

### 1. Portal Discovery (Read-Only)
- Inspect the targeted portal area (e.g., student profile, course evaluation, degree audit, advising).
- Note accessible roles, labels, form controls, dynamic tables, and navigational pathways.
- Identify stateful prerequisites (e.g., advising clearance, active semester status).

### 2. Markdown Specification Output
Generate specifications under `specs/<feature>.md` using this standard schema:

```markdown
# Test Spec: [Feature Name]

## 1. Overview & Objective
Brief description of the user journey or business rule under test.

## 2. Preconditions & Test Data
- Authentication role required (Student / Faculty / Admin)
- Initial state / semester requirements
- Test data entities needed

## 3. Test Cases

### TC-001: [Positive / Smoke Scenario Name]
- **Type:** Smoke / Functional / Regression
- **Tags:** `@smoke`, `@feature`
- **Steps:**
  1. Navigate to target portal section.
  2. Verify initial UI state and headers.
  3. Perform primary interaction.
- **Expected Outcome:**
  - Confirmation alert or resulting page is displayed.
  - Data attributes match expected state.

### TC-002: [Edge / Validation Scenario Name]
...
```

### 3. Standards & Constraints
- **Strictly Read-Only:** Do not submit damaging actions or irreversible operations during discovery.
- Keep test scenarios atomic, isolated, and numbered with unique tags (`@smoke`, `@regression`, etc.).
- Store all output documents in the `specs/` directory.

