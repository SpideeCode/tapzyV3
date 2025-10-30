<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\RestaurantController;
use App\Http\Controllers\Admin\RestaurantController as AdminRestaurantController;
use App\Http\Controllers\Admin\TableController as AdminTableController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Admin\ItemController as AdminItemController;

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

    // Routes d'administration
    Route::prefix('admin')->name('admin.')->group(function () {
        // Tableau de bord
        Route::get('/dashboard', function () {
            return Inertia::render('Admin/Dashboard');
        })->name('dashboard');

        // Gestion des restaurants
        Route::resource('restaurants', AdminRestaurantController::class);
        Route::resource('tables', AdminTableController::class);
        Route::resource('users', AdminUserController::class)->except(['show']);
        Route::resource('items', AdminItemController::class)->except(['show']);
    });
});

require __DIR__.'/settings.php';
