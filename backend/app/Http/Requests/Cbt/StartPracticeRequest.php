<?php

declare(strict_types=1);

namespace App\Http\Requests\Cbt;

use Illuminate\Foundation\Http\FormRequest;

class StartPracticeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'category_id' => 'required|exists:question_categories,id'
        ];
    }
}
