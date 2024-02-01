<?php

namespace App\Http\Controllers\Tasks;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session; // Import the Session facade
class TasksOperationsController extends Controller
{
    public function tasks(){
        return view('tasks');
    }


    public function store(Request $request){
        $task = $request->input('task');
        $date = $request->input('date');

        $newTask = new Task();
        $newTask->task_name = $task;
        $newTask->due_date = $date;
        $newTask->save();
        // Process the task and date values here (e.g., save to database, perform actions, etc.)
        // $request->Session::flash('status', 'Task added successfully');

        $taskId = $newTask->id;


        return response()->json(['message' => 'Task and date received successfully',"task_id" => $taskId], 200);
    }

    public function delete(Request $request)
    {
        // Retrieve the task ID from the request
        $taskID = $request->input('taskID');

        // Find the task by ID
        $task = Task::find($taskID);

        if (!$task) {
            return response()->json(['error' => 'Task not found'], 404);
        }

        // Delete the task
        $task->delete();
        return response()->json(['message' => 'Task deleted successfully'], 200);
    }


    public function getAllTasks()
    {
        $tasks = Task::all();
        return view('tasks', ['tasks' => $tasks]);
    }
}
