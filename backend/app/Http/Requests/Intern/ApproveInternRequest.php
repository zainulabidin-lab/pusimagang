<?php

declare(strict_types=1);

namespace App\Http\Requests\Intern;

use Illuminate\Foundation\Http\FormRequest;

class ApproveInternRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Handled by Policy
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'mentor_id' => 'required|exists:users,id',
            'division_id' => 'required|exists:divisions,id',
        ];
    }
}
