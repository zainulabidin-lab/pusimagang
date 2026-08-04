<?php

declare(strict_types=1);

namespace App\Exceptions;

use Exception;
use Illuminate\Http\JsonResponse;

class BusinessException extends Exception
{
    /**
     * @var int
     */
    protected $code;

    /**
     * @var mixed
     */
    protected $errors;

    /**
     * BusinessException constructor.
     *
     * @param string $message
     * @param int $code
     * @param mixed|null $errors
     */
    public function __construct(string $message = 'Business logic error', int $code = 400, mixed $errors = null)
    {
        parent::__construct($message, $code);
        $this->code = $code;
        $this->errors = $errors;
    }

    /**
     * Render the exception into an HTTP response.
     *
     * @return JsonResponse
     */
    public function render(): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $this->getMessage(),
            'data'    => null,
            'errors'  => $this->errors,
        ], $this->code);
    }
}
