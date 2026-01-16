import { loadManager } from "/views/manager_page/manager.js";
import { showOpenFileForm, showCreateForm } from "/views/components/forms/home_forms.js";
import { showConfirmDialog } from "/views/components/dialogs/dialogs.js";


export async function
loadHome()
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
}


function
onOpenFile() {
  const open_btn = document.getElementById("btn-open");
  open_btn.addEventListener("click",
			    () => {
			      showOpenFileForm((data) => {
				console.log("Datos recibidos del formulario:", data);
				loadManager();
			      });
			    });
}

function
onCreateFile()
{
  const create_btn = document.getElementById("btn-create");
  create_btn.addEventListener("click",
			      () => {
				showCreateForm((data) => {
				  console.log("Datos recibidos del formulario:", data);
				  loadManager();
				});
			      });
}
