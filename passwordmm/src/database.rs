use std::path::Path;
use secrecy::ExposeSecret;
use secret_string::SecretString;
use anyhow::{Context, Result, bail};
use rusqlite::{params, Connection};

use crate::pm_structs::EntryView;

pub struct Database {
    conn: Connection
}

impl Database {
    
    pub fn open(db_path: &Path,
		key: &SecretString) -> Result<Self> {
	let conn = Connection::open(db_path).context("Failed opening the Database.")?;
	conn.pragma_update(None, "key", key.expose_secret()).context("Error applying the given key.")?;
        Ok(Self{ conn })
    }
        
    pub fn new(db_path: &Path,
	       key: &SecretString) -> Result<Self> {
	let conn = Connection::open(db_path)?;
	conn.pragma_update(None, "key", key.expose_secret())?;
	conn.execute(
	    "CREATE TABLE IF NOT EXISTS Passwords(
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  service TEXT NOT NULL,
                  email TEXT,
                  username TEXT,
                  password TEXT NOT NULL)", [])?;
	Ok(Self{ conn })
    }

    pub fn insert(&mut self,
		  entry: &NewEntry) -> Result<()> {
        self.conn.execute(
            "INSERT INTO Passwords(service, email, username, password) VALUES(?1, ?2, ?3, ?4)",
            params![entry.service,
                    entry.email,
                    entry.username,
                    entry.password.expose_secret()])?;
        Ok(())
    }

    pub fn update(&mut self,
		  entry: &UpdateEntry) -> Result<()> {
        let op = self.conn.execute(
            "UPDATE Passwords SET service = ?1, email = ?2, username = ?3, password = ?4 WHERE id = ?5",
            params![entry.service,
                    entry.email,
                    entry.username,
                    entry.password.expose_secret(),
		    entry.id])?;
	if op == 0 {
            anyhow::bail!("No entry found with id {}", entry.id);
	}
	Ok(())
    }
    
    pub fn delete(&mut self,
		  id: i64) -> Result<()> {
	let op = self.conn.execute("DELETE FROM Passwords WHERE id = ?1", params![id])?;
	if op == 0 {
            anyhow::bail!("No entry found with id {}", id);
	}
	Ok(())
    }
    
    pub fn fetch_all(&self) -> Result<Vec<EntryView>> {
	let mut stmt = self.conn.prepare("SELECT id, service, email, username FROM Passwords")?;
	let rows = stmt.query_map([], |row| {
            Ok(EntryView {
		id: row.get(0)?,
		service: row.get(1)?,
		email: row.get(2)?,
		username: row.get(3)?
            })
	})?;
	let mut entries = Vec::new();
	for row in rows {
            entries.push(row?);
	}
	Ok(entries)
    }

    pub fn fetch_by(&self,
		    field: &str,
		    value: &str) -> Result<Vec<EntryView>> {
	match field {
	    "service" | "email" | "username" => {}
	    _ => bail!("Invalid field"),
	}
	let sql = format!("SELECT id, service, email, username FROM Passwords WHERE {} = ?1", field);
	let mut stmt = self.conn.prepare(&sql)?;
        let rows = stmt.query_map([value], |row| {
            Ok(EntryView {
		id: row.get(0)?,
                service: row.get(1)?,
                email: row.get(2)?,
                username: row.get(3)?
            })
        })?;
	let mut results = Vec::new();
        for row in rows {
            results.push(row?);
        }
	Ok(results)
    }
    
    pub fn get_password(&self,
			id: i64,) -> Result<SecretString> {
	let mut stmt = self.conn.prepare(
            "SELECT password FROM Passwords WHERE id = ?1"
	)?;
	
	let password: String = stmt.query_row(
        params![id],
            |row| row.get(0),
	).map_err(|_| anyhow::anyhow!("No entry found with id {}", id))?;
	
	Ok(SecretString::new(password))
    }
}
