# DOTSURE AI INTAKE (DAI) - IVR SPECIFICATION ADDENDUM

Version: 1.0
Date: 3 July 2026
Owner: Herman Stoltz, General Manager, Dotsure
Status: Approved for build
Extends: DAI-SESSION-0.md (this addendum does not replace it; both are read together)

---

## 1. PURPOSE

This addendum extends DAI to capture IVR (Interactive Voice Response) specifications alongside the existing AI voice agent specifications. It reuses the DAI architecture - Supabase, Next.js, the design system, RLS discipline, the governed-document output pattern - rather than standing up a new tool.

The core structural change: DAI gains an `intake_type` dimension. Existing voice-agent intake becomes `intake_type = voice_agent`. This addendum adds `intake_type = ivr`. A cell's `intake_type` determines which component schema, which roles and which interview questions apply to it. No existing voice_agent data, tables or logic changes.

---

## 2. SCOPE

One IVR specification for Dotsure: a single 0861 number, with a business-hours flow and an after-hours flow, plus a per-department roster and per-call disposition/outcome capture. This is a single organisation-wide specification, not a per-cell specification like the voice agent intake - there is one IVR, not thirty-six.

Structural implication: IVR does not use the existing `cells` table (Vertical x Discipline) as its primary unit. It introduces its own top-level record: one `ivr_specs` row representing the single IVR build, with the department/roster/disposition data hanging off it. Section 6 defines this.

---

## 3. ROLES (NEW ROLE MODEL, ADDITIVE TO EXISTING)

| Role | Scope | Rights |
|---|---|---|
| ivr_gm | All departments | View, edit (minor additions), approve |
| ivr_senior_manager | All departments | View, edit, build. Cannot approve. |
| ivr_support | Own department only | View only. No edit. No approval. |

These are new profile roles, additive to the existing leader / reviewer_it / reviewer_connex / reviewer_arc / admin roles from DAI-SESSION-0.md section 5. A person may hold an IVR role and a voice-agent role simultaneously (e.g. a leader who is also ivr_senior_manager for their department) - roles are not mutually exclusive.

Department scope for ivr_support is enforced by a `department` field on their profile, matching against the roster entries in section 6. An ivr_support user sees only their own department's roster and disposition data, and the call-flow trees read-only in full (the trees are organisation-wide, not department-scoped, since every department needs to see how calls reach them).

Approval model: only ivr_gm can move an IVR spec from draft to approved. ivr_senior_manager can build and edit but not approve - this mirrors the existing DAI principle of separating build from sign-off. Confirmed: there is no external IT/Connex/ARC reviewer chain for the IVR spec. ivr_gm sign-off (component I5) is the final approval gate.

---

## 4. THE TWO CALL FLOWS (LOCKED, SEED DATA)

These are final and go into the database as seed data, not as leader-editable interview output, though ivr_senior_manager can propose changes through the normal edit rights.

### 4.1 After-hours flow

```
Call comes in (single 0861 number, after hours)
Client selects, in order:
  1. Emergency -> routed to the AA
  2. Not an emergency -> callback offered
     Callback requested -> client selects product, in order:
       1. Motor  2. Pet  3. Warranty  4. Life  5. Commercial  6. Other
       - Motor/Pet/Warranty/Life/Commercial -> client selects discipline, in order:
           1. Sales  2. Service  3. Claims
           -> callback request routed to that product's Sales, Service or Claims team
       - Other -> callback request routed to Motor Service team
```

There is no live-operator option after hours. The AA fulfils that role for emergencies. Everything non-emergency is callback-only.

### 4.2 Business-hours flow

```
Call comes in (business hours)
Client selects, in order:
  1. Emergency -> Gold Club Service
  2. Pet  3. Motor  4. Warranty  5. Life  6. Commercial
     -> selected -> client selects discipline, in order:
        1. Sales  2. Service  3. Claims -> routed to that product's team
        4. Hold for operator (last option at this level) -> Motor Client Care
     (Hold for operator also available at the product-selection level, last option) -> Motor Client Care
  7. Hold for operator (last option at the top level) -> Motor Client Care
```

Design rule applied throughout: "hold for operator" is always the last menu option at any level it appears, so self-service options are presented first and the operator fallback does not dominate the menu. Emergency is the sole exception, positioned first at the top level because safety-critical routing must never be buried behind other options.

"Hold for operator" always resolves to Motor Client Care, regardless of which level it is selected from.

### 4.3 Confirmed platform detail

Confirmed: there is a single 0861 number for all inbound calls, and Connex-AI is the telephony/IVR platform. Business-hours and after-hours flow switching happens on that one number, configured within Connex-AI.

---

## 5. IVR-SPECIFIC COMPONENT SCHEMA (REPLACES C1-C12 FOR intake_type = ivr)

The voice-agent 12-component schema (DAI-SESSION-0.md section 9) does not apply to IVR. IVR uses its own five-part schema:

### I1 - Call Flow Confirmation
Fields: after_hours_flow (locked, section 4.1), business_hours_flow (locked, section 4.2), single_number_confirmed (boolean), number_value (text)
This component is largely pre-populated from this addendum. ivr_gm confirms it is correct or requests a change, which routes back to Herman as the flow owner rather than being freely editable by any role.

### I2 - Department Roster
Fields per department (Motor, Pet, Warranty, Life, Commercial), per discipline (Sales, Service, Claims), captured as repeating rows:
- agent_first_name
- agent_surname
- agent_email
- softsure_username
- call_taking (boolean - whether this agent takes IVR-routed calls)

Plus one department-level field:
- agent_count (integer, should equal the count of call_taking = true rows for that department/discipline; validated, not just declared)

Completeness: every department/discipline combination that appears as a routing destination in section 4 must have at least one roster row before the department can be marked complete. Motor Client Care and Motor Service (the two catch-all destinations) are mandatory regardless of whether Motor itself has been scoped elsewhere.

### I3 - Disposition and Call Outcomes
Fields: disposition_codes[] (per department/discipline), example given in the brief: "Debit Query Resolved"
Structure per code: code_name, department, discipline, description
Completeness: minimum five disposition codes per department/discipline combination that takes calls, covering at minimum: resolved, escalated, callback required, no answer/voicemail, transferred.

### I4 - Reporting Requirements
Fields: reporting_frequency, reporting_recipients[], required_metrics[] (e.g. call volume by department, disposition breakdown, callback SLA adherence)
This mirrors C12 in the voice-agent schema and can reuse its interview pattern.

### I5 - Sign-off
Fields: gm_confirmation (boolean, only settable by ivr_gm), confirmed_by, confirmed_at
This is the approval gate. Setting this to true moves the spec from draft to approved and is restricted to the ivr_gm role at the database level, not just the UI.

---

## 6. DATA MODEL ADDITIONS

### ivr_specs
- id (uuid)
- status (enum: draft, in_progress, approved)
- version (integer)
- created_at, updated_at

One row expected in production use. Versioned the same way agent_specs is, so historical states are never overwritten.

### ivr_department_roster
- id (uuid)
- ivr_spec_id (uuid, references ivr_specs)
- department (enum: motor, pet, warranty, life, commercial)
- discipline (enum: sales, service, claims, client_care)
- agent_first_name (text)
- agent_surname (text)
- agent_email (text)
- softsure_username (text)
- call_taking (boolean, default true)
- created_by (uuid, references profiles)
- created_at, updated_at

Note: client_care is added as a discipline value distinct from sales/service/claims specifically to hold the Motor Client Care catch-all roster from section 4.

### ivr_disposition_codes
- id (uuid)
- ivr_spec_id (uuid, references ivr_specs)
- department (enum, matches roster)
- discipline (enum, matches roster)
- code_name (text)
- description (text)
- created_at

### ivr_reporting
- id (uuid)
- ivr_spec_id (uuid, references ivr_specs)
- reporting_frequency (text)
- reporting_recipients (jsonb: array of profile ids or email addresses)
- required_metrics (jsonb: array of text)
- created_at, updated_at

### profiles (ALTER, additive)
- Add: ivr_role (enum, nullable: ivr_gm, ivr_senior_manager, ivr_support)
- Add: ivr_department (enum, nullable, matches roster department - only meaningful when ivr_role = ivr_support)

### RLS summary
- ivr_gm: full read/write on all four new tables, only role permitted to set ivr_specs.status = approved
- ivr_senior_manager: full read/write on all four new tables except cannot set status = approved
- ivr_support: read-only, and only rows where department = their own ivr_department on ivr_department_roster and ivr_disposition_codes; full read on ivr_specs and the call-flow fields (organisation-wide, not department-scoped, per section 3)
- admin: full access, same as existing DAI admin role

Apply the same discipline as every other DAI table: RLS written and tested at table creation, not after.

---

## 7. UI

Same design system as DAI-SESSION-0.md section 3 (light mode, orange #ff8700 and purple #8400db, matching Leader OS). No new visual language.

New navigation entry point: "IVR Specification" alongside "My cells" in the sidebar, visible only to users with a non-null ivr_role. The five components (I1-I5) follow the same interview-and-review pattern as the voice-agent components, but I2 (roster) is a repeating-row data entry form rather than a conversational interview - a roster is a list of facts, not something worth interviewing someone about.

---

## 8. WORKFLOW

1. Admin assigns ivr_role (and ivr_department where relevant) to the three GMs, five Senior Managers and one or two Support users, using the existing admin Users screen extended to include these fields.
2. ivr_senior_manager users build I1 through I4: confirm the call flows, populate their department's roster, define disposition codes, set reporting requirements. Any of the five Senior Managers can work on any department - this is a shared build, not per-department ownership like the voice-agent cells.
3. ivr_support users view the in-progress spec, read-only, scoped to their own department for roster and disposition data.
4. Any ivr_gm reviews the complete spec (I1-I4) and either requests changes (returns to senior managers) or completes I5, setting status to approved.
5. Approved spec is available for admin to generate a governed output document, using the same deterministic assembly pattern as the voice-agent master specification (no LLM required - this is structured data, not an interview transcript to synthesise).

---

## 9. SESSION PLAN (APPENDS TO DAI-SESSION-0.md SECTION 11)

| Session | Deliverable | Success criteria |
|---|---|---|
| 7 | ivr_specs, ivr_department_roster, ivr_disposition_codes, ivr_reporting tables with RLS; profiles ALTER for ivr_role/ivr_department; admin Users screen extended to assign IVR roles | Admin assigns Herman as ivr_gm and one test user as ivr_senior_manager; RLS proven: senior manager can write, support (read-only) cannot |
| 8 | I1-I5 UI: call flow confirmation screen (pre-populated, read-only trees per section 4), roster repeating-form, disposition code builder, reporting requirements, GM sign-off gate | A senior manager completes I1-I4 for at least two departments; a GM completes I5 and status becomes approved; a support user sees their department only |
| 9 | Governed IVR specification document generation (deterministic, no LLM) + a Connex-AI IVR configuration sheet (call-flow logic, routing destinations, roster) + download | Admin generates and downloads a complete IVR spec document and a Connex config sheet reflecting the approved data |

---

## 10. OPEN ITEMS

1. Connex-AI is the IVR platform (confirmed) - a Connex-specific IVR configuration sheet, mirroring the connex_config output type already scoped for voice agents, should be added to the governed output in Session 9 rather than deferred as an open item. This is now a build requirement, not a question.
2. Dialer capabilities, mentioned by Herman as a future addition, are explicitly out of scope for this addendum and will require its own extension when specified - not built speculatively here.

END OF IVR SPECIFICATION ADDENDUM
