use std::path::Path;
use std::collections::{HashMap, HashSet};
use anyhow::Result;
use secrecy::SecretString;

use crate::database::Database;
use crate::models::{NewEntry, UpdateEntry, EntryView, SearchField};

pub struct PasswordManager {
    db: Option<Database>
}

impl PasswordManager {

    pub fn new() -> Result<Self> {
        Ok(Self{ db: None })
    }

    pub fn open_db(&mut self,
		   path: &Path,
		   key: &SecretString) -> Result<()> {
        let db = Database::open(path, key)?;
        self.db = Some(db);
        Ok(())
    }
    
    pub fn create_db(&mut self,
		     path: &Path,
		     key: &SecretString) -> Result<()> {
        let db = Database::new(path, key)?;
        self.db = Some(db);
        Ok(())
    }
    
    fn get_db(&self) -> Result<&Database> {
        self.db.as_ref().ok_or_else(|| anyhow::anyhow!("No database open."))
    }
    
    fn get_db_mut(&mut self) -> Result<&mut Database> {
        self.db.as_mut().ok_or_else(|| anyhow::anyhow!("No database open."))
    }
    
    pub fn new_entry(&mut self,
		     entry: &NewEntry) -> Result<()> {
	let db = self.get_db_mut()?;
	db.insert(entry)
    }
    
    pub fn edit_entry(&mut self,
		      edited_entry: &UpdateEntry) -> Result<()> {
	let db = self.get_db_mut()?;
	db.update(edited_entry)
    }
    
    pub fn remove_entry(&mut self,
			id: i64) -> Result<()> {
	let db = self.get_db_mut()?;
	db.delete(id)
    }

    pub fn show_all_entries(&mut self) -> Result<Vec<EntryView>> {
	let db = self.get_db()?;
	Ok(db.fetch_all()?)
    }
    
    pub fn query_entries(&self,
			 requests: HashMap<String, SearchField>) -> Result<Vec<EntryView>> {
	let db = self.get_db()?;
	let mut final_results = Vec::new();
	let mut seen_ids = HashSet::new();
	
	for (value, field) in &requests {
	    let found_entries = db.fetch_by(*field, value)?;
	    for entry in found_entries {
		if seen_ids.insert(entry.id) {
                    final_results.push(entry);
		}
            }
	}
	Ok(final_results)
    }

    pub fn get_password(&self,
			id: i64) -> Result<SecretString> {
	let db = self.get_db()?;
	db.get_password(id)
    }
}
