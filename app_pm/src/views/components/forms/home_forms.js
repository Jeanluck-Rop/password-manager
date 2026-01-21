import { showOverlay, hideOverlay } from '/views/utils/utils.js';
//import { open } from "@tauri-apps/plugin-fs";


export function
showOpenFileForm(onAccept)
{
  showOverlay();
  const form = document.getElementById('home-open-form');
  form.classList.remove('hidden');
  
  const select_btn = form.querySelector('.btn-select-file');
  const cancel_btn = form.querySelector('.cancel-open-btn');
  const accept_btn = form.querySelector('.accept-open-btn');
  const passkey_input = form.querySelector('.entry-passkey');
  const toggle_btn = form.querySelector('.toggle-password');
  const file_path = form.querySelector('.file-path');

  passkey_input.value = "";
  file_path.textContent = "Path to file to open";
  accept_btn.disabled = true;
  
  const cleanup =
	() => {
	  form.classList.add('hidden');
	  hideOverlay();
	  cancel_btn.removeEventListener('click', on_cancel_click);
	  accept_btn.removeEventListener('click', on_accept_click);
	  passkey_input.removeEventListener('input', on_passkey_input);
	  select_btn.removeEventListener('click', on_select_click);
	  toggle_btn.removeEventListener('click', on_toggle_password);
	};
  
  const on_cancel_click =
	() => {
	  cleanup();
	};
  const on_accept_click =
	() => {
	  const data = {
	    file_path: file_path.textContent,
	    passkey: passkey_input.value
	  };
	  cleanup();
	  onAccept(data);
	};
  
  const on_passkey_input =
	() => {
	  const has_passkey = passkey_input.value.trim() !== "";
	  const has_path = file_path.textContent.endsWith(".db");
	  accept_btn.disabled = !(has_passkey && has_path);
	};
  const on_select_click =
	/*async () => {
	  const selected_path = await open({
	    multiple: false,
	    filters:
	    [{
	      name: "Database",
	      extensions: ["db"]
	    }]
	    });*/
	() => {
	  //
	  const selected_path = "/home/ianluck_rop/Scripts/mokachino.db";
	  //
	  if (!selected_path) {
	    file_path.textContent = "No file selected";
	    accept_btn.disabled = true;
	    return;
	  }
	  file_path.textContent = selected_path;
	  accept_btn.disabled = passkey_input.value.trim() === "";
	};
  
  const on_toggle_password =
	() => {
	  const is_hidden = passkey_input.type === "password";
	  passkey_input.type = is_hidden ? "text" : "password";
	  toggle_btn.textContent = is_hidden ? "SH" : "HI";
	};
  
  cancel_btn.addEventListener('click', on_cancel_click);
  accept_btn.addEventListener('click', on_accept_click);
  passkey_input.addEventListener('input', on_passkey_input);
  select_btn.addEventListener('click', on_select_click);
  toggle_btn.addEventListener('click', on_toggle_password);
}


export function
showCreateForm(onAccept)
{
  showOverlay();
  const form = document.getElementById('home-create-form');
  form.classList.remove('hidden');

  const cancel_btn = form.querySelector('.cancel-create-btn');
  const accept_btn = form.querySelector('.accept-create-btn');
  const file_name_input = form.querySelector('.entry-file-name');
  const passkey_input = form.querySelector('.new-passkey');
  const confirm_input = form.querySelector('.confirm-passkey');
  const toggle_btn = form.querySelector('.toggle-passkey');
  const toggle_confirm_btn = form.querySelector('.toggle-passkey-confirm');
  const confirm_error = form.querySelector('.passkey-confirm-error');
  
  file_name_input.value = "";
  passkey_input.value = "";
  confirm_input.value = "";
  confirm_error.classList.add('hidden');
  accept_btn.disabled = true;

  const cleanup =
	() => {
	  form.classList.add('hidden');
	  hideOverlay();
	  cancel_btn.removeEventListener('click', on_cancel_click);
	  accept_btn.removeEventListener('click', on_accept_click);
	  file_name_input.removeEventListener('input', on_inputs_changed);
	  passkey_input.removeEventListener('input', on_inputs_changed);
	  confirm_input.removeEventListener('input', on_inputs_changed);
	  toggle_btn.removeEventListener('click', on_toggle_passkey);
	  toggle_confirm_btn.removeEventListener('click', on_toggle_confirm_passkey);
	};
  
  const on_cancel_click =
	() => {
	  cleanup();
	};
  const on_accept_click =
	() => {
	  const data = {
	    file_name: file_name_input.value.trim(),
	    passkey: passkey_input.value.trim(),
	  };
	  cleanup();
	  onAccept(data);
	};
  const on_inputs_changed =
	() => {
	  const file_ok = file_name_input.value.trim() !== "";
	  const pass_ok = passkey_input.value.trim() !== "";
	  const confirm_ok = confirm_input.value.trim() !== "";
	  const matches = passkey_input.value === confirm_input.value;
	  if (!matches && confirm_input.value.trim() !== "") {
	    confirm_error.classList.remove('hidden');
	  } else {
	    confirm_error.classList.add('hidden');
	  }
	  accept_btn.disabled = !(file_ok && pass_ok && confirm_ok && matches);
	};
  const on_toggle_passkey =
	() => {
	  const is_hidden = passkey_input.type === "password";
	  passkey_input.type = is_hidden ? "text" : "password";
	  toggle_btn.textContent = is_hidden ? "SH" : "HI";
	};
  const on_toggle_confirm_passkey =
	() => {
	  const is_hidden = confirm_input.type === "password";
	  confirm_input.type = is_hidden ? "text" : "password";
	  toggle_confirm_btn.textContent = is_hidden ? "SH" : "HI";
	};
  
  cancel_btn.addEventListener('click', on_cancel_click);
  accept_btn.addEventListener('click', on_accept_click);
  file_name_input.addEventListener('input', on_inputs_changed);
  passkey_input.addEventListener('input', on_inputs_changed);
  confirm_input.addEventListener('input', on_inputs_changed);
  toggle_btn.addEventListener('click', on_toggle_passkey);
  toggle_confirm_btn.addEventListener('click', on_toggle_confirm_passkey);
}
