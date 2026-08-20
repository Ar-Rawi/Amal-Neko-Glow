package com.amalnekoglow.app;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.widget.RemoteViews;

import org.json.JSONArray;
import org.json.JSONObject;

public class NekoWidget3x3Provider extends AppWidgetProvider {

    private static final String ACTION_TASK_CLICK = "com.amalnekoglow.app.ACTION_TASK_3x3";
    private static final String ACTION_ADD = "com.amalnekoglow.app.ACTION_ADD_3x3";
    private static final String ACTION_FILTER = "com.amalnekoglow.app.ACTION_FILTER_3x3";

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_3x3_layout);

            Intent serviceIntent = new Intent(context, WidgetTaskService.class);
            serviceIntent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, appWidgetId);
            serviceIntent.setData(Uri.parse(serviceIntent.toUri(Intent.URI_INTENT_SCHEME)));
            views.setRemoteAdapter(R.id.widget_task_list, serviceIntent);
            
            views.setEmptyView(R.id.widget_task_list, R.id.widget_empty_view);
            Intent emptyIntent = new Intent(context, NekoWidget3x3Provider.class);
            emptyIntent.setAction(ACTION_ADD);
            PendingIntent emptyPendingIntent = PendingIntent.getBroadcast(
                context, 0, emptyIntent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
            views.setOnClickPendingIntent(R.id.widget_empty_view, emptyPendingIntent);

            Intent actionIntent = new Intent(context, NekoWidget3x3Provider.class);
            actionIntent.setAction(ACTION_TASK_CLICK);
            actionIntent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, appWidgetId);
            PendingIntent actionPendingIntent = PendingIntent.getBroadcast(
                context, 1, actionIntent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_MUTABLE);
            views.setPendingIntentTemplate(R.id.widget_task_list, actionPendingIntent);

            Intent addIntent = new Intent(context, NekoWidget3x3Provider.class);
            addIntent.setAction(ACTION_ADD);
            PendingIntent addPendingIntent = PendingIntent.getBroadcast(
                context, 2, addIntent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
            views.setOnClickPendingIntent(R.id.widget_add_btn, addPendingIntent);

            Intent filterIntent = new Intent(context, NekoWidget3x3Provider.class);
            filterIntent.setAction(ACTION_FILTER);
            PendingIntent filterPendingIntent = PendingIntent.getBroadcast(
                context, 3, filterIntent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
            views.setOnClickPendingIntent(R.id.widget_filter_btn, filterPendingIntent);

            appWidgetManager.updateAppWidget(appWidgetId, views);
        }
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        super.onReceive(context, intent);
        String action = intent.getAction();
        if (action == null) return;

        if (ACTION_TASK_CLICK.equals(action)) {
            int taskId = intent.getIntExtra("task_id", -1);
            String taskAction = intent.getStringExtra("action");
            if (taskId == -1 || taskAction == null) return;

            if ("DELETE".equals(taskAction)) {
                deleteTask(context, taskId);
            } else if ("TOGGLE".equals(taskAction)) {
                toggleTask(context, taskId);
            } else if ("EDIT".equals(taskAction)) {
                Intent editIntent = new Intent(context, WidgetTaskDialogActivity.class);
                editIntent.putExtra("task_id", taskId);
                editIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                context.startActivity(editIntent);
            }
        } else if (ACTION_ADD.equals(action)) {
            Intent addIntent = new Intent(context, WidgetTaskDialogActivity.class);
            addIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            context.startActivity(addIntent);
        } else if (ACTION_FILTER.equals(action)) {
            Intent filterIntent = new Intent(context, WidgetFilterActivity.class);
            filterIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            context.startActivity(filterIntent);
        }
    }

    private void toggleTask(Context context, int taskId) {
        SharedPreferences prefs = context.getSharedPreferences("NekoWidgetData", Context.MODE_PRIVATE);
        String json = prefs.getString("tasks_json", "[]");
        try {
            JSONArray arr = new JSONArray(json);
            for (int i = 0; i < arr.length(); i++) {
                JSONObject obj = arr.getJSONObject(i);
                if (obj.optInt("id", -1) == taskId) {
                    boolean comp = obj.optBoolean("completed", false);
                    obj.put("completed", !comp);
                    break;
                }
            }
            prefs.edit().putString("tasks_json", arr.toString()).apply();
            prefs.edit().putBoolean("widget_tasks_dirty", true).apply();
            refreshWidgets(context);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void deleteTask(Context context, int taskId) {
        SharedPreferences prefs = context.getSharedPreferences("NekoWidgetData", Context.MODE_PRIVATE);
        String json = prefs.getString("tasks_json", "[]");
        try {
            JSONArray arr = new JSONArray(json);
            JSONArray updated = new JSONArray();
            for (int i = 0; i < arr.length(); i++) {
                JSONObject obj = arr.getJSONObject(i);
                if (obj.optInt("id", -1) != taskId) {
                    updated.put(obj);
                }
            }
            prefs.edit().putString("tasks_json", updated.toString()).apply();
            refreshWidgets(context);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void refreshWidgets(Context context) {
        AppWidgetManager manager = AppWidgetManager.getInstance(context);
        int[] ids = manager.getAppWidgetIds(new ComponentName(context, NekoWidget3x3Provider.class));
        manager.notifyAppWidgetViewDataChanged(ids, R.id.widget_task_list);
    }
}
