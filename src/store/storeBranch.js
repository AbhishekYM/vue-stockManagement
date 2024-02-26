import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import Swal from 'sweetalert2';

export const useStoreBranch = defineStore("storeBranch", () => {
  const errors = reactive({});
  const loading = ref(false);
  const branchDetails = ref([]);
  const showModal = ref(false)
  const showModal1= ref(false) 
  const search = ref('');
  const modalTitle = ref('Create Permissions');
  const confirmText = 'Create';
  const cancelText = 'Cancel';

  const data = [
    { label: 'SRNO', field: 'id',name: 'id', sortable: true,render: (item, index) => index + 1 },
    { label: 'Branch NAME',sortable: true, field: 'name' ,name:'name'},
    { label: 'ACTION', field: 'action',sortable: true,name: 'action' },
  ]
  const form = reactive({
    name: ref(""),
    showSuccessAlert: ref(false),
    showWarningAlert: ref(false),
    alertText: "",
  });

  const handleConfirm = () => {
    storeBranchDetails();
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
 
  async function getBranchDetails() {
    loading.value = true; 
    try {
      const response = await window.axios.get("stockEntries");
      branchDetails.value = response.data.data;
    } finally {
      loading.value = false; 
    }
  }
  async function storeBranchDetails() {
    if (loading.value) return;
    loading.value = true;
    errors.value = {};
    try {
      await window.axios.post("stockEntries", form);
      closeModal();
      getBranchDetails();
      resetForm();
      Swal.fire({
        icon: 'success',
        title: 'Store Branch Details Inserted Successfully!',
        timer: 3000,
        showConfirmButton: true,
      });
      closeModal();
      getBranchDetails();
    }catch (error) {
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
  

 

  async function deletePermissions(permissions) {
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
        await window.axios.delete(`stockEntries/${permissions}`);
        getBranchDetails();
  
        Swal.fire({
          icon: 'success',
          title: 'Permission Deleted Successfully!',
          timer: 3000,
          showConfirmButton: true,
        });
      } catch (error) {
        // Handle error
        Swal.fire({
          icon: 'error',
          title: 'Error Deleting Permission',
          text: 'An error occurred while deleting the permission.',
          showConfirmButton: true,
        });
      }
    } else {
      // User cancelled the deletion
      Swal.fire({
        icon: 'info',
        title: 'Permission Deletion Cancelled',
        timer: 3000,
        showConfirmButton: true,
      });
    }
  }
  

  return {
    closeDelete,
    openModal,showModal,showModal1,closeModal,data,form,errors,
    loading,resetForm,storeBranchDetails,branchDetails,
    getBranchDetails,deletePermissions,
    modalTitle,confirmText,cancelText,
    handleConfirm,handleCancel,search
  };});
