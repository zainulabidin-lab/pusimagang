<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class QuestionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'question_category_id' => $this->question_category_id,
            'question_text' => $this->question_text,
            'options' => $this->whenLoaded('options', function () {
                return $this->options->map(function ($option) {
                    return [
                        'id' => $option->id,
                        'question_bank_id' => $option->question_bank_id,
                        'option_text' => $option->option_text,
                    ];
                });
            }),
        ];
    }
}
