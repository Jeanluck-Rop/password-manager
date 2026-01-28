import { openDb, createDb } from '/views/utils/invokes.js';
import { loadManager } from "/views/manager_page/manager.js";
import { showOpenFileForm, showCreateForm } from "/views/components/forms/home_forms.js";
import { showNotifDialog, showConfirmDialog } from "/views/components/dialogs/dialogs.js";


export async function
loadHome(msg)
{
  const app = document.getElementById("app");
  const [home_response,
	 forms_response,
	 dialog_response] =
	await Promise.all([
	  fetch("/views/home_page/home.html"),
	  fetch("/views/components/forms/forms.html"),
	  fetch("/views/components/dialogs/dialogs.html")]);
  const home_html = await home_response.text();
  const forms_html = await forms_response.text();
  const dialog_html = await dialog_response.text();
  app.innerHTML = home_html + forms_html + dialog_html;
  onOpenFile();
  onCreateFile();

  if (msg != null) {
    showNotifDialog("Error", msg);
  }
}


function
onOpenFile() {
  const open_btn = document.getElementById("btn-open");
  open_btn.addEventListener("click",
			    () => {
			      showOpenFileForm(
				async (data) => {
				  try {
				    await openDb(data.file_path, data.passkey);
				  } catch (err) {
				    const message = err instanceof Error ? err.message : String(err);
				    showNotifDialog("Error", "Failed opening the given database file: " + message);
				  }
				  await loadManager();
				});
			    });
}


function
onCreateFile()
{
  const create_btn = document.getElementById("btn-create");
  create_btn.addEventListener("click",
			      () => {
				showCreateForm(
				  async (data) => {
				    try {
				      await createDb(data.file_name, data.passkey);
				      loadManager();
				    } catch (err) {
				      const message = err instanceof Error ? err.message : String(err);
				      showNotifDialog("Error", "Failed creating the database with the given file name: " + message);
				    }
				  });
			      });
}
