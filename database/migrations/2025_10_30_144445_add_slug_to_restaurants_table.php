<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('restaurants', function (Blueprint $table) {
            $table->string('slug')->after('name')->nullable();
            $table->text('description')->nullable()->after('slug');
        });

        // Mettre à jour les enregistrements existants avec des slugs
        \App\Models\Restaurant::all()->each(function ($restaurant) {
            $restaurant->slug = \Illuminate\Support\Str::slug($restaurant->name);
            $restaurant->save();
        });

        // Ajouter la contrainte d'unicité après la mise à jour
        Schema::table('restaurants', function (Blueprint $table) {
            $table->unique('slug');
            $table->string('slug')->nullable(false)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('restaurants', function (Blueprint $table) {
            $table->dropUnique(['slug']);
            $table->dropColumn('slug');
            $table->dropColumn('description');
        });
    }
};
