use tauri::State;
use anyhow::Result;
use std::path::Path;
use std::sync::Mutex;
use thiserror::Error;
use secrecy::{SecretString, ExposeSecret};

use core_pm::password_manager::PasswordManager;
use core_pm::models::{EntryView, NewEntry, UpdateEntry, SearchField}; 

pub struct PMState {
    pub manager: Mutex<PasswordManager>,
}

#[derive(Debug, Error)]
pub enum ErrPM {
    #[error("No database is open")]
    NoDatabase,

    #[error("I/O error: {0}")]
    Io(String),

    #[error("Database error: {0}")]
    Db(String),
}

// we must manually implement serde::Serialize
impl serde::Serialize for ErrPM {
  fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
  where
    S: serde::ser::Serializer,
  {
    serializer.serialize_str(self.to_string().as_ref())
  }
}

fn map_core_error(err: anyhow::Error) -> ErrPM {
    if err.to_string().contains("No database open") {
        return ErrPM::NoDatabase;
    }

    if let Some(io) = err.downcast_ref::<std::io::Error>() {
        return ErrPM::Io(io.to_string());
    }

    ErrPM::Db(err.to_string())
}


#[tauri::command]
pub fn init_manager(state: State<PMState>) -> Result<(), ErrPM> {
    let mut manager = state.manager.lock().unwrap();
    *manager = PasswordManager::new().map_err(map_core_error)?;
    Ok(())
}

#[tauri::command]
pub fn open_db_request(state: State<PMState>,
		       dir: String,
		       key: String) -> Result<(), ErrPM> {
    let mut manager = state.manager.lock().unwrap();
    let path = Path::new(&dir);
    let secret = SecretString::new(key);
    manager.open_db(&path, &secret).map_err(map_core_error)?;
    Ok(())
}

#[tauri::command]
pub fn create_db_request(state: State<PMState>,
			 dir: &str,
			 key: String) -> Result<(), ErrPM> {
    let mut manager = state.manager.lock().unwrap();
    let path = Path::new(&dir);
    let secret = SecretString::new(key);
    manager.create_db(&path, &secret).map_err(map_core_error)?;
    Ok(())
}

#[tauri::command(rename_all = "snake_case")]
pub fn new_row(state: State<PMState>,
	       service_data: String,
	       email_data: String,
	       username_data: String,
	       password_data: String) -> Result<(), ErrPM> {
    let mut manager = state.manager.lock().unwrap();
    let row =
	NewEntry {
	    service: service_data,
	    email: Some(email_data),
	    username: Some(username_data),
	    password: SecretString::new(password_data)
	};
    manager.new_entry(&row).map_err(map_core_error)?;
    Ok(())
}

#[tauri::command(rename_all = "snake_case")]
pub fn edit_row(state: State<PMState>,
		row_id: i64,
		row_service: String,
		row_email: String,
		row_username: String,
		row_password: String) -> Result<(), ErrPM> {
    let mut manager = state.manager.lock().unwrap();
    let update_row = UpdateEntry {
	id: row_id,
	service: row_service,
	email: Some(row_email),
	username: Some(row_username),
	password: SecretString::new(row_password)
    };
    manager.edit_entry(&update_row).map_err(map_core_error)?;
    Ok(())
}

#[tauri::command(rename_all = "snake_case")]
pub fn delete_row(state: State<PMState>,
		  row_id: i64) -> Result<(), ErrPM> {
    let mut manager = state.manager.lock().unwrap();
    manager.remove_entry(row_id).map_err(map_core_error)?;
    Ok(())
}

#[tauri::command(rename_all = "snake_case")]
pub fn password_request(state: State<PMState>,
			row_id: i64) -> Result<String, ErrPM> {
    let manager = state.manager.lock().unwrap();
    let secret = manager.get_password(row_id).map_err(map_core_error)?;
    Ok(secret.expose_secret().to_string())
}

#[tauri::command]
pub fn show_all_rows(state: State<PMState>) -> Result<Vec<EntryView>, ErrPM> {
    let mut manager = state.manager.lock().unwrap();
    manager.show_all_entries().map_err(map_core_error)
}
/*
#[tauri::command(rename_all = "snake_case")]
pub fn search_rows() {
}
*/
