use rusqlite::Connection;

use anyhow::{Context, Result};

use crate::password_struct::PasswordEntry;

pub struct DbConnection {
    pub conn: Connection
}

impl DbConnection {
    
    pub fn open(db_path: &str,
		key: &str) -> Result<Self> {
	conn = Connection::open(db_path)
	    .context("No se pudo abrir el archivo de base de datos")?;
	
        conn.pragma_update(None, "key", &key)
            .context("Error al aplicar la clave de cifrado")?;
	

        
        Ok(Self{ conn })
    }
    
    pub fn new(file_name: &str,
	       db_path: &str,
	       key: &str) -> str {
	
	let conn = Connection::open(db_path)?;
	conn.execute("PRAGMA KEY='passphrase'", NO_PARAMS);
	conn.execute(
	    "CREATE TABLE IF NOT EXISTS Passwords(
                  site TEXT NOT NULL,
                  email TEXT,
                  username TEXT,
                  password TEXT NOT NULL)",
	    [])?;
	conn.close();
	open(db_path ++ file_name, key);
    }
}
