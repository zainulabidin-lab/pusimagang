<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Services\TaskService;
use App\Http\Requests\Task\StoreTaskRequest;
use App\Http\Requests\Task\UpdateTaskStatusRequest;
use App\Http\Resources\TaskResource;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Exceptions\BusinessException;

class TaskController extends Controller
{
    /**
     * @var TaskService
     */
    protected TaskService $taskService;

    /**
     * TaskController constructor.
     *
     * @param TaskService $taskService
     */
    public function __construct(TaskService $taskService)
    {
        $this->taskService = $taskService;
    }

    /**
     * Display a listing of tasks.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $tasks = $this->taskService->getAllTasks($request->user());
        return $this->sendSuccess(TaskResource::collection($tasks));
    }

    /**
     * Store a newly created task in storage.
     *
     * @param StoreTaskRequest $request
     * @return JsonResponse
     */
    public function store(StoreTaskRequest $request): JsonResponse
    {
        try {
            $task = $this->taskService->storeTask($request->user(), $request->validated());
            return $this->sendSuccess(new TaskResource($task), 'Task created successfully', 201);
        } catch (BusinessException $e) {
            return $e->render();
        }
    }

    /**
     * Update the specified task.
     *
     * @param StoreTaskRequest $request
     * @param int|string $id
     * @return JsonResponse
     */
    public function update(StoreTaskRequest $request, $id): JsonResponse
    {
        $task = Task::findOrFail($id);
        
        $this->authorize('update', $task);

        try {
            $task = $this->taskService->updateTask($task, $request->user(), $request->validated());
            return $this->sendSuccess(new TaskResource($task), 'Task updated successfully');
        } catch (BusinessException $e) {
            return $e->render();
        }
    }

    /**
     * Update the specified task status.
     *
     * @param UpdateTaskStatusRequest $request
     * @param int|string $id
     * @return JsonResponse
     */
    public function updateStatus(UpdateTaskStatusRequest $request, $id): JsonResponse
    {
        $task = Task::findOrFail($id);
        
        $this->authorize('update', $task);

        $this->taskService->updateTaskStatus($task, $request->validated('status'), $request->user());

        return $this->sendSuccess(null, 'Status updated');
    }
}
