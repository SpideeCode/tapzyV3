<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\RestaurantController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\Admin\RestaurantController as AdminRestaurantController;
use App\Http\Controllers\Admin\TableController as AdminTableController;
use App\Http\Controllers\Admin\ItemController as AdminItemController;
use App\Http\Controllers\Admin\UserController as AdminUserController;

// Page d'accueil publique
Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

// Vue publique d'un restaurant
Route::get('/restaurants/{restaurant:slug}', [RestaurantController::class, 'show'])
    ->name('restaurants.show');

// Page de paiement du restaurant
Route::get('/restaurants/{restaurant:slug}/payment', [RestaurantController::class, 'payment'])
    ->name('restaurants.payment');

// Endpoint public pour créer une commande (invité) via numéro de table
Route::post('/public/orders', [OrderController::class, 'storeGuest'])
    ->name('public.orders.store');

// Confirmation publique d'une commande
Route::get('/orders/{order}/confirmation', [OrderController::class, 'showPublic'])
    ->name('orders.confirmation');

// Routes publiques pour le staff (temporairement sans auth)
Route::get('/staff/orders', [\App\Http\Controllers\StaffController::class, 'orders'])
    ->name('staff.orders');
Route::patch('/staff/orders/{order}/status', [\App\Http\Controllers\StaffController::class, 'updateOrderStatus'])
    ->name('staff.orders.update-status');

// Routes Staff Dashboard
Route::prefix('staff')->name('staff.')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Staff/Dashboard');
    })->name('dashboard');

    // Utilisation des contrôleurs Staff dédiés
    Route::resource('tables', \App\Http\Controllers\Staff\TableController::class);
    Route::post('tables/{table}/regenerate-qr', [\App\Http\Controllers\Staff\TableController::class, 'regenerateQrCode'])->name('tables.regenerate-qr');
    Route::resource('items', \App\Http\Controllers\Staff\ItemController::class)->except(['show']);
});

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
        Route::post('tables/{table}/regenerate-qr', [AdminTableController::class, 'regenerateQrCode'])->name('admin.tables.regenerate-qr');
        Route::get('tables/check-availability', [AdminTableController::class, 'checkAvailability'])->name('admin.tables.check-availability');
        Route::resource('users', AdminUserController::class)->except(['show']);
        Route::resource('items', AdminItemController::class)->except(['show']);
        Route::resource('orders', \App\Http\Controllers\Admin\OrderController::class)->only(['index','show','update']);
        
        // Statistiques
        Route::get('statistics', [\App\Http\Controllers\Admin\StatisticsController::class, 'index'])->name('admin.statistics');

        // Gestion des catégories
        Route::resource('categories', \App\Http\Controllers\Admin\CategoryController::class)->except(['show']);
    });
});

require __DIR__.'/settings.php';
