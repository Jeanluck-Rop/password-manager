import { loadHome } from "/views/home_page/home.js";

const invoke = window.__TAURI__.core.invoke;
invoke('init_manager',
       'open_db_request',
       'create_db_request',
       'new_row',
       'edit_row',
       'delete_row',
       'password_request',
       'show_all_rows',
       'search_rows',
       'copy_to_clipboard');

window.addEventListener("DOMContentLoaded",
			() => { loadHome(); }
		       );
