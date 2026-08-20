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

        setContentView(R.layout.activity_widget_filter);

        android.widget.ListView listView = findViewById(R.id.filter_list);
        android.widget.Button cancelBtn = findViewById(R.id.filter_btn_cancel);

        // Custom adapter for white text on dark background
        android.widget.ArrayAdapter<String> adapter = new android.widget.ArrayAdapter<String>(this, android.R.layout.simple_list_item_single_choice, categories) {
            @Override
            public android.view.View getView(int position, android.view.View convertView, android.view.ViewGroup parent) {
                android.view.View view = super.getView(position, convertView, parent);
                android.widget.TextView text = (android.widget.TextView) view.findViewById(android.R.id.text1);
                text.setTextColor(android.graphics.Color.WHITE);
                return view;
            }
        };

        listView.setAdapter(adapter);
        listView.setChoiceMode(android.widget.ListView.CHOICE_MODE_SINGLE);
        listView.setItemChecked(selectedIndex, true);

        listView.setOnItemClickListener(new android.widget.AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(android.widget.AdapterView<?> parent, android.view.View view, int position, long id) {
                prefs.edit().putString("widget_filter_category", values[position]).apply();
                refreshWidgets();
                finish();
            }
        });

        cancelBtn.setOnClickListener(new android.view.View.OnClickListener() {
            @Override
            public void onClick(android.view.View v) {
                finish();
            }
        });
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
