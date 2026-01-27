const { invoke } = window.__TAURI__.core;


export async function
openDb(path,
       passkey)
{
  return await invoke("open_db_request",
		      {
			dir: path,
			key: passkey
		      });
}


export async function
createDb(file,
	 passkey)
{
  return await invoke("create_db_request",
		      {
			file_name: file,
			key: passkey
		      });
}


export async function
closeDb()
{
  return await invoke("close_db_request");
}


export async function
newRow(entry)
{
  return await invoke("new_row",
		      {
			service_data: entry.service,
			email_data: entry.email,
			username_data: entry.username,
			password_data: entry.password
		      });
}


export async function
updateRow(entry)
{
  return await invoke("edit_row",
		      {
			row_id: entry.id,
			row_service: entry.service,
			row_email: entry.email,
			row_username: entry.username,
			row_password: entry.password
		      });
}


export async function
removeRow(id)
{
  return await invoke("delete_row",
		      {
			row_id: id
		      });
}


export async function
getPassword(id)
{
  return await invoke("password_request",
		      {
			row_id: id
		      });
}


export async function
showAllRows()
{
  return await invoke("show_all_rows");
}


export async function
searchRows(requests)
{
  return await invoke("search_rows", { requests: requests });
}


export async function
copyToClipboard(text_to_copy)
{
  return await invoke("copy_to_clipboard",
		      {
			text: text_to_copy
		      });
}
