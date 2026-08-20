package com.amalnekoglow.app;

import android.app.Activity;
import android.app.AlertDialog;
import android.appwidget.AppWidgetManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.DialogInterface;
import android.content.SharedPreferences;
import android.os.Bundle;

public class WidgetFilterActivity extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        final SharedPreferences prefs = getSharedPreferences("NekoWidgetData", Context.MODE_PRIVATE);
        String currentCat = prefs.getString("widget_filter_category", "all");

        final String[] categories = {"All Tasks", "Study", "Project", "Assignment", "Home"};
        final String[] values = {"all", "study", "project", "assignment", "home"};
        
        int selectedIndex = 0;
        for (int i = 0; i < values.length; i++) {
            if (values[i].equals(currentCat)) {
                selectedIndex = i;
                break;
            }
        }

        AlertDialog.Builder builder = new AlertDialog.Builder(this, android.R.style.Theme_DeviceDefault_Dialog_Alert);
        builder.setTitle("Select Category");
        builder.setSingleChoiceItems(categories, selectedIndex, new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                prefs.edit().putString("widget_filter_category", values[which]).apply();
                refreshWidgets();
                dialog.dismiss();
                finish();
            }
        });
        builder.setOnCancelListener(new DialogInterface.OnCancelListener() {
            @Override
            public void onCancel(DialogInterface dialog) {
                finish();
            }
        });

        AlertDialog dialog = builder.create();
        dialog.show();
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
