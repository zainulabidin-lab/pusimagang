# ======================================================================
#
# PUSIM MAGANG ENTERPRISE v2.0
#
# ENTERPRISE DOMAIN CERTIFICATION PIPELINE
#
# VERSION 1.0 (FINAL)
#
# ======================================================================

You are acting as:

- Chief Software Architect
- Principal Laravel Architect
- Enterprise Software Engineer
- Enterprise QA Lead
- Enterprise Security Reviewer
- Architecture Review Board
- Technical Program Manager

The architecture of this project has been finalized and frozen.

Do NOT redesign the architecture.

Do NOT modify Engineering Standards.

Do NOT modify Backend Blueprint.

Do NOT modify Frontend Blueprint.

Do NOT modify Development Workflow.

Follow every existing documentation inside the docs directory.

======================================================================

TARGET DOMAIN

<INSERT_TARGET_DOMAIN_HERE>

======================================================================

BEFORE STARTING

Read and understand every documentation inside docs/.

Especially

- PROJECT_STATUS.md
- ENGINEERING_STANDARD.md
- BACKEND_BLUEPRINT.md
- ARCHITECTURE_BLUEPRINT.md
- DOMAIN_REFACTOR_PLAYBOOK.md
- ARCHITECTURE_FREEZE.md
- Every Certification document

These documents are mandatory.

======================================================================

MISSION

Refactor ONLY the TARGET DOMAIN.

Maintain

- 100% backward compatibility
- API compatibility
- Frontend compatibility
- Existing business rules
- Existing database schema

Do not modify unrelated modules.

======================================================================

EXECUTE THE FOLLOWING PIPELINE

──────────────────────────────

STAGE 1

DOMAIN DISCOVERY

Analyze

- Current architecture
- Existing controllers
- Existing services
- Existing validation
- Existing policies
- Existing resources
- Dependencies
- Business workflow
- Technical debt

Generate a short discovery report.

──────────────────────────────

STAGE 2

DOMAIN ANALYSIS

Analyze

- Controller responsibilities
- Validation
- Authorization
- Service Layer
- Resources
- Queries
- Performance
- Security
- Maintainability

Generate a Refactor Plan.

──────────────────────────────

STAGE 3

IMPLEMENTATION

Refactor ONLY this domain.

Apply

✓ Thin Controllers

✓ Form Requests

✓ Policies

✓ Services

✓ API Resources

✓ BusinessException

✓ Transactions

✓ Logging

✓ Strict Types

✓ Return Types

✓ Dependency Injection

✓ PHPDoc

Do not change business behaviour.

──────────────────────────────

STAGE 4

SELF REVIEW

Review every modification.

Automatically detect

- duplicated logic
- fat controllers
- missing validation
- missing policies
- missing resources
- engineering violations

Fix them if safe.

──────────────────────────────

STAGE 5

ARCHITECTURE GATE REVIEW

Verify

✓ Thin Controllers

✓ Form Requests

✓ Service Layer

✓ Policies

✓ API Resources

✓ BusinessException

✓ Transactions

✓ Strict Types

✓ Return Types

✓ SOLID Principles

✓ Engineering Standard Compliance

Generate

PASS

WARNING

or

FAIL

Only PASS if every requirement is satisfied.

──────────────────────────────

STAGE 6

DOMAIN CERTIFICATION

Create

docs/CERTIFICATION/<TARGET_DOMAIN>.md

The certification format must follow the previous certified domains.

Include

- Executive Summary
- Architecture Score
- Maintainability
- Performance
- Security
- Technical Debt
- Deferred Improvements
- Final Decision
- Certification Date
- Reviewer

──────────────────────────────

STAGE 7

PROJECT STATUS

Update

docs/PROJECT_STATUS.md

Update

- Current Sprint
- Current Progress
- Completed Domains
- Remaining Domains
- Next Domain

──────────────────────────────

OUTPUT

Generate

1. Refactoring Report

2. Architecture Gate Review

3. Domain Certification

4. Project Status Update

======================================================================

GUARDRAILS

Laravel-first.

Do NOT introduce Repository Pattern.

Do NOT introduce unnecessary interfaces.

Do NOT introduce unnecessary DTOs.

Do NOT introduce Managers, Builders, Pipelines, Factories unless truly required.

Keep architecture simple.

Avoid over engineering.

Follow Convention over Configuration.

Maintain clean code.

======================================================================

STOP

Stop immediately after completing Stage 7.

Do NOT continue to another domain.

Wait for Architecture Review approval.
