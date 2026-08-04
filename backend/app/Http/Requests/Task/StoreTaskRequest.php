<?php

declare(strict_types=1);

namespace App\Http\Requests\Task;

use Illuminate\Foundation\Http\FormRequest;

class StoreTaskRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // We use policies for granular auth, or it's implicitly allowed for logged in users to create tasks (mentor/admin).
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'priority' => 'required|in:low,medium,high',
            'deadline' => 'nullable|date',
            'intern_ids' => 'required|array|min:1',
            'intern_ids.*' => 'exists:users,id',
            'template_id' => 'nullable|exists:task_templates,id',
            'competency_id' => 'nullable|exists:competencies,id',
            'difficulty' => 'nullable|in:easy,medium,hard',
        ];
    }
}
