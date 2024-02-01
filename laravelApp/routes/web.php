<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\LoginRegisterController;
use App\Http\Controllers\Tasks\TasksOperationsController;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('home');
})->name('home');



Route::get('/register', [LoginRegisterController::class, 'register'])->name('register');
Route::post('/store', [LoginRegisterController::class, 'store'])->name('store');
Route::get('/login', [LoginRegisterController::class, 'login'])->name('login');
Route::post('/authenticate', [LoginRegisterController::class, 'authenticate'])->name('authenticate');

Route::middleware(['auth'])->group(function () {
    Route::get('/tasks', [TasksOperationsController::class, 'getAllTasks'])->name('tasks');
    Route::post('/tasks/add', [TasksOperationsController::class, 'store'])->name('addtask');
    Route::post('/tasks/delete', [TasksOperationsController::class, 'delete'])->name('delete');
    Route::post('/tasks/update', [TasksOperationsController::class, 'update'])->name('update');
    Route::get('/dashboard', [LoginRegisterController::class, 'dashboard'])->name('dashboard');
    Route::post('/logout', [LoginRegisterController::class, 'logout'])->name('logout');
});