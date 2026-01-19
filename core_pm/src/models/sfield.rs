use serde::{Serialize, Deserialize};

#[derive(Debug, Copy, Clone, Eq, PartialEq, Hash, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum SearchField {
    Service,
    Email,
    Username
}

impl SearchField {
    pub fn as_column(&self) -> &'static str {
        match self {
            SearchField::Service => "service",
            SearchField::Email => "email",
            SearchField::Username => "username",
        }
    }
}
