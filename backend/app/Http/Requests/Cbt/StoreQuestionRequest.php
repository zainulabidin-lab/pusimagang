<?php

declare(strict_types=1);

namespace App\Http\Requests\Cbt;

use Illuminate\Foundation\Http\FormRequest;

class StoreQuestionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'category_id' => 'required|exists:question_categories,id',
            'question_text' => 'required|string',
            'explanation' => 'nullable|string',
            'options' => 'required|array|min:4',
            'options.*.text' => 'required|string',
            'options.*.is_correct' => 'required|boolean',
        ];
    }
}
