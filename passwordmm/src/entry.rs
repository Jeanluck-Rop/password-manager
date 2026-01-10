#[derive(Debug, Clone)]
pub struct PasswordEntry {
    pub id: i64,
    pub service: String,
    pub email: Option<String>,
    pub username: Option<String>,
    pub password: String,
}
