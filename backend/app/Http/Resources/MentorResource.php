<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MentorResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'role' => $this->role,
            'profile' => $this->whenLoaded('mentorProfile', function () {
                return [
                    'phone' => $this->mentorProfile->phone,
                    'division_id' => $this->mentorProfile->division_id,
                    'division' => $this->mentorProfile->relationLoaded('division') && $this->mentorProfile->division 
                        ? [
                            'id' => $this->mentorProfile->division->id,
                            'name' => $this->mentorProfile->division->name,
                        ] 
                        : null,
                ];
            }),
            'created_at' => $this->created_at,
        ];
    }
}
