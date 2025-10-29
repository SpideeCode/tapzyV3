<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\RestaurantController;
use App\Http\Controllers\Admin\RestaurantController as AdminRestaurantController;

// Page d'accueil publique
Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

// Routes protégées par authentification
Route::middleware(['auth', 'verified'])->group(function () {
    // Tableau de bord
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Routes pour la gestion des restaurants (version standard)
    Route::resource('restaurants', RestaurantController::class);

    // Routes d'administration des restaurants
    Route::prefix('admin')->name('admin.')->group(function () {
        Route::resource('restaurants', AdminRestaurantController::class);
    });
});

require __DIR__.'/settings.php';
