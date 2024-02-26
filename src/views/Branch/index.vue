<script setup>
import { useStoreBranch } from '/src/store/storeBranch.js';
import Tabulator from 'tabulator-tables/dist/js/tabulator.min.js';
import { onMounted, ref, watch } from 'vue';

const store = useStoreBranch();
let table; 
const searchQuery = ref(''); 

onMounted(() => {
    store.getBranchDetails().then(() => {
        initializeTable();
    });
});

function initializeTable() {
    table = new Tabulator("#stockTable", { 
        data: store.branchDetails,
        columns: [
            { title: "SRNO", field: "id",width:300, sorter: "number", formatter: "rownum" },
            { title: "Branch NAME",width:300, field: "name", sorter: "string" },
            { title: "Action", field: "action", width: 257, formatter: actionButtonFormatter }
        ]
    });
}
function actionButtonFormatter(cell) {
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "btn btn-danger btn-sm";
    deleteButton.onclick = () => store.deletePermissions(cell.getRow().getData().id); // Call deletePermissions function with ID
    return deleteButton;
}

function searchTable() {
    const value = searchQuery.value.trim(); 
    if (table) { 
        table.setFilter("name", "like", value);
    }
}
watch(() => store.branchDetails, () => {
    if (table) {
        table.replaceData(store.branchDetails);
    }
});
</script>



<template>
    <div style="display: flex; align-items: center;">
        <button class="btn btn-primary" type="button" @click="store.openModal">Create New Branch</button>
        <div style="margin-left: 10px;">
            <input type="text" id="searchInput" v-model="searchQuery" @input="searchTable" class="form-control" placeholder="Enter search term...">
        </div>
    </div>
    <Modal :showModal="store.showModal" :confirmText="store.confirmText" :cancelText="store.cancelText" :onConfirm="store.handleConfirm" :onCancel="store.handleCancel">
        <div class="position-absolute top-0 end-0 mt-3 me-3 z-1">
            <button class="btn-close btn btn-sm btn-circle d-flex flex-center transition-base" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <span class="text-weight-bold">Branch  Entry</span><hr>
        <div class="p-4" @click.stop>
            <div class="row">
                <div class="col-lg-10">
                    <div class="row">
                        <div style="display: flex; align-items: center;">
                            <!-- <label for="name" class="form-label">Name</label> -->
                            <input type="text" class="form-control" id="name" placeholder="Enter Branch Name" v-model="store.form.name">
                    </div>
                        </div>
                </div>
            </div>
        </div>
    </Modal><br>
    
    <div id="stockTable" style="margin-top: 1%;">
</div>

</template>
