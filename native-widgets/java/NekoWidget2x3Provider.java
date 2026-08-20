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

public class NekoWidget2x3Provider extends AppWidgetProvider {

    private static final String ACTION_TASK_CLICK = "com.amalnekoglow.app.ACTION_TASK_2x3";
    private static final String ACTION_ADD = "com.amalnekoglow.app.ACTION_ADD_2x3";
    private static final String ACTION_FILTER = "com.amalnekoglow.app.ACTION_FILTER_2x3";

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_2x3_layout);

            Intent serviceIntent = new Intent(context, WidgetTaskService.class);
            serviceIntent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, appWidgetId);
            serviceIntent.setData(Uri.parse(serviceIntent.toUri(Intent.URI_INTENT_SCHEME)));
            views.setRemoteAdapter(R.id.widget_task_list, serviceIntent);
            
            views.setEmptyView(R.id.widget_task_list, R.id.widget_empty_view);
            Intent emptyIntent = new Intent(context, NekoWidget2x3Provider.class);
            emptyIntent.setAction(ACTION_ADD);
            PendingIntent emptyPendingIntent = PendingIntent.getBroadcast(
                context, 0, emptyIntent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
            views.setOnClickPendingIntent(R.id.widget_empty_view, emptyPendingIntent);

            Intent actionIntent = new Intent(context, NekoWidget2x3Provider.class);
            actionIntent.setAction(ACTION_TASK_CLICK);
            actionIntent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, appWidgetId);
            PendingIntent actionPendingIntent = PendingIntent.getBroadcast(
                context, 1, actionIntent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_MUTABLE);
            views.setPendingIntentTemplate(R.id.widget_task_list, actionPendingIntent);

            Intent addIntent = new Intent(context, NekoWidget2x3Provider.class);
            addIntent.setAction(ACTION_ADD);
            PendingIntent addPendingIntent = PendingIntent.getBroadcast(
                context, 2, addIntent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
            views.setOnClickPendingIntent(R.id.widget_add_btn, addPendingIntent);

            Intent filterIntent = new Intent(context, NekoWidget2x3Provider.class);
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
            } else if ("EDIT".equals(taskAction)) {
                setPendingActionAndLaunch(context, "{\"action\":\"edit\", \"taskId\":" + taskId + "}");
            }
        } else if (ACTION_ADD.equals(action)) {
            setPendingActionAndLaunch(context, "{\"action\":\"add\"}");
        } else if (ACTION_FILTER.equals(action)) {
            cycleFilter(context);
        }
    }

    private void setPendingActionAndLaunch(Context context, String jsonAction) {
        SharedPreferences prefs = context.getSharedPreferences("NekoWidgetData", Context.MODE_PRIVATE);
        prefs.edit().putString("pending_action", jsonAction).apply();

        Intent launchIntent = context.getPackageManager().getLaunchIntentForPackage(context.getPackageName());
        if (launchIntent != null) {
            launchIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
            context.startActivity(launchIntent);
        }
    }

    private void cycleFilter(Context context) {
        SharedPreferences prefs = context.getSharedPreferences("NekoWidgetData", Context.MODE_PRIVATE);
        String current = prefs.getString("widget_filter_category", "all");
        String next = "all";
        
        if ("all".equals(current)) next = "study";
        else if ("study".equals(current)) next = "project";
        else if ("project".equals(current)) next = "assignment";
        else if ("assignment".equals(current)) next = "home";
        else next = "all";

        prefs.edit().putString("widget_filter_category", next).apply();
        refreshWidgets(context);
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
        int[] ids = manager.getAppWidgetIds(new ComponentName(context, NekoWidget2x3Provider.class));
        manager.notifyAppWidgetViewDataChanged(ids, R.id.widget_task_list);
    }
}
