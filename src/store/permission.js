import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import Swal from 'sweetalert2';

export const usePermission = defineStore("permissions", () => {
  const errors = reactive({});
  const loading = ref(false);
  const permissions = ref([]);
  const showModal = ref(false)
  const showModal1= ref(false) 
  const search = ref('');
  const modalTitle = ref('Create Permissions');
  const confirmText = 'Create';
  const cancelText = 'Cancel';
  const editModalTitle = ref('Edit Permissions');
  const editConfirmText = 'Save';
  const editCancelText = 'Cancel';
  const dialogDelete = ref(false);
  const userToDeleteId = ref(null);

  const data = [
    { label: 'SRNO', field: 'id',name: 'id', sortable: true,render: (item, index) => index + 1 },
    { label: 'PERMISSION NAME',sortable: true, field: 'title' ,name:'title'},
    { label: 'ACTION', field: 'action',sortable: true,name: 'action' },
  ]
  const form = reactive({
    title: ref(""),
    showSuccessAlert: ref(false),
    showWarningAlert: ref(false),
    alertText: "",
  });

  const handleConfirm = () => {
    storePermissions();
  };
  const handleEditConfirm = () => {
   updatePermissions();
  };
  const handleCancel = () => {
   closeModal();
  };
  function confirmDeletePermissions(permissionId) {
    userToDeleteId.value = permissionId;
  dialogDelete.value = true;
  }
  function closeDelete() {
    dialogDelete.value = false;
    userToDeleteId.value = null;
  }
  async function deleteItemConfirm() {
    const permissionId = userToDeleteId.value;
    if (permissionId) {
      await deletePermissions(permissionId);
      closeDelete();
    }
  }  
  function resetForm() {
    form.title = "";
    errors.value = {};
    closeModal();
  }
  function openModal() {
    showModal.value = true

  }
  function closeModal() {
    showModal.value = false
    showModal1.value = false

    form.title = ''; 
  }
 
  async function getPermissions() {
    loading.value = true; // Set loading state to true
    try {
      const response = await window.axios.get("permissions");
      permissions.value = response.data.data;
    } finally {
      loading.value = false; // Set loading state to false when data is loaded
    }
  }
  async function storePermissions() {

    if (loading.value) return;
    const permissionTitle = form.title.trim();
  if (permissionTitle === "") {
    form.showWarningAlert = true;
    form.alertText = 'Permission Name is required. eg: (Permission_Name)';
    return;
  }
    
    //   const isDuplicate = permissions.value.some(permission => permission.title === permissionTitle);
  
    // if (isDuplicate) {
    //   form.showWarningAlert = true;
    //   form.alertText = 'Duplicate Permission Name. Please choose a different name.';
    //   setTimeout(() => {
    //     form.showWarningAlert = false;
    //     form.alertText = '';
    //   }, 5000);
    //   return;
    // }
  
    loading.value = true;
    errors.value = {};
  
    try {
      await window.axios.post("permissions", form);
      closeModal();
      getPermissions();
      Swal.fire({
        icon: 'success',
        title: 'Permission Inserted Successfully!',
        timer: 3000,
        showConfirmButton: true,
      });
      closeModal();
    }catch (error) {
      if (error.response && error.response.data && error.response.data.message === "validation error") {
          const validationData = error.response.data.data;
          let errorMessage = "";
          for (const field in validationData) {
              // errorMessage += `<span style="color: white;"> ${validationData[field].join('\n- ')}</span><b><hr></b>`;
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
  

  async function updatePermissions() {
    if (loading.value) return;
    loading.value = true;
    errors.value = {};
      const permissionId = form.id;
      if (!permissionId) {
      console.error('Permission ID is not defined.');
      loading.value = false;
      return;
    }
     await window.axios.put(`permissions/${permissionId}`, form)
      .then(() => {
        closeModal(); 
        getPermissions();
        Swal.fire({
          icon: 'success',
          title: 'Permission Updated Successfully!',
          timer: 3000,
          showConfirmButton: true,
        });
      })
      .catch((error) => {
        console.error('Error while updating:', error);
        alert('Error while updating');
      })
      .finally(() => {
        loading.value = false;
      });
  }
  
  function getPermission(permissionId) {
    window.axios.get(`permissions/${permissionId}`).then((response) => {
      showModal1.value = true;
      form.title = response.data.data.title;
      form.id = response.data.data.id;
      console.log('Editing permission with title:', form.title);
    });
  }
  
  function confirmDelete(permissions) { 
    if (confirm("Are you sure you want to delete this permission?")) {
      this.deletePermissions(permissions);
    }
  }
  async function deletePermissions(permissions) {
    // Ask for confirmation using SweetAlert
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
      // User confirmed, proceed with deletion
      try {
        await window.axios.delete(`permissions/${permissions}`);
        getPermissions();
  
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
    dialogDelete,closeDelete,deleteItemConfirm,confirmDeletePermissions,
    confirmDelete,openModal,showModal,showModal1,closeModal,data,form,errors,
    loading,resetForm,storePermissions,permissions,getPermissions,
    getPermission,updatePermissions,getPermissions,deletePermissions,
    modalTitle,confirmText,cancelText,editModalTitle,editConfirmText,
    editCancelText,handleConfirm,handleEditConfirm,handleCancel,search
  };});
