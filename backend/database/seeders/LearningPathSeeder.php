<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Competency;
use App\Models\LearningPath;
use App\Models\LearningPathItem;

class LearningPathSeeder extends Seeder
{
    public function run(): void
    {
        $c1 = Competency::where('name', 'Backend')->first();
        if ($c1) {
            $lp1 = LearningPath::firstOrCreate(['competency_id' => $c1->id, 'title' => 'Fundamental Laravel & API']);
            LearningPathItem::firstOrCreate(['learning_path_id' => $lp1->id, 'title' => 'Routing & Controllers di Laravel', 'item_type' => 'video', 'url' => 'https://youtube.com', 'order' => 1]);
            LearningPathItem::firstOrCreate(['learning_path_id' => $lp1->id, 'title' => 'Eloquent ORM & Migrations', 'item_type' => 'article', 'url' => 'https://laravel.com/docs', 'order' => 2]);
        }

        $c2 = Competency::where('name', 'Frontend')->first();
        if ($c2) {
            $lp2 = LearningPath::firstOrCreate(['competency_id' => $c2->id, 'title' => 'React & Modern UI']);
            LearningPathItem::firstOrCreate(['learning_path_id' => $lp2->id, 'title' => 'React Hooks Deep Dive', 'item_type' => 'video', 'url' => 'https://youtube.com', 'order' => 1]);
        }
    }
}
