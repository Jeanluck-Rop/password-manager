import { loadHome } from "/views/home_page/home.js";

const { invoke } = window.__TAURI__.core;

//const invoke = window.__TAURI__.core.invoke;
//invoke('init_manager');

window.addEventListener("DOMContentLoaded",
			() => { loadHome(); }
		       );
