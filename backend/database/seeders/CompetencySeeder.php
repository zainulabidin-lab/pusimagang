<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use App\Models\QuestionCategory;
use App\Models\Competency;
use App\Models\QuestionBank;
use App\Models\QuestionOption;

class CompetencySeeder extends Seeder
{
    public function run()
    {
        $filePath = 'C:/Users/ABIDIN_PUSIM/Documents/intern-exam-pro/bank_soal_intern.json';
        if (!File::exists($filePath)) {
            $this->command->warn("File bank_soal_intern.json tidak ditemukan di $filePath");
            return;
        }

        $json = File::get($filePath);
        $questions = json_decode($json, true);

        if (!$questions) {
            $this->command->error("Gagal membaca JSON.");
            return;
        }

        $this->command->info("Memproses " . count($questions) . " soal dari bank_soal_intern.json...");

        foreach ($questions as $q) {
            // 1. Create or Get Category
            $category = QuestionCategory::firstOrCreate(['name' => ucfirst($q['category'])]);

            // 2. Create or Get Competency based on question_type
            $competencyName = isset($q['question_type']) ? ucfirst($q['question_type']) : 'General';
            $competency = Competency::firstOrCreate([
                'name' => $competencyName
            ], [
                'description' => "Modul kompetensi untuk $competencyName"
            ]);

            // 3. Convert level logic if exists. In JSON we have 'difficulty' (easy, medium, hard).
            $level = 1;
            if ($q['difficulty'] === 'medium') $level = 2;
            if ($q['difficulty'] === 'hard') $level = 3;

            // 4. Create Question Bank (Prevent Duplicates)
            $questionBank = QuestionBank::firstOrCreate(
                ['question_text' => $q['question']],
                [
                    'question_category_id' => $category->id,
                    'competency_id' => $competency->id,
                    'level' => $level,
                    'difficulty' => $q['difficulty'],
                    'explanation' => $q['explanation'] ?? null,
                ]
            );

            // 5. Create Options only if the question is newly inserted
            if ($questionBank->wasRecentlyCreated) {
                foreach ($q['options'] as $optionText) {
                    QuestionOption::create([
                        'question_bank_id' => $questionBank->id,
                        'option_text' => $optionText,
                        'is_correct' => ($optionText === $q['correct_answer'])
                    ]);
                }
            }
        }

        $this->command->info("Seeder bank soal kompetensi selesai!");
    }
}
