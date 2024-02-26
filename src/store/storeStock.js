import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import Swal from 'sweetalert2';
import { useRouter } from "vue-router";

export const useStoreStock = defineStore("storeStock", () => {
  const errors = reactive({});
  const router = useRouter();

  const loading = ref(false);
  const branchDetails = ref([]);
  const stockDetails = ref([]);
  const showModal = ref(false)
  const showModal1= ref(false) 
  const search = ref('');
  const modalTitle = ref('Create ');
  const confirmText = 'Create';
  const cancelText = 'Cancel';

  const data = [
    { headerName: 'Stock No', field: 'stockNo', sortable: true, editable: true },
    { headerName: 'Item Code', field: 'itemCode', sortable: true, editable: true },
    { headerName: 'Item Name', field: 'itemName', sortable: true, editable: true },
    { headerName: 'Quantity', field: 'quantity', sortable: true, editable: true },
    { headerName: 'Location', field: 'location', sortable: true, editable: true },
    { headerName: 'Store Name', field: 'store_name', sortable: true, editable: true },
    { headerName: 'In-Stock Date', field: 'in_stock_date', sortable: true, editable: true },
  ]
  const form = reactive({
    branch_id: ref(""),
    item_code: "",
    item_name:"",
    quantity:"",
    location:"",
    in_stock_date:"",
    showSuccessAlert: ref(false),
    showWarningAlert: ref(false),
    alertText: "",
  });

  const handleConfirm = () => {
    storeStockDetails();
  };
  
  const handleCancel = () => {
   closeModal();
  };
  
  function closeDelete() {
  }
    
  function resetForm() {
    form.name = "";
    errors.value = {};
    closeModal();
  }
  function openModal() {
    showModal.value = true
  }
  function closeModal() {
    showModal.value = false
    showModal1.value = false

    form.name = ''; 
  }
 
  async function getStockDetails() {
    loading.value = true; 
    try {
      const response = await window.axios.get("stockMasters");
      stockDetails.value = response.data.data;
    } finally {
      loading.value = false; 
    }
  }
  async function getBranchDetails() {
    loading.value = true; 
    try {
      const response = await window.axios.get("stockEntries");
      branchDetails.value = response.data.data;
    } finally {
      loading.value = false; 
    }
  }
  async function storeStockDetails(rowData) {
    if (loading.value) return;
    loading.value = true;
    errors.value = {};
    try {
        const stockIds = rowData.map(item => {
            return {
                branch_id: item.branch_id,
                item_code: item.itemCode,
                item_name: item.itemName,
                quantity: item.quantity,
                location: item.location,
            };
        });

        const data = { stock_ids: stockIds }; // Ensure the key is named stock_ids
        await window.axios.post("stockMasters", data);
        closeModal();
        getStockDetails();
        
        resetForm();
        Swal.fire({
            icon: 'success',
            title: 'Store Branch Details Inserted Successfully!',
            timer: 3000,
            showConfirmButton: true,
        });
        closeModal();
        getStockDetails();
        router.push({ name: 'stockDetails' }); // Assuming 'stockDetails' is the name of your route


    } catch (error) {
        if (error.response && error.response.data && error.response.data.message === "validation error") {
            const validationData = error.response.data.data;
            let errorMessage = "";
            for (const field in validationData) {
                errorMessage += `<span style="color: white;">  ${validationData[field][0]}</span><b><hr></b>`;
            }
            Swal.fire({
                title: 'Validation Error',
                html: errorMessage,
                customClass: {
                    container: 'red-bg-alert',
                },
                background: '#A52A2A',
                width: '800px',
            });
            closeModal();
        }
        else if (error.response && error.response.data && error.response.data.errors) {
            // Extract and format validation error messages
            const errorMessages = error.response.data.errors;
            let errorMessage = 'Validation Error: <br>';
            for (const field in errorMessages) {
                errorMessage += `<span style="color: white;"> ${errorMessages[field].join(', ')}</span><br>`;
            }
            Swal.fire({
                title: 'Validation Error',
                html: errorMessage,
                customClass: {
                    container: 'red-bg-alert',
                },
                background: '#A52A2A',
                width: '800px',
            });
            closeModal();
        } else {
            // Swal.fire({
            //   icon: 'error',
            //   title: 'Error',
            //   text: 'An error occurred while creating the user.',
            // });
            closeModal();
        }
    }
}


 

  async function deleteStocks(stocks) {
    const confirmationResult = await Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });
  
    if (confirmationResult.isConfirmed) {
      try {
        await window.axios.delete(`stockMasters/${stocks}`);
        getStockDetails();
  
        Swal.fire({
          icon: 'success',
          title: 'Stocks Deleted Successfully!',
          timer: 3000,
          showConfirmButton: true,
        });
      } catch (error) {
        // Handle error
        Swal.fire({
          icon: 'error',
          title: 'Error Deleting ',
          text: 'An error occurred while deleting the .',
          showConfirmButton: true,
        });
      }
    } else {
      // User cancelled the deletion
      Swal.fire({
        icon: 'info',
        title: ' Deletion Cancelled',
        timer: 3000,
        showConfirmButton: true,
      });
    }
  }
  

  return {
    closeDelete,
    openModal,showModal,showModal1,closeModal,data,form,errors,
    loading,resetForm,storeStockDetails,branchDetails,stockDetails,
    getBranchDetails,deleteStocks,getStockDetails,
    modalTitle,confirmText,cancelText,
    handleConfirm,handleCancel,search
  };});
