<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReportResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'intern' => [
                'id' => $this->resource['intern']['id'],
                'name' => $this->resource['intern']['name'],
                'email' => $this->resource['intern']['email'],
                'school_name' => $this->resource['intern']['intern_profile']['school_name'] ?? null,
                'major_name' => $this->resource['intern']['intern_profile']['major_name'] ?? null,
            ],
            'mentor' => $this->resource['mentor'] ? [
                'id' => $this->resource['mentor']['id'],
                'name' => $this->resource['mentor']['name'],
                'division' => $this->resource['mentor']['mentor_profile']['division']['name'] ?? null,
            ] : null,
            'evaluation' => $this->resource['evaluation'] ? [
                'id' => $this->resource['evaluation']['id'],
                'technical_score' => $this->resource['evaluation']['technical_score'],
                'non_technical_score' => $this->resource['evaluation']['non_technical_score'],
                'average_score' => $this->resource['evaluation']['average_score'],
                'status' => $this->resource['evaluation']['status'],
                'mentor_notes' => $this->resource['evaluation']['mentor_notes'],
                'evaluated_at' => $this->resource['evaluation']['created_at'],
            ] : null,
            'logbooks' => $this->resource['logbooks'] ?? [],
            'tasks_summary' => $this->resource['tasks_summary'] ?? [
                'total' => 0,
                'done' => 0,
            ],
            'generated_at' => now()->toIso8601String(),
        ];
    }
}
