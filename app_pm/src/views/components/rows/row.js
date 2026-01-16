import { showNotifDialog, showConfirmDialog } from "/views/components/dialogs/dialogs.js";
import { showEntryForm } from '/views/components/forms/row_forms.js';

const FAKE_PASSWORD = "fake_password_123";

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
    this.show_btn.addEventListener("click",
				   () => this.togglePassword());
    this.deploy_btn.addEventListener("click",
				     () => this.togglePopover());
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
    this.widget.querySelector(".row-user").textContent = this.data.user;
    this.widget.querySelector(".row-email").textContent = this.data.email;
    this.widget.querySelector(".row-pass").textContent = "••••••••";
  }

  
  togglePassword()
  {
    const password_row = this.widget.querySelector(".row-pass");
    if (!this.is_password_visible) {
      password_row.textContent = FAKE_PASSWORD;
      this.show_btn.textContent = "SH";
      this.is_password_visible = true;
    } else {
      password_row.textContent = "••••••••";
      this.show_btn.textContent = "HI";
      this.is_password_visible = false;
    }
  }

  
  togglePopover()
  {
    this.popover.classList.toggle("hidden");
    const closeOnOutsideClick =
	  (event) => {
	    if (!this.popover.contains(event.target) && event.target !== this.deploy_btn) {
              this.popover.classList.add("hidden");
              document.removeEventListener("click", closeOnOutsideClick);
	    }
	  };
    if (!this.popover.classList.contains("hidden")) {
      document.addEventListener("click", closeOnOutsideClick);
    }
  }

  copyPassword()
  {
    navigator.clipboard.writeText(FAKE_PASSWORD)
      .then(() => { showNotifDialog("Success", `Password for ID ${this.data.id} copied!`); })
      .catch(err => { console.error('Failed to copy: ', err); });
    this.popover.classList.add("hidden");
  }
  
  
  editRow()
  {
    //
    let dataForms = {
        ...this.data, 
        password: FAKE_PASSWORD
    }; //
    
    this.popover.classList.add("hidden");
    showEntryForm(
      (updatedData) => {
	this.data =
	  { ...this.data,
	    ...updatedData };
	this.updateView();
	showNotifDialog("Row: " + this.data.id + " edited", "Success");
      },
      dataForms,
      "edit");
  }
  
  
  deleteRow()
  {
    console.log(`Delete row clicked for ID: ${this.data.id}`);
    this.popover.classList.add("hidden");
    showConfirmDialog("Confirm Delete", `Are you sure you want to delete ${this.data.service}?`)
      .then((confirmed) => {
        if (confirmed) {
          this.widget.remove();
          console.log(`Row ${this.data.id} deleted`);
          showNotifDialog("Deleted", `Row ${this.data.id} has been removed.`);
        } else {
          console.log(`Delete cancelled for Row ${this.data.id}`);
        }
      });
  }
}
