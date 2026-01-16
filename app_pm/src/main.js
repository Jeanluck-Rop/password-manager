import { loadHome } from "/views/home_page/home.js";

const { invoke } = window.__TAURI__.core;

window.addEventListener("DOMContentLoaded",
			() => { loadHome(); }
		       );
