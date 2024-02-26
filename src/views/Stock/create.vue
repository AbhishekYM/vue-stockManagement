<script setup>
import { useStoreStock } from '/src/store/storeStock.js';
import { onMounted, onBeforeUnmount, ref } from 'vue';
import { AgGridVue } from "ag-grid-vue3";

const store = useStoreStock();
onBeforeUnmount(store.resetForm);
onMounted(() => {
    store.getBranchDetails();
});
const rowData = ref([
    { stockNo: "", itemCode: "", itemName: "", quantity: "", location: "", branch_id: ""},
]);


function addRow() {
    rowData.value = [...rowData.value, { stockNo: "", itemCode: "", itemName: "", quantity: "", location: "", branch_id: "" }];
}

function submitData() {
    const modifiedData = rowData.value.map(row => ({
        ...row,
        branch_id: row.branch_id.id,
    }));
    console.log(modifiedData);
    store.storeStockDetails(modifiedData);
}

const columnDefs = [
    { headerName: 'Stock No', field: 'stockNo', sortable: true, editable: true },
    { headerName: 'Item Code', field: 'itemCode', sortable: true, editable: true },
    { headerName: 'Item Name', field: 'itemName', sortable: true, editable: true },
    { headerName: 'Quantity', field: 'quantity', sortable: true, editable: true },
    { headerName: 'Location', field: 'location', sortable: true, editable: true },
    { headerName: 'Store Name', field: 'branch_id', sortable: true, editable: true, cellEditor: 'agSelectCellEditor', cellEditorParams: { values: getBranchNames() }, valueGetter: (params) => params.data.branch_id.name }, // Use valueGetter to display name but pass ID
    // { headerName: 'In-Stock Date', field: 'in_stock_date', sortable: true, editable: true },
];

function getBranchNames() {
    return store.branchDetails.map(branch => ({ name: branch.name, id: branch.id }));
}
</script>

<template>
  <div>
    <button class="btn btn-primary" @click="addRow">Add New Record</button>
    <button class="btn btn-primary" @click="submitData">Submit</button>

    <ag-grid-vue
      style="height: 500px"
      class="ag-theme-quartz"
      :columnDefs="columnDefs"
      :rowData="rowData"
    ></ag-grid-vue>
  </div>
</template>
