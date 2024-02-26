<script setup>
import { useStoreStock } from '/src/store/storeStock.js';
import Tabulator from 'tabulator-tables/dist/js/tabulator.min.js';
import { onMounted, ref, watch } from 'vue';

const store = useStoreStock();
let table; 
const searchQuery = ref(''); 

onMounted(() => {
    store.getStockDetails().then(() => {
        initializeTable();
    });
});
function initializeTable() {
    table = new Tabulator("#stockTable", { 
        data: store.stockDetails,
        columns: [
            { title: "SRNO", field: "id", sorter: "number", formatter: "rownum" },
            { title: "Branch NAME", field: "branch.name", sorter: "string" }, // Access nested property
            { title: "item code", field: "item_code", sorter: "string" },
            { title: "item name", field: "item_name", sorter: "string" },
            { title: "quantity", field: "quantity", sorter: "string" },
            { title: "location", field: "location", sorter: "string" },
            { title: "in stock date", field: "in_stock_date", sorter: "string" },
            { title: "Action", field: "action", width: 125, formatter: actionButtonFormatter }
        ]
    });
}
function actionButtonFormatter(cell) {
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "btn btn-danger btn-sm";
    deleteButton.onclick = () => store.deleteStocks(cell.getRow().getData().id);
    return deleteButton;
}
function searchTable() {
    const value = searchQuery.value.trim(); 
    if (table) { 
        table.setFilter("item_name", "like", value);
    }
}
watch(() => store.stockDetails, () => {
    if (table) {
        table.replaceData(store.stockDetails);
    }
});
</script>

<template>
    <div style="display: flex; align-items: center;">
        <router-link :to="{ name: 'stockDetails.create' }" class="btn btn-primary">Create New Stock</router-link>
        <div style="margin-left: 10px;">
            <input type="text" id="searchInput" v-model="searchQuery" @input="searchTable" class="form-control" placeholder="Enter search term...">
        </div>
    </div>
    <div id="stockTable" style="margin-top: 1%;">
</div>

</template>
