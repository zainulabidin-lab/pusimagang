<?php

declare(strict_types=1);

namespace App\Http\Requests\Cbt;

use Illuminate\Foundation\Http\FormRequest;

class SubmitAttemptRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'answers' => 'required|array',
            'answers.*.question_bank_id' => 'required|exists:question_banks,id',
            'answers.*.question_option_id' => 'required|exists:question_options,id',
        ];
    }
}
