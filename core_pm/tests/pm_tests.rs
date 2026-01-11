use core_pm::password_manager::PasswordManager;
use core_pm::models::{EntryView, NewEntry, UpdateEntry, SearchField}; 

use anyhow::Result;
use std::collections::HashMap;
use tempfile::{tempdir, TempDir};
use secrecy::{ExposeSecret, SecretString};

fn make_secret(secret: &str) -> SecretString {
    SecretString::new(secret.to_string())
}

fn sample_entries() -> Vec<NewEntry> {
    vec![
        NewEntry {
            service: "Nu".to_string(),
            email: Some("user@example.com".to_string()),
            username: Some("metroman".to_string()),
            password: make_secret("123a4")
        },
        NewEntry {
            service: "BBVA".to_string(),
            email: Some("userbb@example.com".to_string()),
            username: Some("juanin".to_string()),
            password: make_secret("bx3l5")
        },
        NewEntry {
            service: "Gmail".to_string(),
            email: Some("guser@gmail.com".to_string()),
            username: Some("pablito".to_string()),
            password: make_secret("gg33+")
        },
        NewEntry {
            service: "Gmail".to_string(),
            email: Some("xguser@gmail.com".to_string()),
            username: Some("pablitoXF".to_string()),
            password: make_secret("g8gH33+")
        },
        NewEntry {
            service: "Microsoft".to_string(),
            email: Some("micro@outlook.com".to_string()),
            username: Some("Jesus".to_string()),
            password: make_secret("abcds234")
        }
    ]
}

fn setup_manager() -> Result<(TempDir, PasswordManager)> {
    let dir = tempdir()?;
    let path = dir.path().join("test.db");

    let mut manager = PasswordManager::new()?;
    let master_key = make_secret("abc123");
    manager.create_db(&path, &master_key)?;
    for entry in sample_entries() {
        manager.new_entry(&entry)?;
    }
    
    Ok((dir, manager))
}


#[test]
fn test_insertion_and_show_all() -> Result<()> {
    let (_dir, mut manager) = setup_manager()?;

    let res = manager.show_all_entries()?;
    assert_eq!(res.len(), 5);

    assert_eq!(res[0].service, "Nu");
    assert_eq!(res[0].email.as_deref(), Some("user@example.com"));
    assert_eq!(res[0].username.as_deref(), Some("metroman"));

    Ok(())
}

#[test]
fn test_search_by_service() -> Result<()> {
    let (_dir, manager) = setup_manager()?;
    
    let mut req = HashMap::new();
    req.insert("Gmail".to_string(), SearchField::Service);

    let res = manager.query_entries(req)?;
    assert_eq!(res.len(), 2);

    for e in res {
        assert_eq!(e.service, "Gmail");
    }

    Ok(())
}

#[test]
fn test_update_entry() -> Result<()> {
    let (_dir, mut manager) = setup_manager()?;
    let entries = manager.show_all_entries()?;
    let old_entry_view = entries
        .iter()
        .find(|e| e.service == "Gmail" && e.username.as_deref() == Some("pablito"))
        .expect("Should find Gmail entry");
    
    let update_payload = UpdateEntry {
        id: old_entry_view.id,
        service: "Hotmail".to_string(),
        email: Some("user@hotmail.com".to_string()),
        username: old_entry_view.username.clone(),
        password: make_secret("new_password_123"),
    };
    
    manager.edit_entry(&update_payload)?;

    let mut req = HashMap::new();
    req.insert("Hotmail".to_string(), SearchField::Service);

    let res = manager.query_entries(req)?;
    assert_eq!(res.len(), 1);
    assert_eq!(res[0].email.as_deref(), Some("user@hotmail.com"));

    Ok(())
}
    
#[test]
fn test_delete_entry() -> Result<()> {
    let (_dir, mut manager) = setup_manager()?;

    let entries = manager.show_all_entries()?;
    let microsoft = entries
        .iter()
        .find(|e| e.service == "Microsoft")
        .unwrap();

    manager.remove_entry(microsoft.id)?;

    let mut req = HashMap::new();
    req.insert("Microsoft".to_string(), SearchField::Service);

    let res = manager.query_entries(req)?;
    assert!(res.is_empty());

    Ok(())
}

#[test]
fn test_show_password() -> Result<()> {
    let (_dir, mut manager) = setup_manager()?;

    let entries = manager.show_all_entries()?;
    let bbva_entry = entries
        .iter()
        .find(|e| e.service == "BBVA")
        .unwrap();

    let retrieved_password = manager.get_password(bbva_entry.id)?;

    assert_eq!(retrieved_password.expose_secret(), "bx3l5");

    Ok(())
}
