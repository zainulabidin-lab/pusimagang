<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\TaskChecklist;
use App\Services\TaskService;
use App\Http\Requests\Task\StoreTaskChecklistRequest;
use App\Http\Resources\TaskChecklistResource;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TaskChecklistController extends Controller
{
    /**
     * @var TaskService
     */
    protected TaskService $taskService;

    /**
     * TaskChecklistController constructor.
     *
     * @param TaskService $taskService
     */
    public function __construct(TaskService $taskService)
    {
        $this->taskService = $taskService;
    }

    /**
     * Store a newly created checklist item.
     *
     * @param StoreTaskChecklistRequest $request
     * @param int|string $taskId
     * @return JsonResponse
     */
    public function store(StoreTaskChecklistRequest $request, $taskId): JsonResponse
    {
        $task = Task::findOrFail($taskId);
        
        $this->authorize('update', $task);

        $checklist = $this->taskService->storeChecklist($task, $request->validated('description'));

        return $this->sendSuccess(new TaskChecklistResource($checklist), 'Checklist added', 201);
    }

    /**
     * Toggle the specified checklist completion status.
     *
     * @param Request $request
     * @param int|string $taskId
     * @param int|string $id
     * @return JsonResponse
     */
    public function toggle(Request $request, $taskId, $id): JsonResponse
    {
        $task = Task::findOrFail($taskId);
        
        $this->authorize('update', $task);

        $checklist = TaskChecklist::where('task_id', $taskId)->findOrFail($id);
        
        $updatedChecklist = $this->taskService->toggleChecklist($checklist, $request->user());

        return $this->sendSuccess(new TaskChecklistResource($updatedChecklist));
    }
}
