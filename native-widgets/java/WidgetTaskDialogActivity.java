package com.amalnekoglow.app;

import android.app.Activity;
import android.app.AlertDialog;
import android.appwidget.AppWidgetManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.DialogInterface;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Spinner;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.UUID;

public class WidgetTaskDialogActivity extends Activity {

    private boolean isEditMode = false;
    private int editTaskId = -1;
    private JSONObject existingTaskObj = null;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        int taskId = getIntent().getIntExtra("task_id", -1);
        if (taskId != -1) {
            isEditMode = true;
            editTaskId = taskId;
            loadTaskData(taskId);
        }

        showTaskDialog();
    }

    private void loadTaskData(int taskId) {
        SharedPreferences prefs = getSharedPreferences("NekoWidgetData", Context.MODE_PRIVATE);
        String json = prefs.getString("tasks_json", "[]");
        try {
            JSONArray arr = new JSONArray(json);
            for (int i = 0; i < arr.length(); i++) {
                JSONObject obj = arr.getJSONObject(i);
                if (obj.optInt("id", -1) == taskId) {
                    existingTaskObj = obj;
                    break;
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void showTaskDialog() {
        AlertDialog.Builder builder = new AlertDialog.Builder(this, android.R.style.Theme_DeviceDefault_Dialog_Alert);
        builder.setTitle(isEditMode ? "Edit Task" : "Add New Task");

        View view = LayoutInflater.from(this).inflate(R.layout.activity_widget_task_dialog, null);
        builder.setView(view);

        final EditText titleInput = view.findViewById(R.id.dialog_task_title);
        final Spinner categorySpinner = view.findViewById(R.id.dialog_task_category);
        final Spinner prioritySpinner = view.findViewById(R.id.dialog_task_priority);

        // Setup Spinners
        String[] categories = {"study", "project", "assignment", "home"};
        ArrayAdapter<String> catAdapter = new ArrayAdapter<>(this, android.R.layout.simple_spinner_dropdown_item, categories);
        categorySpinner.setAdapter(catAdapter);

        String[] priorities = {"low", "medium", "high"};
        ArrayAdapter<String> prioAdapter = new ArrayAdapter<>(this, android.R.layout.simple_spinner_dropdown_item, priorities);
        prioritySpinner.setAdapter(prioAdapter);

        // Pre-fill data
        if (isEditMode && existingTaskObj != null) {
            titleInput.setText(existingTaskObj.optString("text", ""));
            String cat = existingTaskObj.optString("category", "study");
            for (int i=0; i<categories.length; i++) if (categories[i].equals(cat)) categorySpinner.setSelection(i);
            
            String prio = existingTaskObj.optString("priority", "medium");
            for (int i=0; i<priorities.length; i++) if (priorities[i].equals(prio)) prioritySpinner.setSelection(i);
        }

        builder.setPositiveButton("Save", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                String title = titleInput.getText().toString().trim();
                if (title.isEmpty()) {
                    Toast.makeText(WidgetTaskDialogActivity.this, "Title cannot be empty", Toast.LENGTH_SHORT).show();
                    finish();
                    return;
                }
                String category = categorySpinner.getSelectedItem().toString();
                String priority = prioritySpinner.getSelectedItem().toString();
                saveTask(title, category, priority);
                dialog.dismiss();
                finish();
            }
        });

        builder.setNegativeButton("Cancel", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                dialog.cancel();
            }
        });

        builder.setOnCancelListener(new DialogInterface.OnCancelListener() {
            @Override
            public void onCancel(DialogInterface dialog) {
                finish();
            }
        });

        builder.show();
    }

    private void saveTask(String title, String category, String priority) {
        SharedPreferences prefs = getSharedPreferences("NekoWidgetData", Context.MODE_PRIVATE);
        String json = prefs.getString("tasks_json", "[]");
        try {
            JSONArray arr = new JSONArray(json);
            
            if (isEditMode && existingTaskObj != null) {
                // Update existing
                for (int i = 0; i < arr.length(); i++) {
                    JSONObject obj = arr.getJSONObject(i);
                    if (obj.optInt("id", -1) == editTaskId) {
                        obj.put("text", title);
                        obj.put("category", category);
                        obj.put("priority", priority);
                        break;
                    }
                }
            } else {
                // Create new
                JSONObject newTask = new JSONObject();
                newTask.put("id", (int)(System.currentTimeMillis() / 1000));
                newTask.put("text", title);
                newTask.put("category", category);
                newTask.put("priority", priority);
                newTask.put("completed", false);
                newTask.put("dueDate", ""); // Date picker omitted for simplicity in quick-add
                newTask.put("subtasks", new JSONArray());
                
                // Prepend
                JSONArray newArr = new JSONArray();
                newArr.put(newTask);
                for(int i=0; i<arr.length(); i++) newArr.put(arr.getJSONObject(i));
                arr = newArr;
            }

            prefs.edit().putString("tasks_json", arr.toString()).apply();
            
            // Sync flag for app.js
            prefs.edit().putBoolean("widget_tasks_dirty", true).apply();
            
            refreshWidgets();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void refreshWidgets() {
        AppWidgetManager manager = AppWidgetManager.getInstance(this);
        int[] ids3x2 = manager.getAppWidgetIds(new ComponentName(this, NekoWidget3x2Provider.class));
        manager.notifyAppWidgetViewDataChanged(ids3x2, R.id.widget_task_list);
        int[] ids3x3 = manager.getAppWidgetIds(new ComponentName(this, NekoWidget3x3Provider.class));
        manager.notifyAppWidgetViewDataChanged(ids3x3, R.id.widget_task_list);
        int[] ids2x3 = manager.getAppWidgetIds(new ComponentName(this, NekoWidget2x3Provider.class));
        manager.notifyAppWidgetViewDataChanged(ids2x3, R.id.widget_task_list);
    }
}
