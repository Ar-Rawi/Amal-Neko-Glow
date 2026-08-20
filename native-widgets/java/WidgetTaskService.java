package com.amalnekoglow.app;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.graphics.Paint;
import android.widget.RemoteViews;
import android.widget.RemoteViewsService;

import org.json.JSONArray;
import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;

public class WidgetTaskService extends RemoteViewsService {

    @Override
    public RemoteViewsFactory onGetViewFactory(Intent intent) {
        return new TaskRemoteViewsFactory(this.getApplicationContext());
    }

    static class TaskRemoteViewsFactory implements RemoteViewsFactory {

        private Context context;
        private List<TaskItem> tasks = new ArrayList<>();

        TaskRemoteViewsFactory(Context context) {
            this.context = context;
        }

        @Override
        public void onCreate() {
            loadTasks();
        }

        @Override
        public void onDataSetChanged() {
            loadTasks();
        }

        @Override
        public void onDestroy() {
            tasks.clear();
        }

        @Override
        public int getCount() {
            return tasks.size();
        }

        @Override
        public RemoteViews getViewAt(int position) {
            if (position < 0 || position >= tasks.size()) {
                return null;
            }

            TaskItem task = tasks.get(position);
            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_task_item);

            // Set task text
            views.setTextViewText(R.id.task_text, task.text);

            // Check if overdue
            boolean isOverdue = false;
            try {
                if (task.dueDate != null && !task.dueDate.isEmpty()) {
                    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd", Locale.US);
                    Date due = sdf.parse(task.dueDate);
                    Date now = new Date();
                    
                    // Zero out time for 'now' for accurate day comparison
                    String nowStr = sdf.format(now);
                    Date today = sdf.parse(nowStr);
                    
                    if (due.before(today)) {
                        isOverdue = true;
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
            }

            // Colorize text
            if (isOverdue) {
                views.setTextColor(R.id.task_text, Color.parseColor("#fecaca")); // super-light red
            } else {
                views.setTextColor(R.id.task_text, Color.parseColor("#a7f3d0")); // super-light green (active)
            }

            // Set priority orb color
            int orbColor = Color.parseColor("#3b82f6"); // Default Low: blue
            if ("high".equals(task.priority)) {
                orbColor = Color.parseColor("#ef4444"); // High: red
            } else if ("medium".equals(task.priority)) {
                orbColor = Color.parseColor("#f97316"); // Medium: orange
            }
            views.setInt(R.id.task_priority_orb, "setColorFilter", orbColor);

            // Fill-in intent for tapping the task row (Edit)
            Intent editIntent = new Intent();
            editIntent.putExtra("task_id", task.id);
            editIntent.putExtra("action", "EDIT");
            views.setOnClickFillInIntent(R.id.task_text, editIntent);

            // Delete button tap
            Intent deleteIntent = new Intent();
            deleteIntent.putExtra("task_id", task.id);
            deleteIntent.putExtra("action", "DELETE");
            views.setOnClickFillInIntent(R.id.task_delete_btn, deleteIntent);

            return views;
        }

        @Override
        public RemoteViews getLoadingView() {
            return null;
        }

        @Override
        public int getViewTypeCount() {
            return 1;
        }

        @Override
        public long getItemId(int position) {
            if (position < 0 || position >= tasks.size()) return position;
            return tasks.get(position).id;
        }

        @Override
        public boolean hasStableIds() {
            return true;
        }

        private void loadTasks() {
            tasks.clear();
            SharedPreferences prefs = context.getSharedPreferences("NekoWidgetData", Context.MODE_PRIVATE);
            String json = prefs.getString("tasks_json", "[]");
            String filterCat = prefs.getString("widget_filter_category", "all");

            try {
                JSONArray arr = new JSONArray(json);
                for (int i = 0; i < arr.length(); i++) {
                    JSONObject obj = arr.getJSONObject(i);
                    boolean completed = obj.optBoolean("completed", false);
                    
                    // Skip completed tasks per user request
                    if (completed) continue;

                    String category = obj.optString("category", "");
                    
                    // Apply category filter
                    if (!"all".equals(filterCat) && !filterCat.equals(category)) {
                        continue;
                    }

                    TaskItem item = new TaskItem();
                    item.id = obj.optInt("id", i);
                    item.text = obj.optString("text", "");
                    item.completed = completed;
                    item.priority = obj.optString("priority", "medium");
                    item.category = category;
                    item.dueDate = obj.optString("dueDate", "");
                    tasks.add(item);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    static class TaskItem {
        int id;
        String text;
        boolean completed;
        String priority;
        String category;
        String dueDate;
    }
}
