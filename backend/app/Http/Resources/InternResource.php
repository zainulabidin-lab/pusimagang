<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InternResource extends JsonResource
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
            'is_approved' => (bool)$this->is_approved,
            'profile' => $this->whenLoaded('internProfile', function () {
                return [
                    'school_name' => $this->internProfile->school_name,
                    'major_name' => $this->internProfile->major_name,
                    'mentor_id' => $this->internProfile->mentor_id,
                    'division_id' => $this->internProfile->division_id,
                    'points' => $this->internProfile->points,
                    'badge' => $this->internProfile->badge,
                    'status' => $this->internProfile->status,
                ];
            }),
            'created_at' => $this->created_at,
        ];
    }
}
