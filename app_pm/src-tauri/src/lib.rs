use std::sync::Mutex;

mod commands;
use crate::commands::PMState;
use core_pm::password_manager::PasswordManager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
	.plugin(tauri_plugin_opener::init())
	.manage(PMState { manager: Mutex::new(PasswordManager::new().unwrap()) })
        .invoke_handler(tauri::generate_handler![commands::init_manager,
						 commands::open_db_request,
						 commands::create_db_request,
						 commands::new_row,
						 commands::edit_row,
						 commands::delete_row,
						 commands::password_request,
						 commands::show_all_rows])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
