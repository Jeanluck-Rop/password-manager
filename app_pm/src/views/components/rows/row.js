import { showEntryForm } from '/views/components/forms/row_forms.js';
import { showNotifDialog, showConfirmDialog } from "/views/components/dialogs/dialogs.js";
import { getPassword, updateRow, removeRow, copyToClipboard } from '/views/utils/invokes.js';


export class Row {
  
  constructor(widget,
	      data)
  {
    this.widget = widget;
    this.data = data;
    this.is_password_visible = false;
    this.updateView();
    this.show_btn = this.widget.querySelector(".show-btn");
    this.deploy_btn = this.widget.querySelector(".deploy-btn");
    this.popover = this.widget.querySelector(".popover");
    this.show_btn.addEventListener("click", () => this.togglePassword());
    this.deploy_btn.addEventListener("click", () => this.togglePopover());
    this.popover.querySelector(".copy-opt")
      .addEventListener("click",
			() => this.copyPassword());
    this.popover.querySelector(".edit-opt")
      .addEventListener("click",
			() => this.editRow());
    this.popover.querySelector(".delete-opt")
      .addEventListener("click",
			() => this.deleteRow());
  }
  
  
  updateView()
  {
    this.widget.querySelector(".row-service").textContent = this.data.service;
    this.widget.querySelector(".row-email").textContent = this.data.email;
    this.widget.querySelector(".row-user").textContent = this.data.username;
    this.widget.querySelector(".row-pass").textContent = "••••••••";
  }

  
  async togglePassword()
  {
    const icon = this.show_btn.querySelector("img");
    const password_row = this.widget.querySelector(".row-pass");
    if (!this.is_password_visible) {
      try {
	const password = await getPassword(this.data.id);
	password_row.textContent = password;
	icon.src = "assets/eye-sh.svg";
	this.is_password_visible = true;
      } catch (err) {
	const message = err instanceof Error ? err.message : String(err);
	showNotifDialog("Error", "Showing the password failed: " + message);
      }
    } else {
      password_row.textContent = "••••••••";
      icon.src = "assets/eye-hi.svg";
      this.is_password_visible = false;
    }
  }

  
  togglePopover()
  {
    const icon = this.deploy_btn.querySelector("img");
    const is_hidden = this.popover.classList.toggle("hidden");
    icon.src = is_hidden ? "assets/arrow-up.svg" : "assets/arrow-down.svg";
    const closeOnOutsideClick =
	  (event) => {
	    if (!this.popover.contains(event.target) && event.target !== this.deploy_btn) {
              this.popover.classList.add("hidden");
	      icon.src = "assets/arrow-up.svg";
              document.removeEventListener("click", closeOnOutsideClick);
	    }
	  };
    if (!is_hidden) {
      document.addEventListener("click", closeOnOutsideClick);
    }
  }

  
  async copyPassword()
  {
    try {
      const password = await getPassword(this.data.id);
      await copyToClipboard(password);
      showNotifDialog("Success", `Password for ID ${this.data.id} copied!`);
    } catch(err) {
      const message = err instanceof Error ? err.message : String(err);
      showNotifDialog("Error", "Copying the password to the clipboard failed: " + message);
    }
    this.popover.classList.add("hidden");
  }
  
  
  async editRow()
  {
    try {
      const password = await getPassword(this.data.id);
      let dataForms =
	  {
	    ...this.data, 
            password
	  };
      this.popover.classList.add("hidden");
      showEntryForm(
	async (updatedData) => {
	  this.data =
	    { ...this.data,
	      ...updatedData };
	  try {
	    await updateRow({
	      id:this.data.id,
	      ...updatedData
	    });
	    this.updateView();
	    showNotifDialog("Success", "Password edited successfully!");
	  } catch (err) {
	    const message = err instanceof Error ? err.message : String(err);
	    showNotifDialog("Error", "The password could not be edited due to an error: " + message);
	  }
	},
	dataForms,
	"edit");
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      showNotifDialog("Error", "Failed to load the password data: " + message);
    }
  }
  
  
  deleteRow()
  {
    this.popover.classList.add("hidden");
    showConfirmDialog("Confirm Delete Password", "Are you sure you want to delete th ${this.data.service} password?")
      .then(async (confirmed) => {
        if (confirmed) {
          this.widget.remove();
	  try {
	    await removeRow(this.data.id);
	    showNotifDialog("Succes", "The password was removed successfully!");
	  } catch (err) {
	    const message = err instanceof Error ? err.message : String(err);
	    showNotifDialog("Error", "Failed deleting the password: " + message);
	  }
        }
      });
  }
}
