pub enum SearchField {
    Service,
    Email,
    Username
}

impl SearchField {
    fn as_column(&self) -> &'static str {
        match self {
            SearchField::Service => "service",
            SearchField::Email => "email",
            SearchField::Username => "username",
        }
    }
}

