use core_pm::password_manager::PasswordManager;
use core_pm::models::{EntryView, NewEntry, UpdateEntry, SearchField}; 

#[derive(Debug, thiserror::Error)]
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

let mut manager;

#[tauri::command]
pub fn init_manager() Result<(), ErrPM>{
    manager = PasswordManager::new()?;
    Ok(())
}

#[tauri::command]
pub fn open_db_request(dir: String,
		       key: String) -> Result<(), ErrPM>{
    let path  = dir.path();
    let secret = SecretString::new(key);
    manager.open_db(&path, &secret);
    Ok(())
}

#[tauri::command]
pub fn create_db_request(dir: &str,
			 key: String) -> Result<(), ErrPM>{
    let path  = dir.path();
    let secret = SecretString::new(key);
    manager.create_db(&path, &secret);
    Ok(())
}

#[tauri::command(rename_all = "snake_case")]
pub fn new_row(service_data: String,
	       email_data: String,
	       username_data: String,
	       password_data: String) Result<(), ErrPM> {
    let row =
	NewEntry {
	    service: service_data,
	    email: Some(email_data),
	    username: Some(username_data),
	    password: SecretString::new(password_data)
	};
    manager.new_entry(&row)?;
}

#[tauri::command(rename_all = "snake_case")]
pub fn edit_row(row_id,
		row_service: String,
		row_email: String,
		row_username: String,
		row_password: String) -> Result<(), ErrPM> {
    let update_row = UpdateEntry {
	id: row_id,
	service: row_service,
	email: row_email,
	username: row_username,
	password: SecreString::new(row_password)
    };

    manager.edit_entry(&update_row);
}

#[tauri::command(rename_all = "snake_case")]
pub fn delete_row(row_id: i64) -> Result<(), ErrPM> {
    manager.remove_entry(row_id)?;
    Ok()
}

#[tauri::command(rename_all = "snake_case")]
pub fn password_request(row_id: i64) -> Result<String, ErrPM> {
    let secret = manager.get_password(row_id)?;
    Ok(secret.expose_secret().to_string())
}

#[tauri::command]
pub fn show_all_rows() -> Result<Vec<EntryView>, String> {
    let rows = show_all_entries()?;
    Ok(rows)
}

#[tauri::command(rename_all = "snake_case")]
pub fn search_rows() {
}
