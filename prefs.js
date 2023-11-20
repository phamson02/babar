// Preferences UI for BaBar GNOME Shell extension

import Gio from 'gi://Gio';
import Adw from 'gi://Adw';

import { ExtensionPreferences, gettext as _ } from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

export default class MyPrefsWidget extends ExtensionPreferences {
    fillPreferencesWindow(window) {
		this.window = window;
        this._initSettings();
    }

    // Initialize settings
    _initSettings() {
		this._settings = this.getSettings("org.gnome.shell.extensions.babar");

        const page = new Adw.PreferencesPage({
            title: _('General'),
            icon_name: 'dialog-information-symbolic',
        });
		this.page = page;
        this.window.add(this.page);

		// items
		this.group = this.make_section_title('Elements (default value)');
		this.page.add(this.group);

		this.make_item('Activities (false)', 'display-activities', 'b');
		this.make_item('Applications grid (true)', 'display-app-grid', 'b');
		this.make_item('Favorites menu (true)', 'display-favorites', 'b');
		this.make_item('Workspaces (true)', 'display-workspaces', 'b');
		this.make_item('Tasks (true)', 'display-tasks', 'b');
		this.make_item('Application menu (false)', 'display-app-menu', 'b');
		this.make_item('Dash in overview (true)', 'display-dash', 'b');
		this.make_item('Workspaces thumbnails in overview (true)', 'display-workspaces-thumbnails', 'b');
		
		this.group = this.make_section_title('Appearance (default value)');
		this.page.add(this.group);
		
		this.make_item('Reduce elements padding (true)', 'reduce-padding', 'b');
		this.make_item('Places extension label to icon (true)', 'display-places-icon', 'b');
		this.make_item('Rounded workspaces icons (false)', 'rounded-workspaces-buttons', 'b');
		this.make_item('Plain workspaces icons (false)', 'plain-workspaces-buttons', 'b');
		this.make_item('Remove color from tasks icons (false)', 'desaturate-icons', 'b');
		this.make_item('Move panel to the bottom of the screen (false)', 'bottom-panel', 'b');
		this.make_item('Task icon size (18: Shell <= 3.38, 20: Shell >= 40)', 'icon-size', 'i', 8, 64);
		this.make_item('Thumbnail maximum size % (25)', 'thumbnail-max-size', 'i', 10, 100);
		// this.make_item('Applications grid icon (view-app-grid-symbolic)', 'app-grid-icon-name', 's');
		// this.make_item('Places icon (folder-symbolic)', 'places-icon-name', 's');
		// this.make_item('Favorites icon (starred-symbolic)', 'favorites-icon-name', 's');
		
		this.group = this.make_section_title('Behavior (default value)');
		this.page.add(this.group);
		
		this.make_item('Workspaces: left click to show, right-click to show or toggle overview (false)', 'workspaces-right-click', 'b');
		this.make_item('Tasks: right-click to show window thumbnail (true)', 'right-click', 'b');
		this.make_item('Tasks: middle-click to close window (true)', 'middle-click', 'b');
		this.make_item('Tasks: sort favorites first (false)', 'favorites-first', 'b');

		this.window._settings = this._settings;
    }

	make_item(label, schema, type, min, max) {
		// Get default value in parenthesis in label
		let default_value = "Default value: " + label.match(/\(([^)]+)\)/)[1];
		label = label.replace(/\([^)]+\)/, '');

		if (type == 'b') {
			this.item_value = new Adw.SwitchRow({
				title: _(label),
				subtitle: _(default_value),
				active: this._settings.get_boolean(schema),
			});

			this._settings.bind(
				schema,
				this.item_value,
				'active',
				Gio.SettingsBindFlags.DEFAULT
			);
		}
		
		if (type == 'i') {
			this.item_adjustment = new Gtk.Adjustment({
				lower: min,
				upper: max,
				step_increment: 1
			});

			this.item_value = new Adw.SpinRow({
				title: _(label),
				subtitle: _(default_value),
				adjustment: this.item_adjustment,
				value: this._settings.get_int(schema),
			});

			this._settings.bind(
				schema,
				this.item_value,
				'value',
				Gio.SettingsBindFlags.DEFAULT
			);
		}
		
		if (type == 's') {
			this.item_value = new Adw.EntryRow({
				title: _(label),
				subtitle: _(default_value),
				text: this._settings.get_string(schema),
			});

			this._settings.bind(
				schema,
				this.item_value,
				'text',
				Gio.SettingsBindFlags.DEFAULT
			);
		}
		this.group.add(this.item_value);
	}

	make_section_title(title) {
		const group = new Adw.PreferencesGroup({
            title: _(title),
        });

		return group;
	}
}
