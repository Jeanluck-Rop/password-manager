import { showOverlay, hideOverlay } from '/views/utils/utils.js';
//import { open } from '@tauri-apps/plugin-dialog';
import { open } from '/views/utils/plugin-dialog.js';

export async function
openFileExplorer()
{
  const selected = await open({
    multiple: false,
    filters: [{
      name: 'Base de Datos',
      extensions: ['db', 'sqlite', 'sqlite3']
    }]
  });
  return selected;
}

export function
showOpenFileForm(onAccept)
{
  showOverlay();
  const form = document.getElementById('home-open-form');
  form.classList.remove('hidden');
  
  const select_btn = form.querySelector('.btn-select-file');
  //const file_path_input = form.querySelector('.entry-select-file');
  const file_path = form.querySelector('.file-path');
  
  const passkey_input = form.querySelector('.entry-passkey');
  const toggle_btn = form.querySelector('.toggle-password');
  
  const cancel_btn = form.querySelector('.cancel-open-btn');
  const accept_btn = form.querySelector('.accept-open-btn');
  let current_db_path = "";
  
  passkey_input.value = "";
  file_path.textContent = "No database selected";
  current_db_path = "";
  accept_btn.disabled = true;
  
  const cleanup =
	() => {
	  form.classList.add('hidden');
	  select_btn.removeEventListener('click', on_select_file_click)
	  //file_path_input.removeEventListener('input', on_inputs_changed);
	  passkey_input.removeEventListener('input', on_inputs_changed);
	  toggle_btn.removeEventListener('click', on_toggle_passkey);
	  cancel_btn.removeEventListener('click', on_cancel_click);
	  accept_btn.removeEventListener('click', on_accept_click);
	  hideOverlay();
	};
  
  const on_cancel_click = () => { cleanup(); };
  const on_accept_click =
	() => {
	  const data =
		{
		  //file_path: file_path_input.value.trim(),
		  file_path: current_db_path,
		  passkey: passkey_input.value.trim()
		};
	  cleanup();
	  onAccept(data);
	};
  const on_inputs_changed =
	() => {
	  //const has_path = file_path_input.value.trim().endsWith(".db");
	  const has_path = current_db_path.length > 0 && current_db_path.endsWith(".db");
	  const has_passkey = passkey_input.value.trim() !== "";
	  accept_btn.disabled = !(has_passkey && has_path);
	};
  const on_select_file_click =
	async () => {
	  try {
	    const path = await openFileExplorer();
	    if (path) {
              current_db_path = path;
              file_path.textContent = path;
	    }
	  } catch (error) {
	    console.error("Error abriendo diálogo:", error);
	  }
	};
  const on_toggle_passkey =
	() => {
	  const icon = toggle_btn.querySelector("img");
	  const is_hidden = passkey_input.type === "password";
	  passkey_input.type = is_hidden ? "text" : "password";
	  toggle_btn.textContent = is_hidden ? "SH" : "HI";
	  icon.src = is_hidden ? "assets/eye-sh.svg" : "assets/eye-hi.svg";
	};

  //file_path_input.addEventListener('input', on_inputs_changed);
  select_btn.addEventListener('click', on_select_file_click);
  passkey_input.addEventListener('input', on_inputs_changed);
  toggle_btn.addEventListener('click', on_toggle_passkey);
  cancel_btn.addEventListener('click', on_cancel_click);
  accept_btn.addEventListener('click', on_accept_click);
}


export function
showCreateForm(onAccept)
{
  showOverlay();
  const form = document.getElementById('home-create-form');
  form.classList.remove('hidden');

  const file_name_input = form.querySelector('.entry-file-name');
  const passkey_input = form.querySelector('.new-passkey');
  const toggle_btn = form.querySelector('.toggle-passkey');
  const confirm_input = form.querySelector('.confirm-passkey');
  const toggle_confirm_btn = form.querySelector('.toggle-passkey-confirm');
  const confirm_error = form.querySelector('.passkey-confirm-error');
  
  const cancel_btn = form.querySelector('.cancel-create-btn');
  const accept_btn = form.querySelector('.accept-create-btn');
  
  file_name_input.value = "";
  passkey_input.value = "";
  
  confirm_input.value = "";
  confirm_error.classList.add('hidden');
  accept_btn.disabled = true;

  const cleanup =
	() => {
	  form.classList.add('hidden');
	  file_name_input.removeEventListener('input', on_inputs_changed);
	  passkey_input.removeEventListener('input', on_inputs_changed);
	  confirm_input.removeEventListener('input', on_inputs_changed);
	  cancel_btn.removeEventListener('click', on_cancel_click);
	  accept_btn.removeEventListener('click', on_accept_click);
	  toggle_btn.removeEventListener('click', on_toggle_passkey);
	  toggle_confirm_btn.removeEventListener('click', on_toggle_confirm_passkey);
	  hideOverlay();
	};
  
  const on_cancel_click = () => { cleanup(); };
  const on_accept_click =
	() => {
	  const data =
		{
		  file_name: file_name_input.value.trim(),
		  passkey: passkey_input.value.trim()
		};
	  cleanup();
	  onAccept(data);
	};
  const on_inputs_changed =
	() => {
	  const has_file_name = file_name_input.value.trim().endsWith(".db");;
	  const has_passkey = passkey_input.value.trim() !== "";
	  const has_confirm = confirm_input.value.trim() !== "";
	  const matches = passkey_input.value === confirm_input.value;
	  if (!matches && confirm_input.value.trim() !== "") {
	    confirm_error.classList.remove('hidden');
	  } else {
	    confirm_error.classList.add('hidden');
	  }
	  
	  accept_btn.disabled = !(has_file_name && has_passkey && has_confirm && matches);
	};
  
  const on_toggle_passkey =
	() => {
	  const icon = toggle_btn.querySelector("img");
	  const is_hidden = passkey_input.type === "password";
	  passkey_input.type = is_hidden ? "text" : "password";
	  icon.src = is_hidden ? "assets/eye-sh.svg" : "assets/eye-hi.svg";
	};
  const on_toggle_confirm_passkey =
	() => {
	  const icon = toggle_confirm_btn.querySelector("img");
	  const is_hidden = confirm_input.type === "password";
	  confirm_input.type = is_hidden ? "text" : "password";
	  icon.src = is_hidden ? "assets/eye-sh.svg" : "assets/eye-hi.svg";
	};
  
  
  file_name_input.addEventListener('input', on_inputs_changed);
  passkey_input.addEventListener('input', on_inputs_changed);
  confirm_input.addEventListener('input', on_inputs_changed);
  toggle_btn.addEventListener('click', on_toggle_passkey);
  toggle_confirm_btn.addEventListener('click', on_toggle_confirm_passkey);
  cancel_btn.addEventListener('click', on_cancel_click);
  accept_btn.addEventListener('click', on_accept_click);
}
