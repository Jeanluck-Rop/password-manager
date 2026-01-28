import { Row } from "/views/components/rows/row.js";
import { loadHome } from "/views/home_page/home.js";
import { showEntryForm } from '/views/components/forms/row_forms.js';
import { showNotifDialog, showConfirmDialog } from '/views/components/dialogs/dialogs.js';
import { closeDb, showAllRows, newRow, removeRow, searchRows } from '/views/utils/invokes.js';


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


async function
handleSearchEntry()
{
  const search_input = document.getElementById("search");
  const clear_btn = document.getElementById("clear-search-entry");
  clear_btn.addEventListener("click",
			     async () => {
			       search_input.value = "";
			       await refreshRows();
			     });
  search_input.addEventListener("keydown", async (e) => {
    if (e.key === "Enter") {
      const raw_value = search_input.value.trim();
      if (raw_value === "")
	return;
      let search_result = {};
      const default_types = ["service", "username", "email"];
      raw_value.split(',').forEach((term) => {
        const clean_term = term.trim();
        if (clean_term.length > 0) {
          search_result[clean_term] = default_types;
        }
      });
      try {
	const result_rows = await searchRows(search_result);
	await deployRows(result_rows);
      } catch (err) {
	console.error("Error loading fetched rows:", err);
      }
      search_input.value = "";
      search_input.blur();
    }
  });
}


async function
onAddClicked()
{
  document.getElementById("add-btn")
    .addEventListener("click",
		      () => {
			showEntryForm(
			  async (data) => {
			    try {
			      await newRow(data);
			      showNotifDialog( "Success", "New password successfully added");
			      await refreshRows();
			    } catch (err) {
			      const message = err instanceof Error ? err.message : String(err);
			      showNotifDialog("Error", "There was an error while adding the new pasword: " + message);
			    }
			  },
			  null,
			  "add");
		      });
}


async function
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
			  const message = err instanceof Error ? err.message : String(err);
			  showNotifDialog("Error", "Error while exiting the password manager: " + message);
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
    await closeDb();
    const message = err instanceof Error ? err.message : String(err);
    loadHome("The given passkey was incorrect. Try again.");
  }
}


async function
deployRows(rows_data)
{
  try {
    const container = document.getElementById("rows-container");
    container.innerHTML = "";
     if (!rows_data || rows_data.length === 0) {
      const empty_msg = document.createElement("div");
      empty_msg.className = "rows-empty";
      empty_msg.textContent = "No passwords";
      container.appendChild(empty_msg);
      return;
     }
    const rows_response = await fetch("/views/components/rows/row.html");
    const row_template = await rows_response.text();
    rows_data.forEach(
      (item) => {
	const temp_div = document.createElement("div");
	temp_div.innerHTML = row_template.trim();
	const row_widget = temp_div.querySelector(".row");
	const row = new Row(row_widget, item);
	container.appendChild(row_widget);
      });
  } catch (err) {
    await closeDb();
    const message = err instanceof Error ? err.message : String(err);
    loadHome("There was an error while deploying the passwords.");
  }
}
