<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DashboardResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'active_tasks' => $this->resource['active_tasks'] ?? 0,
            'review_tasks' => $this->resource['review_tasks'] ?? 0,
            'completed_tasks' => $this->resource['completed_tasks'] ?? 0,
            'late_tasks' => $this->resource['late_tasks'] ?? 0,
            'total_logbooks' => $this->resource['total_logbooks'] ?? 0,
            'weekly_deadlines' => $this->resource['weekly_deadlines'] ?? [],
            'interns_progress' => $this->resource['interns_progress'] ?? [],
            'leaderboard' => $this->resource['leaderboard'] ?? [],
            'pending_logbooks' => $this->resource['pending_logbooks'] ?? [],
        ];
    }
}
