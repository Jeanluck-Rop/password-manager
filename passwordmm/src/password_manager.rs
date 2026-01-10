use std::path::Path;
use anyhow::Result;
use std::collections::{HashMap, HashSet};

use crate::database::Database;
use crate::entry::PasswordEntry;

pub struct PasswordManager {
    db: Option<Database>
}

impl PasswordManager {

    fn db(&self) -> Result<&Database> {
        self.db.as_ref().ok_or_else(|| anyhow::anyhow!("No database open"))
    }
    
    fn db_mut(&mut self) -> Result<&mut Database> {
        self.db.as_mut().ok_or_else(|| anyhow::anyhow!("No database open"))
    }
    
    pub fn new() -> Result<Self> {
        Ok(Self{ db: None })
    }

    pub fn open_db(&mut self,
		   path: &Path,
		   key: &str) -> Result<()> {
        let db = Database::open(path, key)?;
        self.db = Some(db);
        Ok(())
    }

    pub fn create_db(&mut self,
		     path: &Path,
		     key: &str) -> Result<()> {
        let db = Database::new(path, key)?;
        self.db = Some(db);
        Ok(())
    }
    
    pub fn show_all_entries(&mut self) -> Result<Vec<PasswordEntry>> {
	let db = self.db()?;
	Ok(db.fetch_all()?)
    }
    
    pub fn new_entry(&mut self,
		     entry: PasswordEntry) -> Result<()> {
	let db = self.db_mut()?;
	db.insert(&entry)
    }
    
    pub fn edit_entry(&mut self,
		      edited_entry: PasswordEntry) -> Result<()> {
	let db = self.db_mut()?;
	db.update(&edited_entry)
    }
    
    pub fn remove_entry(&mut self,
			id: i64) -> Result<()> {
	let db = self.db_mut()?;
	db.delete(id)
    }

    pub fn search_entries(&self,
			  requests: HashMap<String, String>) -> Result<Vec<PasswordEntry>> {
	let db = self.db()?;
	let mut final_results = Vec::new();
	let mut seen_ids = HashSet::new();
	for (value, field) in &requests {
	    let found_entries = db.fetch_by(field, value)?;
	    for entry in found_entries {
		if seen_ids.insert(entry.id) {
                    final_results.push(entry);
		}
            }
	}
	
	Ok(final_results)
    }
}
