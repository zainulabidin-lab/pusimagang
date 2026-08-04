<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\TaskController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [\App\Http\Controllers\Api\RegisterController::class, 'register']);

// Master data required for public registration
Route::get('/master/schools', [\App\Http\Controllers\Api\MasterDataController::class, 'schools']);
Route::get('/master/majors', [\App\Http\Controllers\Api\MasterDataController::class, 'majors']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Dashboard & Activity
    Route::get('/dashboard', [\App\Http\Controllers\Api\DashboardController::class, 'index']);
    Route::get('/activity-feed', [\App\Http\Controllers\Api\ActivityFeedController::class, 'index']);
    Route::get('/knowledge-base', [\App\Http\Controllers\Api\KnowledgeBaseController::class, 'index']);

    // Admin Approval
    Route::get('/admin/pending-interns', [\App\Http\Controllers\Api\AdminApprovalController::class, 'pendingInterns']);
    Route::patch('/admin/approve-intern/{id}', [\App\Http\Controllers\Api\AdminApprovalController::class, 'approveIntern']);
    Route::delete('/admin/reject-intern/{id}', [\App\Http\Controllers\Api\AdminApprovalController::class, 'rejectIntern']);

    // Tasks & Checklists
    Route::get('/tasks', [\App\Http\Controllers\Api\TaskController::class, 'index']);
    Route::post('/tasks', [\App\Http\Controllers\Api\TaskController::class, 'store']);
    Route::patch('/tasks/{id}/status', [\App\Http\Controllers\Api\TaskController::class, 'updateStatus']);
    
    Route::post('/tasks/{taskId}/checklists', [\App\Http\Controllers\Api\TaskChecklistController::class, 'store']);
    Route::patch('/tasks/{taskId}/checklists/{checklistId}/toggle', [\App\Http\Controllers\Api\TaskChecklistController::class, 'toggle']);

    // Logbook
    Route::get('/logbook', [\App\Http\Controllers\Api\LogbookController::class, 'index']);
    Route::post('/logbook', [\App\Http\Controllers\Api\LogbookController::class, 'store']);
    Route::patch('/logbook/{id}/approve', [\App\Http\Controllers\Api\LogbookController::class, 'approve']);

    // Evaluations
    Route::get('/evaluations', [\App\Http\Controllers\Api\EvaluationController::class, 'index']);
    Route::post('/evaluations', [\App\Http\Controllers\Api\EvaluationController::class, 'store']);

    // Notifications
    Route::get('/notifications', [\App\Http\Controllers\Api\NotificationController::class, 'index']);
    Route::patch('/notifications/{id}/read', [\App\Http\Controllers\Api\NotificationController::class, 'markAsRead']);
    Route::post('/notifications/read-all', [\App\Http\Controllers\Api\NotificationController::class, 'markAllAsRead']);

    // Master Data
    Route::get('/master/divisions', [\App\Http\Controllers\Api\MasterDataController::class, 'divisions']);
    Route::get('/master/templates', [\App\Http\Controllers\Api\MasterDataController::class, 'templates']);
    Route::get('/master/interns', [\App\Http\Controllers\Api\MasterDataController::class, 'interns']);
    Route::get('/master/competencies', [\App\Http\Controllers\Api\MasterDataController::class, 'competencies']);

    // Competency & Assessments
    Route::prefix('competency')->group(function () {
        Route::get('/overview', [\App\Http\Controllers\Api\CompetencyController::class, 'getOverview']);
        Route::get('/skill-matrix', [\App\Http\Controllers\Api\CompetencyController::class, 'getSkillMatrix']);
        Route::get('/learning-paths', [\App\Http\Controllers\Api\CompetencyController::class, 'getLearningPaths']);
        Route::get('/pre-test/start', [\App\Http\Controllers\Api\CompetencyController::class, 'startPreTest']);
        Route::post('/pre-test/{attemptId}/submit', [\App\Http\Controllers\Api\CompetencyController::class, 'submitPreTest']);
        
        Route::get('/practice/categories', [\App\Http\Controllers\Api\CompetencyController::class, 'practiceCategories']);
        Route::post('/practice/start', [\App\Http\Controllers\Api\CompetencyController::class, 'startPractice']);
        Route::post('/practice/{attemptId}/submit', [\App\Http\Controllers\Api\CompetencyController::class, 'submitPractice']);
        Route::post('/practice/questions', [\App\Http\Controllers\Api\CompetencyController::class, 'storeQuestion']);
    });

    // SOP Management
    Route::apiResource('sop', \App\Http\Controllers\Api\SopController::class);
});
