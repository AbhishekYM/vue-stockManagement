<script setup>
import { usePermission } from '/src/store/permission.js';
import {  onMounted,onBeforeUnmount,ref } from 'vue';
import { useAbilityStore } from '/src/store/ability.js'
import '../../vendors/list.js/list.min.js';
// import ' /src/js/theme.js'
const abilityStore = useAbilityStore();
const store = usePermission();
onBeforeUnmount(store.resetForm);
onMounted(() => {
  store.getPermissions();
  
});

</script>
<template>
    <button v-if="abilityStore.can('permission_create')" class="btn btn-primary" type="button" @click="store.openModal">Create New Permission</button>
    <Modal :showModal="store.showModal" :confirmText="store.confirmText" :cancelText="store.cancelText" :onConfirm="store.handleConfirm" :onCancel="store.handleCancel">
        <div class="position-absolute top-0 end-0 mt-3 me-3 z-1">
            <button class="btn-close btn btn-sm btn-circle d-flex flex-center transition-base" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <span class="text-weight-bold">Permission Entry</span><hr>
        <div class="p-4" @click.stop>
            <div class="row">
                <div class="col-lg-9">
                    <div class="row">
                            <label for="name" class="form-label">Name</label>
                            <input type="text" class="form-control" id="name" v-model="store.form.title">
                    </div>
                </div>
            </div>
        </div>
    </Modal>
    <Modal v-if="store.showModal1" :showModal="store.showModal1" :confirmText="store.editConfirmText" :cancelText="store.editCancelText" :onConfirm="store.handleEditConfirm" :onCancel="store.handleCancel">
        <span class="text-weight-bold">Edit</span>&nbsp; Permission Details
        <div class="p-4" @click.stop>
            <div class="row">
                <div class="col-lg-9">
                    <div class="row">
                            <label for="name" class="form-label">Name</label>
                            <input type="text" class="form-control" id="name" v-model="store.form.title">
                    </div>
                </div>
            </div>
        </div>
      </Modal>
      <div id="tableExample3" data-list='{"valueNames":["id", "name", "action"],"page":5,"pagination":true}'>
        <div class="row justify-content-end g-0">
          <div class="col-auto col-sm-5 mb-3">
            <form>
              <div class="input-group">
                <!-- Ensure that the data-sort attribute matches the "data-sort" values you defined in the thead -->
                <input class="form-control form-control-sm shadow-none search" type="search" placeholder="Search..." aria-label="search" v-model="searchTerm" />
                <div class="input-group-text bg-transparent">
                  
                  <span class="fa fa-search fs-10 text-600"></span>
                </div>
                
              </div>
            </form>
          </div>
        </div>
        <div class="table-responsive scrollbar">
          <table class="table table-bordered table-striped fs-10 mb-0">
            <thead class="bg-light">
              <tr>
                <th class="text-900 sort" data-sort="id">ID</th>
                <th class="text-900 sort" data-sort="name">Name</th>
                <th class="text-900 sort" data-sort="action">ACTION</th>
              </tr>
            </thead>
            <tbody class="list">
              <!-- Make sure you add the "id" and "name" classes to the corresponding <td> elements -->
              <tr v-for="(permission, index) in store.permissions" :key="permission.id">
                <td class="id">{{ index + 1 }}</td>
                <td class="name">{{ permission.title }}</td>
                <td class="action">
                  <div class="btn-group" role="group">
                    <button v-if="abilityStore.can('permission_edit')" @click="store.getPermission(permission.id)" class="btn btn-warning btn-sm" title="Edit">
                      <i class="fas fa-edit fa-lg"></i>
                    </button>
                    <button v-if="abilityStore.can('permission_delete')" @click="store.deletePermissions(permission.id)" class="btn btn-danger btn-sm ms-2" title="Delete">
                      <i class="fas fa-trash-alt fa-lg"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="d-flex justify-content-center mt-3">
          <button class="btn btn-sm btn-falcon-default me-1" type="button" title="Previous" data-list-pagination="prev">
            <span class="fas fa-chevron-left"></span>
          </button>
          <ul class="pagination mb-0"></ul>
          <button class="btn btn-sm btn-falcon-default ms-1" type="button" title="Next" data-list-pagination="next">
            <span class="fas fa-chevron-right"></span>
          </button>
        </div>
      </div>
       
</template>