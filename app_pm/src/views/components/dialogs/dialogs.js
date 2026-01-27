import { showOverlay, hideOverlay } from '/views/utils/utils.js';

export function
showNotifDialog(type,
		message)
{
  showOverlay();
  const dialog = document.getElementById('notif-dialog');
  dialog.querySelector('.notif-dialog-title').textContent = type;
  dialog.querySelector('.notif-dialog-text').textContent = message;
  dialog.classList.remove('hidden');
  const ok_btn = dialog.querySelector('.notif-ok-btn');
  const cleanup =
	() => {
	  dialog.classList.add('hidden');
	  hideOverlay();
	  ok_btn.removeEventListener('click', cleanup);
	};
  ok_btn.addEventListener('click', cleanup);
}


export function
showConfirmDialog(type,
		  message)
{
  return new Promise(
    (resolve) => {
      showOverlay();
      const dialog = document.getElementById('confirm-dialog');
      dialog.querySelector('.confirm-dialog-title').textContent = type;
      dialog.querySelector('.confirm-dialog-text').textContent = message;
      dialog.classList.remove('hidden');
      const cancel_btn = dialog.querySelector('.confirm-cancel-btn');
      const accept_btn = dialog.querySelector('.confirm-accept-btn');
      const cleanup =
	    () => {
	      dialog.classList.add('hidden');
	      hideOverlay();
	      cancel_btn.removeEventListener('click', on_cancel_clicked);
	      accept_btn.removeEventListener('click', on_accept_clicked);
	    };
      const on_cancel_clicked =
	    () => {
	      cleanup();
	      resolve(false);
	    };
      const on_accept_clicked =
	    () => {
	      cleanup();
	      resolve(true);
	    };
      cancel_btn.addEventListener('click', on_cancel_clicked);
      accept_btn.addEventListener('click', on_accept_clicked);
    });
}
