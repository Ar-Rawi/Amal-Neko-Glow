package com.amalnekoglow.app;

import android.appwidget.AppWidgetManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.SharedPreferences;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "WidgetBridge")
public class WidgetDataBridge extends Plugin {

    @PluginMethod()
    public void syncTasks(PluginCall call) {
        String tasksJson = call.getString("tasks", "[]");

        Context context = getContext();
        SharedPreferences prefs = context.getSharedPreferences("NekoWidgetData", Context.MODE_PRIVATE);
        prefs.edit().putString("tasks_json", tasksJson).apply();

        // Notify all widget providers to refresh
        AppWidgetManager manager = AppWidgetManager.getInstance(context);

        refreshProvider(manager, context, NekoWidget3x2Provider.class);
        refreshProvider(manager, context, NekoWidget3x3Provider.class);
        refreshProvider(manager, context, NekoWidget2x3Provider.class);

        JSObject result = new JSObject();
        result.put("success", true);
        call.resolve(result);
    }

    @PluginMethod()
    public void deleteTask(PluginCall call) {
        int taskId = call.getInt("taskId", -1);
        if (taskId == -1) {
            call.reject("Invalid task ID");
            return;
        }

        Context context = getContext();
        SharedPreferences prefs = context.getSharedPreferences("NekoWidgetData", Context.MODE_PRIVATE);
        String json = prefs.getString("tasks_json", "[]");

        try {
            org.json.JSONArray arr = new org.json.JSONArray(json);
            org.json.JSONArray updated = new org.json.JSONArray();
            for (int i = 0; i < arr.length(); i++) {
                org.json.JSONObject obj = arr.getJSONObject(i);
                if (obj.optInt("id", -1) != taskId) {
                    updated.put(obj);
                }
            }
            prefs.edit().putString("tasks_json", updated.toString()).apply();

            AppWidgetManager manager = AppWidgetManager.getInstance(context);
            refreshProvider(manager, context, NekoWidget3x2Provider.class);
            refreshProvider(manager, context, NekoWidget3x3Provider.class);
            refreshProvider(manager, context, NekoWidget2x3Provider.class);

            JSObject result = new JSObject();
            result.put("success", true);
            call.resolve(result);
        } catch (Exception e) {
            call.reject("Failed to delete task: " + e.getMessage());
        }
    }

    @PluginMethod()
    public void toggleTask(PluginCall call) {
        int taskId = call.getInt("taskId", -1);
        if (taskId == -1) {
            call.reject("Invalid task ID");
            return;
        }

        Context context = getContext();
        SharedPreferences prefs = context.getSharedPreferences("NekoWidgetData", Context.MODE_PRIVATE);
        String json = prefs.getString("tasks_json", "[]");

        try {
            org.json.JSONArray arr = new org.json.JSONArray(json);
            for (int i = 0; i < arr.length(); i++) {
                org.json.JSONObject obj = arr.getJSONObject(i);
                if (obj.optInt("id", -1) == taskId) {
                    obj.put("completed", !obj.optBoolean("completed", false));
                    break;
                }
            }
            prefs.edit().putString("tasks_json", arr.toString()).apply();

            AppWidgetManager manager = AppWidgetManager.getInstance(context);
            refreshProvider(manager, context, NekoWidget3x2Provider.class);
            refreshProvider(manager, context, NekoWidget3x3Provider.class);
            refreshProvider(manager, context, NekoWidget2x3Provider.class);

            JSObject result = new JSObject();
            result.put("success", true);
            call.resolve(result);
        } catch (Exception e) {
            call.reject("Failed to toggle task: " + e.getMessage());
        }
    }

    private void refreshProvider(AppWidgetManager manager, Context context, Class<?> providerClass) {
        ComponentName component = new ComponentName(context, providerClass);
        int[] widgetIds = manager.getAppWidgetIds(component);
        if (widgetIds.length > 0) {
            manager.notifyAppWidgetViewDataChanged(widgetIds, R.id.widget_task_list);
        }
    }
}
