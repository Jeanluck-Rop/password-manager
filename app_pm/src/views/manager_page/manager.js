import { Row } from "/views/components/rows/row.js";
import { loadHome } from "/views/home_page/home.js";
import { showEntryForm } from '/views/components/forms/row_forms.js';
import { showNotifDialog, showConfirmDialog } from '/views/components/dialogs/dialogs.js';


export async function
loadManager()
{
  const app = document.getElementById("app");
  const [manager_response,
	 forms_response,
	 dialog_response] =
	await Promise.all([
	  fetch("/views/manager_page/manager.html"),
	  fetch("/views/components/dialogs/dialogs.html"),
	  fetch("/views/components/forms/forms.html")]);
  
  const manager_html = await manager_response.text();
  const dialog_html = await dialog_response.text();
  const forms_html = await forms_response.text();
  
  app.innerHTML = manager_html + dialog_html + forms_html;
  
  handleSearchEntry();
  onAddClicked();
  onExitClicked();

  const rowsData = [
    { id: 1, service: "Google", user: "juan@gmail.com", email: "juan@gmail.com" },
    { id: 2, service: "GitHub", user: "maria", email: "maria@github.com" },
    { id: 3, service: "Facebook", user: "pepe", email: "pepe@fb.com" }
  ];
  
  await deployRows(rowsData);
}


function
handleSearchEntry()
{
  //
  const rowsData = [
    { id: 1, service: "Microsoft", user: "pedro perez", email: "pedrope@outllok.com" },
    { id: 2, service: "Gitlab", user: "maria conchita", email: "macon@gitlab.com" },
    { id: 3, service: "Instragram", user: "pepe bueno", email: "pepin@ig.com" },
  ];
  //
  
  const search_input = document.getElementById("search");
  const clear_btn = document.getElementById("clear-search-entry");
 
  clear_btn.addEventListener("click",
			     () => {
			       search_input.value = "";
			       deployRows(rowsData);
			     });

  search_input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const rawValue = search_input.value.trim();
      
      if (rawValue === "")
	return;
      
      let searchResult = {};
      const defaultTypes = ["service", "username", "email"];
      
      rawValue.split(',').forEach((term) => {
        const cleanTerm = term.trim();
        if (cleanTerm.length > 0) {
          searchResult[cleanTerm] = defaultTypes;
        }
      });
      console.log("Search JSON:", searchResult);
      search_input.value = "";
      search_input.blur();
    }
  });
}


function
onAddClicked()
{
  document.getElementById("add-btn")
    .addEventListener("click",
		      () => {
			showEntryForm(
			  (data) => {
			    console.log("Nueva entrada:", data);
			  },
			  null,
			  "add");
		      });
}


function
onExitClicked()
{
  document.getElementById("exit-btn")
    .addEventListener("click",
		      async () => {
			const confirmed =
			      await showConfirmDialog("Exit Manager", "Are you sure you want to exit?");
			if (confirmed) {
			  loadHome();
			}
		      });
}


async function
deployRows(rows_data = [])
{
  const container = document.getElementById("rows-container");
  container.innerHTML = "";
  const rows_response = await fetch("./views/components/rows/row.html");
  const row_template = await rows_response.text();
  rows_data.forEach(
    (item) => {
      const temp_div = document.createElement("div");
      temp_div.innerHTML = row_template.trim();
      const row_widget = temp_div.querySelector(".row");
      const row = new Row(row_widget, item);
      container.appendChild(row_widget);
    });
}
