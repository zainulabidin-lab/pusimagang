<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TaskTemplate;
use App\Models\TaskTemplateItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SopController extends Controller
{
    public function index()
    {
        $templates = TaskTemplate::with('items')->get();
        return response()->json(['data' => $templates]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'items' => 'nullable|array',
            'items.*.description' => 'required|string',
            'items.*.order' => 'required|integer',
        ]);

        $template = DB::transaction(function () use ($validated) {
            $t = TaskTemplate::create([
                'name' => $validated['name'],
                'description' => $validated['description'] ?? null,
            ]);

            if (!empty($validated['items'])) {
                foreach ($validated['items'] as $item) {
                    TaskTemplateItem::create([
                        'task_template_id' => $t->id,
                        'description' => $item['description'],
                        'order' => $item['order']
                    ]);
                }
            }

            return $t->load('items');
        });

        return response()->json(['data' => $template], 201);
    }

    public function update(Request $request, $id)
    {
        $template = TaskTemplate::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'items' => 'nullable|array',
            'items.*.id' => 'nullable|integer|exists:task_template_items,id',
            'items.*.description' => 'required|string',
            'items.*.order' => 'required|integer',
        ]);

        DB::transaction(function () use ($template, $validated) {
            $template->update([
                'name' => $validated['name'],
                'description' => $validated['description'] ?? null,
            ]);

            if (isset($validated['items'])) {
                $existingIds = collect($validated['items'])->pluck('id')->filter()->toArray();
                TaskTemplateItem::where('task_template_id', $template->id)
                    ->whereNotIn('id', $existingIds)
                    ->delete();

                foreach ($validated['items'] as $item) {
                    if (!empty($item['id'])) {
                        TaskTemplateItem::where('id', $item['id'])->update([
                            'description' => $item['description'],
                            'order' => $item['order']
                        ]);
                    } else {
                        TaskTemplateItem::create([
                            'task_template_id' => $template->id,
                            'description' => $item['description'],
                            'order' => $item['order']
                        ]);
                    }
                }
            } else {
                TaskTemplateItem::where('task_template_id', $template->id)->delete();
            }
        });

        return response()->json(['data' => $template->load('items')]);
    }

    public function destroy($id)
    {
        $template = TaskTemplate::findOrFail($id);
        $template->delete();

        return response()->json(['message' => 'Template deleted successfully']);
    }
}
