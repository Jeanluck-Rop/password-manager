use secret_string::SecretString;

#[derive(Debug, Clone)]
pub struct EntryView {
    pub id: i64,
    pub service: String,
    pub email: Option<String>,
    pub username: Option<String>
}

#[derive(Debug, Clone)]
pub struct NewEntry {
    pub service: String,
    pub email: Option<String>,
    pub username: Option<String>,
    pub password: SecretString,
}

#[derive(Debug, Clone)]
pub struct UpdateEntry {
    pub id: i64,
    pub service: String,
    pub email: Option<String>,
    pub username: Option<String>,
    pub password: SecretString,
}
