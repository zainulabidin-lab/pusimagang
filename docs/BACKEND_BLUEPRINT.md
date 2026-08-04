# 🏗️ PUSIM Magang Enterprise v2.0 - Backend Architecture Blueprint

## 1. Architecture Assessment
**Current State:**
- **Controllers:** Too fat. They contain direct validation (`$request->validate()`), business logic, and database queries.
- **Models:** Good relationship mapping, but some lack rigorous PHPDoc types.
- **Services:** Existing (`AuthService`, `TaskService`) but lack consistent interfaces and dependency injection standardization.
- **Repositories:** `BaseRepository` exists but isn't strictly enforced across all modules.
- **Exceptions & Responses:** Direct JSON responses (`response()->json(...)`) scattered across controllers without a unified API Response formatting trait.

**Goal:** Establish a strictly typed, layered architecture that strictly follows SOLID principles.

---

## 2. Recommended Folder Structure
```
app/
├── Actions/          # Single-action business operations (invokable classes)
├── DTOs/             # Data Transfer Objects for passing complex data between layers
├── Exceptions/       # Custom Exception classes
├── Helpers/          # Global helper functions (if absolutely necessary)
├── Http/
│   ├── Controllers/  # Exclusively handles HTTP request/response routing
│   ├── Middleware/   # HTTP filters and guards
│   ├── Requests/     # FormRequest validation classes
│   └── Resources/    # JSON API Resources (Presentation layer)
├── Models/           # Eloquent Models (Data layer)
├── Policies/         # Authorization rules
├── Repositories/     # Data access abstraction
├── Services/         # Complex business logic orchestrators
└── Traits/           # Reusable behaviors (e.g., ApiResponseTrait)
```

---

## 3. Service Layer Standard
**Rule:** Controllers MUST NOT contain business logic. They must delegate to Services or Actions.
**Convention:**
- Create an interface for each Service (e.g., `TaskServiceInterface`).
- Inject dependencies via the constructor.
- Return DTOs, Arrays, or Models, NEVER HTTP Responses (`Response`, `JsonResponse`).

```php
namespace App\Services;

interface BaseServiceInterface
{
    // Blueprint for basic operations if needed
}
```

---

## 4. Form Request Standard
**Rule:** Validation MUST NOT happen inside the Controller using `$request->validate()`.
**Convention:**
- Use `php artisan make:request ModulName/CreateModulRequest`.
- Centralize authorization logic within the `authorize()` method if tied directly to the payload, otherwise defer to Policies.
- Keep validation rules strictly inside the `rules()` method.

---

## 5. API Resource Standard
**Rule:** Controllers MUST NOT return raw Arrays or Eloquent Collections directly to `response()->json()`.
**Convention:**
- Use Laravel API Resources (`JsonResource` and `ResourceCollection`).
- Date formatting, null-coalescing, and relationship hiding must occur here.

---

## 6. Exception Handling Standard
**Rule:** Avoid repetitive `try/catch` in controllers. 
**Convention:**
- Let exceptions bubble up to the `bootstrap/app.php` (Laravel 11) exception handler.
- Create custom exceptions (e.g., `BusinessLogicException`) that auto-render to standard JSON API responses.

---

## 7. API Response Trait (Standardization)
**Rule:** All JSON responses must follow the same wrapper format.
**Convention:** 
Implement a trait `App\Traits\ApiResponseTrait` used by the Base Controller.
```json
{
    "success": true,
    "message": "Operation successful.",
    "data": { ... },
    "errors": null
}
```

---

## 8. Logging Standard
**Rule:** Do not scatter `Log::info()` indiscriminately.
**Convention:**
- **Info:** Milestone actions (e.g., "User registered", "Logbook approved").
- **Warning:** Suspicious activities (e.g., "Failed login attempt from IP").
- **Error:** Caught exceptions that don't crash the app but degrade functionality.
- **Critical:** Uncaught crashes, Database connectivity failures.

---

## 9. Dependency Injection & Coding Convention
- **Constructor Injection:** Always inject Services into Controllers. Never use `app(Service::class)`.
- **Strict Typing:** `declare(strict_types=1);` is heavily encouraged.
- **Return Types:** Every method MUST have a return type hint (e.g., `public function getTask(): TaskResource`).

---

## 10. Migration Plan (For Future Sprints)
1. **Sprint 1.2:** Refactor `Auth` & `Register` controllers to use FormRequests and `AuthService` exclusively.
2. **Sprint 1.3:** Refactor `Task` & `TaskChecklist` modules. Introduce `TaskDTO` and API Resources.
3. **Sprint 1.4:** Refactor `Logbook` & `Evaluation` modules.

*(Note: Business logic will remain identical during these refactors; only the architectural location of the code changes).*
