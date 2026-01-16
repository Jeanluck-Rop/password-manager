import { showOverlay, hideOverlay } from '/views/utils/utils.js';


export function
showEntryForm(onAccept,
	      row_data = null,
	      mode)
{
  showOverlay();
  const form = document.getElementById('entry-form');
  form.classList.remove('hidden');
  
  const cancel_btn = form.querySelector('.forms-cancel-btn');
  const accept_btn = form.querySelector('.forms-accept-btn');
  const confirm_error = form.querySelector('.entry-confirm-error');
  const toggle_btn = form.querySelector('.toggle-password');
  const toggle_confirm_btn = form.querySelector('.toggle-confirm');
  const inputs =
	{
	  service: form.querySelector('.entry-service'),
	  user: form.querySelector('.entry-username'),
	  email: form.querySelector('.entry-email'),
	  password: form.querySelector('.entry-password'),
	  confirm: form.querySelector('.entry-pass-confirm')
	};
  
  confirm_error.textContent = "";
  accept_btn.disabled = true;
  Object.values(inputs)
    .forEach((inp) => (inp.value = ""));
  
  if (mode === "edit" && row_data) {
    inputs.service.value = row_data.service;
    inputs.user.value = row_data.user;
    inputs.email.value = row_data.email;
    inputs.password.value = row_data.password;
  }

  const validate_forms =
	() => {
	  const { service,
		  password,
		  confirm } = inputs;
	  const requirements =
		service.value.trim()
		&& password.value.trim()
		&& confirm.value.trim();
	  const passwords_match =
		password.value === confirm.value;
	  if (!requirements) {
	    accept_btn.disabled = true;
	    confirm_error.textContent = "";
	    return;
	  }
	  if (!passwords_match) {
	    accept_btn.disabled = true;
	    confirm_error.textContent = "Passwords do not match.";
	  } else {
	    confirm_error.textContent = "";
	    accept_btn.disabled = false;
	  }
	}
  
  Object.values(inputs).
    forEach((inp) => inp.addEventListener('input', validate_forms));

  const on_toggle_password =
	() => {
	  const is_hidden = inputs.password.type === "password";
	  inputs.password.type = is_hidden ? "text" : "password";
	  toggle_btn.textContent = is_hidden ? "HI" : "SH";
	};
  
  const on_toggle_confirm_password =
	() => {
	  const is_hidden = inputs.confirm.type === "password";
	  inputs.confirm.type = is_hidden ? "text" : "password";
	  toggle_confirm_btn.textContent = is_hidden ? "HI" : "SH";
	};
  
  const cleanup =
	() => {
	  form.classList.add('hidden');
	  hideOverlay();
	  cancel_btn.removeEventListener('click', on_cancel_click);
	  accept_btn.removeEventListener('click', on_accept_click);
	  toggle_btn.removeEventListener('click', on_toggle_password);
	  toggle_confirm_btn.removeEventListener('click', on_toggle_confirm_password);
	  Object.values(inputs).forEach(inp => inp.removeEventListener('input', validate_forms));
	};
  
  const on_cancel_click =
	() => { cleanup(); };
  
  const on_accept_click =
	() => {
	  const data = {
	    service: inputs.service.value.trim(),
	    user: inputs.user.value.trim(),
	    email: inputs.email.value.trim(),
	    pass: inputs.password.value.trim(),
	  };
	  cleanup();
	  onAccept(data);
	};
  
  cancel_btn.addEventListener('click', on_cancel_click);
  accept_btn.addEventListener('click', on_accept_click);
  toggle_btn.addEventListener('click', on_toggle_password);
  toggle_confirm_btn.addEventListener('click', on_toggle_confirm_password);
}
