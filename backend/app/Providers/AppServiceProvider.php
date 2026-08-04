<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Gate;
use App\Policies\ReportPolicy;
use App\Policies\LogbookPolicy;
use App\Models\DailyLogbook;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::define('view-report', [ReportPolicy::class, 'view']);
        Gate::policy(DailyLogbook::class, LogbookPolicy::class);
    }
}
