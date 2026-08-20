import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const manifestPath = path.resolve(rootDir, 'android/app/src/main/AndroidManifest.xml');
if (fs.existsSync(manifestPath)) {
  let content = fs.readFileSync(manifestPath, 'utf8');
  
  const widgetReceivers = `
        <!-- Native 3x2 Wide Widget Provider -->
        <receiver
            android:name=".NekoWidget3x2Provider"
            android:exported="true"
            android:label="Neko Study 3x2 Wide Widget 🐾">
            <intent-filter>
                <action android:name="android.appwidget.action.APPWIDGET_UPDATE" />
            </intent-filter>
            <meta-data
                android:name="android.appwidget.provider"
                android:resource="@xml/widget_3x2_info" />
        </receiver>

        <!-- Native 3x3 Square Widget Provider -->
        <receiver
            android:name=".NekoWidget3x3Provider"
            android:exported="true"
            android:label="Neko Dashboard 3x3 Widget 🐱">
            <intent-filter>
                <action android:name="android.appwidget.action.APPWIDGET_UPDATE" />
            </intent-filter>
            <meta-data
                android:name="android.appwidget.provider"
                android:resource="@xml/widget_3x3_info" />
        </receiver>

        <!-- Native 2x3 Tall Widget Provider -->
        <receiver
            android:name=".NekoWidget2x3Provider"
            android:exported="true"
            android:label="Neko Goals 2x3 Tall Widget 🐾">
            <intent-filter>
                <action android:name="android.appwidget.action.APPWIDGET_UPDATE" />
            </intent-filter>
            <meta-data
                android:name="android.appwidget.provider"
                android:resource="@xml/widget_2x3_info" />
        </receiver>
  `;

  if (!content.includes('NekoWidget3x2Provider')) {
    content = content.replace('</application>', `${widgetReceivers}\n    </application>`);
    fs.writeFileSync(manifestPath, content, 'utf8');
    console.log('Successfully injected widget receivers into AndroidManifest.xml');
  }
}
