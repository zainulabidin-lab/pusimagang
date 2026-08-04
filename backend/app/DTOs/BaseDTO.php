<?php

declare(strict_types=1);

namespace App\DTOs;

abstract class BaseDTO
{
    /**
     * Convert DTO to array
     *
     * @return array
     */
    public function toArray(): array
    {
        return get_object_vars($this);
    }
}
