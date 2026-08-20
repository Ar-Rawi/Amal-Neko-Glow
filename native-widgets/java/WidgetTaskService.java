package com.amalnekoglow.app;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Paint;
import android.widget.RemoteViews;
import android.widget.RemoteViewsService;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

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

            // Set checkbox icon based on completion
            if (task.completed) {
                views.setImageViewResource(R.id.task_check_icon, R.drawable.ic_check);
                views.setInt(R.id.task_text, "setPaintFlags", Paint.STRIKE_THRU_TEXT_FLAG | Paint.ANTI_ALIAS_FLAG);
                views.setTextColor(R.id.task_text, 0xFF6b7280); // dimmed gray
            } else {
                views.setImageViewResource(R.id.task_check_icon, R.drawable.ic_uncheck);
                views.setInt(R.id.task_text, "setPaintFlags", Paint.ANTI_ALIAS_FLAG);
                views.setTextColor(R.id.task_text, 0xFFd1c4e9); // light purple
            }

            // Fill-in intents for click handling
            // Toggle complete on checkbox tap
            Intent toggleIntent = new Intent();
            toggleIntent.putExtra("task_id", task.id);
            toggleIntent.putExtra("action", "TOGGLE");
            views.setOnClickFillInIntent(R.id.task_check_icon, toggleIntent);

            // Edit on edit button tap
            Intent editIntent = new Intent();
            editIntent.putExtra("task_id", task.id);
            editIntent.putExtra("action", "EDIT");
            views.setOnClickFillInIntent(R.id.task_edit_btn, editIntent);

            // Delete on delete button tap
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
            try {
                JSONArray arr = new JSONArray(json);
                for (int i = 0; i < arr.length(); i++) {
                    JSONObject obj = arr.getJSONObject(i);
                    TaskItem item = new TaskItem();
                    item.id = obj.optInt("id", i);
                    item.text = obj.optString("text", "");
                    item.completed = obj.optBoolean("completed", false);
                    item.priority = obj.optString("priority", "medium");
                    item.category = obj.optString("category", "");
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
    }
}
