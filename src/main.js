import './assets/main.css';
import './bootstrap.js';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import {createStore} from 'vuex';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import App from './App.vue';
import Swal from 'sweetalert2';
import router from './router/index.js';
import $ from 'jquery';
import VueMultiselect from 'vue-multiselect'
import Select2 from 'vue3-select2-component';
import Modal from './components/modals/Modal.vue';
import ability from './services/ability.js';
import { abilitiesPlugin, Can } from '@casl/vue';
import 'tabulator-tables/dist/js/tabulator.min.js';
import 'tabulator-tables/dist/css/tabulator.min.css';
import { AgGridVue } from "ag-grid-vue3";
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css";
// import "bootstrap"
const app = createApp(App);
window.swal = Swal;
window.$ = window.jQuery = $;

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  }
});

window.toast = Toast;
app.use(createPinia());
app.use(createStore);
app.use(router);
app.use(abilitiesPlugin, ability, {
  useGlobalProperties: true,
})
app.component(Can.name,Can);
app.component('font-awesome-icon', FontAwesomeIcon);
app.component('VueMultiselect', VueMultiselect);
app.component('Select2', Select2)
app.component('Modal', Modal)
app.component(AgGridVue);

app.mount('#app');
