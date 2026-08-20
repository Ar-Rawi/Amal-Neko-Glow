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

public class NekoWidget3x2Provider extends AppWidgetProvider {

    private static final String ACTION_TASK_CLICK = "com.amalnekoglow.app.ACTION_TASK_3x2";

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_3x2_layout);

            // Set up the RemoteViewsService for the ListView
            Intent serviceIntent = new Intent(context, WidgetTaskService.class);
            serviceIntent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, appWidgetId);
            serviceIntent.setData(Uri.parse(serviceIntent.toUri(Intent.URI_INTENT_SCHEME)));
            views.setRemoteAdapter(R.id.widget_task_list, serviceIntent);

            // Empty view (none needed, list will just be empty)
            views.setEmptyView(R.id.widget_task_list, android.R.id.empty);

            // Set up PendingIntentTemplate for item clicks (toggle/edit/delete)
            Intent actionIntent = new Intent(context, NekoWidget3x2Provider.class);
            actionIntent.setAction(ACTION_TASK_CLICK);
            actionIntent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, appWidgetId);
            PendingIntent actionPendingIntent = PendingIntent.getBroadcast(
                context, 0, actionIntent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_MUTABLE);
            views.setPendingIntentTemplate(R.id.widget_task_list, actionPendingIntent);

            // + Add button opens the app
            Intent addIntent = context.getPackageManager().getLaunchIntentForPackage(context.getPackageName());
            if (addIntent == null) {
                addIntent = new Intent(Intent.ACTION_VIEW, Uri.parse("https://ar-rawi.github.io/Amal-Neko-Glow/"));
            }
            addIntent.putExtra("open_add_task", true);
            PendingIntent addPendingIntent = PendingIntent.getActivity(
                context, 1, addIntent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
            views.setOnClickPendingIntent(R.id.widget_add_btn, addPendingIntent);

            // Header tap opens the app
            Intent launchIntent = context.getPackageManager().getLaunchIntentForPackage(context.getPackageName());
            if (launchIntent == null) {
                launchIntent = new Intent(Intent.ACTION_VIEW, Uri.parse("https://ar-rawi.github.io/Amal-Neko-Glow/"));
            }
            PendingIntent launchPendingIntent = PendingIntent.getActivity(
                context, 2, launchIntent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
            views.setOnClickPendingIntent(R.id.widget_container, launchPendingIntent);

            appWidgetManager.updateAppWidget(appWidgetId, views);
        }
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        super.onReceive(context, intent);
        if (ACTION_TASK_CLICK.equals(intent.getAction())) {
            int taskId = intent.getIntExtra("task_id", -1);
            String action = intent.getStringExtra("action");

            if (taskId == -1 || action == null) return;

            switch (action) {
                case "TOGGLE":
                    toggleTask(context, taskId);
                    break;
                case "DELETE":
                    deleteTask(context, taskId);
                    break;
                case "EDIT":
                    // Open app to edit this specific task
                    Intent editIntent = context.getPackageManager().getLaunchIntentForPackage(context.getPackageName());
                    if (editIntent == null) {
                        editIntent = new Intent(Intent.ACTION_VIEW, Uri.parse("https://ar-rawi.github.io/Amal-Neko-Glow/"));
                    }
                    editIntent.putExtra("edit_task_id", taskId);
                    editIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    context.startActivity(editIntent);
                    break;
            }
        }
    }

    private void toggleTask(Context context, int taskId) {
        SharedPreferences prefs = context.getSharedPreferences("NekoWidgetData", Context.MODE_PRIVATE);
        String json = prefs.getString("tasks_json", "[]");
        try {
            JSONArray arr = new JSONArray(json);
            for (int i = 0; i < arr.length(); i++) {
                org.json.JSONObject obj = arr.getJSONObject(i);
                if (obj.optInt("id", -1) == taskId) {
                    obj.put("completed", !obj.optBoolean("completed", false));
                    break;
                }
            }
            prefs.edit().putString("tasks_json", arr.toString()).apply();
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
                org.json.JSONObject obj = arr.getJSONObject(i);
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
        ComponentName component = new ComponentName(context, NekoWidget3x2Provider.class);
        int[] widgetIds = manager.getAppWidgetIds(component);
        manager.notifyAppWidgetViewDataChanged(widgetIds, R.id.widget_task_list);
    }
}
