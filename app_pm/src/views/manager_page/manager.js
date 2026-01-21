import { Row } from "/views/components/rows/row.js";
import { loadHome } from "/views/home_page/home.js";
import { showEntryForm } from '/views/components/forms/row_forms.js';
import { showNotifDialog, showConfirmDialog } from '/views/components/dialogs/dialogs.js';
import { closeDb, showAllRows, newRow, removeRow } from '/views/utils/invokes.js';


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
  
  await refreshRows();
}


function
handleSearchEntry()
{  
  const search_input = document.getElementById("search");
  const clear_btn = document.getElementById("clear-search-entry");
 
  clear_btn.addEventListener("click",
			     async () => {
			       search_input.value = "";
			       await refreshRows();
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
			  async (data) => {
			    try {
			      await newRow(data);
			      showNotifDialog("Row: " + data.id + " added", "Success");
			      await refreshRows();
			    } catch (err) {
			      console.error("newRow failed: ", err);
			    }
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
			try {
			  const confirmed =
				await showConfirmDialog("Exit Manager", "Are you sure you want to exit?");
				if (confirmed) {
				  await closeDb();
				  loadHome();
				}
			      } catch (err) {
				console.error("Exit failed:", err);
			      }
		      });
}


async function
refreshRows()
{
  try {
    const all_rows = await showAllRows();
    await deployRows(all_rows);
  } catch (err) {
    console.error("Error loading rows:", err);
  }
}


async function
deployRows(rows_data)
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
