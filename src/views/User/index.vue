<script setup>
import DataTable from 'datatables.net-vue3';
import DataTablesCore from 'datatables.net-bs5';
import { useAbilityStore } from '/src/store/ability.js'
const abilityStore = useAbilityStore();
// import '../../vendors/choices/choices.min.css';
// import '../../vendors/choices/choices.min.js';
// import '../../vendors/anchorjs/anchor.min.js';
import '../../vendors/list.js/list.min.js';
import '../../vendors/lodash/lodash.min.js';
import '../../assets/js/theme.js';
DataTable.use(DataTablesCore);
import { useUser } from "/src/store/user.js";
import { onMounted, onBeforeUnmount } from "vue";
const store = useUser();
onMounted(() => {
    store.fetchRoles().then(() => {
        const selectElement = document.getElementById('selectedRoles');
        if (selectElement) {
            new Choices(selectElement, {
                removeItemButton: true,
                placeholder: true
            });
        }
    });
    store.fetchUsers();
    store.fetchDesignations().then(() => {
        const designationsSelectElement = document.getElementById('organizerMultipleDesignation');
        if (designationsSelectElement) {
            new Choices(designationsSelectElement, {
                removeItemButton: true,
                placeholder: true
            });
        }
    });
    store.fetchDivisions();
    store.fetchStates().then(() => {
        const estatesSelectElement = document.getElementById('organizerMultipleStates');
        if (estatesSelectElement) {
            new Choices(estatesSelectElement, {
                removeItemButton: true,
                placeholder: true
            });
        }
    });;
});

onBeforeUnmount(store.resetForm);
</script>

<template>
    <button v-if="abilityStore.can('user_create')" class="btn btn-primary" type="button" @click="store.openModal">Create New User</button>
    <Modal :showModal="store.showModal" :confirmText="store.confirmText" :cancelText="store.cancelText" :onConfirm="store.handleConfirm" :onCancel="store.handleCancel">
        <div class="position-absolute top-0 end-0 mt-3 me-3 z-1">
            <button class="btn-close btn btn-sm btn-circle d-flex flex-center transition-base" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <span class="text-weight-bold">User Entry</span><hr>
        <div class="p-4" @click.stop>
            <div class="row">
                <div class="col-lg-9">
                    <div class="row">
                        <div class="col-md-4 mb-3">
                            <label for="name" class="form-label">Name</label>
                            <input type="text" class="form-control" id="name" v-model="store.newUserName">
                        </div>
                        <div class="col-md-4 mb-3">
                            <label for="email" class="form-label">Email</label>
                            <input type="email" class="form-control" id="email" v-model="store.email">
                        </div>
                        <div class="col-md-4 mb-3">
                            <label for="password" class="form-label">Password</label>
                            <input type="password" class="form-control" id="password" v-model="store.password">
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label for="selectedRoles" class="form-label">Select Roles</label>
                            <div v-if="store.roles.length > 0">
                                <select v-model="store.selectedRoles" class="form-select" multiple="multiple" size="1" name="selectedRoles" id="selectedRoles" data-options='{"removeItemButton":true,"placeholder":true}'>
                                    <option value="">Select organizer...</option>
                                    <option v-for="role in store.roles" :key="role.id" :value="role.id">{{ role.title }}</option>
                                </select>
                            </div>
                            <div v-else>
                                Loading roles...
                            </div>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label for="organizerMultipleDesignation">Select Designations</label>
                            <div v-if="store.designations.length > 0">
                                <select v-model="store.selectedDesignation" class="form-select" multiple="multiple" size="1" name="organizerMultipleDesignation" id="organizerMultipleDesignation" data-options='{"removeItemButton":true,"placeholder":true}'>
                                    <option value="">Select designation...</option>
                                    <option v-for="designation in store.designations" :key="designation.id" :value="designation.id">{{ designation.designation_name }}</option>
                                </select>
                            </div>
                            <div v-else>
                                Loading designations...
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label for="selectedDivision" class="form-label">Select Division</label>
                            <select v-model="store.selectedDivision" class="form-select">
                                <option v-for="division in store.divisions" :key="division.id" :value="division.id">{{ division.name }}</option>
                            </select>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label for="organizerMultipleStates" class="form-label">Select Estate</label>
                            <div v-if="store.estates.length > 0">
                                <select v-model="store.selectedEstate" class="form-select" multiple="multiple" size="1" name="organizerMultipleStates" id="organizerMultipleStates" data-options='{"removeItemButton":true,"placeholder":true}'>
                                    <option value="">Select estate...</option>
                                    <option v-for="estate in store.estates" :key="estate.id" :value="estate.id">{{ estate.name }}</option>
                                </select>
                            </div>
                            <div v-else>
                                Loading estates...
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Modal>
    <!-- <button class="btn btn-primary" type="button" data-bs-toggle="modal" data-bs-target="#staticBackdrop">Create New User</button>
<div class="modal fade" id="staticBackdrop" data-bs-keyboard="false" data-bs-backdrop="static" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg mt-7">
      <div class="modal-content border-0 rounded-3">
          <div class="position-absolute top-0 end-0 mt-3 me-3 z-1">
              <button class="btn-close btn btn-sm btn-circle d-flex flex-center transition-base" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body p-0">
              <div class="rounded-top-3 bg-primary text-white py-3 ps-4 pe-6">
                  <h4 class="mb-1" id="staticBackdropLabel">Add New User</h4>
                  <p class="fs-11 mb-0">Added by <a class="link-light fw-semi-bold" href="#!">Antony</a></p>
              </div>
              <div class="p-4">
                  <div class="row">
                      <div class="col-lg-9">
                          <div class="row">
                              <div class="col-md-4 mb-3">
                                  <label for="name" class="form-label">Name</label>
                                  <input type="text" class="form-control" id="name" v-model="store.newUserName">
                              </div>

                              <div class="col-md-4 mb-3">
                                  <label for="email" class="form-label">Email</label>
                                  <input type="email" class="form-control" id="email" v-model="store.email">
                              </div>
                              <div class="col-md-4 mb-3">
                                  <label for="password" class="form-label">Password</label>
                                  <input type="password" class="form-control" id="password" v-model="store.password">
                              </div>
                          </div>

                          <label for="organizerMultiple" class="form-label">Select Roles</label>
                          <div v-if="store.roles.length > 0">
                              <select v-model="store.selectedRoles" class="form-select" multiple="multiple" size="1" name="organizerMultiple" id="organizerMultiple" data-options='{"removeItemButton":true,"placeholder":true}'>
                                  <option value="">Select organizer...</option>
                                  <option v-for="role in store.roles" :key="role.id" :value="role.id">{{ role.title }}</option>
                              </select>
                          </div>
                          <div v-else>
                              Loading roles...
                          </div>
                          <label for="organizerMultipleDesignation">Select Designations</label>
                          <div v-if="store.designations.length > 0">
                              <select v-model="store.selectedDesignation" class="form-select" multiple="multiple" size="1" name="organizerMultipleDesignation" id="organizerMultipleDesignation" data-options='{"removeItemButton":true,"placeholder":true}'>
                                  <option value="">Select designation...</option>
                                  <option v-for="designation in store.designations" :key="designation.id" :value="designation.id">{{ designation.designation_name }}</option>
                              </select>
                          <label for="organizerMultipleStates" class="form-label">Select Estate</label>
                          <div v-if="store.designations.length > 0">
                              <select v-model="store.selectedEstate" class="form-select" multiple="multiple" size="1" name="organizerMultipleStates" id="organizerMultipleStates" data-options='{"removeItemButton":true,"placeholder":true}'>
                                  <option value="">Select estate...</option>
                                  <option v-for="estate in store.estates" :key="estate.id" :value="estate.id">{{ estate.name }}</option>
                              </select>
                          </div>
                          <div v-else>
                              Loading estates...
                          </div>
                          <label for="selectedDivision" class="form-label">Select Division</label>
                          <select v-model="store.selectedDivision" class="form-select">
                              <option v-for="division in store.divisions" :key="division.id" :value="division.id">{{ division.name }}</option>
                          </select>
                              <br>
                          <div class="mb-3 text-center">
                              <button class="btn btn-primary" @click="store.createUser">Submit</button>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  </div>
</div></div> -->
<Modal v-if="store.showModal1" :showModal="store.showModal1" :confirmText="store.editConfirmText" :cancelText="store.editCancelText" :onConfirm="store.handleEditConfirm" :onCancel="store.handleCancel">
    <span class="text-weight-bold">Edit</span>&nbsp; User Details
    <div class="p-4" @click.stop>
      <div class="row">
        <div class="col-lg-9">
          <div class="row">
            <div class="col-md-4 mb-3">
              <label for="name" class="form-label">Name</label>
              <input type="text" class="form-control" id="name" v-model="store.editedUser.name">
            </div>
            <div class="col-md-4 mb-3">
              <label for="email" class="form-label">Email</label>
              <input type="email" class="form-control" id="email" v-model="store.editedUser.email">
            </div>
            <div class="col-md-4 mb-3">
                <label for="RolesorganizerMultiple" class="form-label">Select Roles</label>
                    <select v-model="store.selectedRoles" class="form-select" multiple="multiple" size="1" name="RolesorganizerMultiple" id="RolesorganizerMultiple" data-options='{"removeItemButton":true,"placeholder":true}'>
                        <option v-for="role in store.roles" :key="role.id" :value="role.id">{{ role.title }}</option>
                    </select>
              </div>
          </div>
          <div class="row">
            <div class="col-md-4 mb-3">
                <label for="DesignationorganizerMultiple" class="form-label">Select Designation</label>
                <select v-model="store.selectedDesignation" class="form-select" multiple="multiple" size="1" name="DesignationorganizerMultiple" id="DesignationorganizerMultiple" data-options='{"removeItemButton":true,"placeholder":true}'>
                    <option v-for="designation in store.designations" :key="designation.id" :value="designation.id">{{ designation.designation_name }}</option>
                </select>
            </div>
            <div class="col-md-4 mb-3">
                <label for="division" class="form-label">Division</label>
                <select v-model="store.selectedDivision" class="form-select">
                  <!-- Add options dynamically based on your divisions data -->
                  <option v-for="division in store.divisions" :key="division.id" :value="division.id">{{ division.name }}</option>
                </select>
              </div>
              <div class="col-md-4 mb-3">
                <label for="EstateorganizerMultiple" class="form-label">Select Estate</label>
                <select v-model="store.selectedDesignation" class="form-select" multiple="multiple" size="1" name="EstateorganizerMultiple" id="EstateorganizerMultiple" data-options='{"removeItemButton":true,"placeholder":true}'>
                    <option v-for="estate in store.estates" :key="estate.id" :value="estate.id">{{ estate.name }}</option>
                </select>
                <!-- <label for="estate" class="form-label">Estate</label>
                <select v-model="store.selectedEstate" class="form-select">
                  <option v-for="estate in store.estates" :key="estate.id" :value="estate.id">{{ estate.name }}</option>
                </select> -->
              </div>
          </div>
        </div>
      </div>
    </div>
  </Modal>
  
  
<div id="tableExample3" data-list='{"valueNames":["Name","UNIQUE NAME","EMAIL","DESIGNATION","ROLES","STATES","DIVISION","ACTION"],"page":5,"pagination":true}'>
  <div class="row justify-content-end g-0">
    <div class="col-auto col-sm-5 mb-3">
      <form>
        <div class="input-group">
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
          <th class="text-900 sort" data-sort="uniqueName">UNIQUE NAME</th>
          <th class="text-900 sort" data-sort="email">EMAIL</th>
          <th class="text-900 sort" data-sort="designation">DESIGNATION</th>
          <th class="text-900 sort" data-sort="email">ROLES</th>
          <th class="text-900 sort" data-sort="states">STATES</th>
          <th class="text-900 sort" data-sort="states">DIVISION</th>
          <th class="text-900 sort" data-sort="action">ACTION</th>
        </tr>
      </thead>
      <tbody class="list">
        <tr v-for="(user, index) in store.users" :key="user.id">
          <td class="id">{{ index + 1 }}</td>
          <td class="name">{{ user.name }}</td>
          <td class="uniqueName">{{ user.newName }}</td>
          <td class="email">{{ user.email }}</td>
          <td class="designation">{{ user.designations.map(role => role.designation_name).join(', ') }}</td>
        <td class="roles">{{ user.roles.map(role => role.title).join(', ') }}</td>
        <td class="states">{{ user.states.map(state => state.name).join(', ') }}</td>
        <td class="divisions">{{ user.division ? user.division.name : 'null' }}</td>
        <td class="action">
            <div class="btn-group" role="group">
                <button v-if="abilityStore.can('user_edit')" @click="store.openEditModal(user.id)" class="btn btn-warning btn-sm" title="Edit">
                  <i class="fas fa-edit fa-lg"></i>
                  
                </button>
                
                <button v-if="abilityStore.can('user_delete')" @click="store.deleteUser(user.id)" class="btn btn-danger btn-sm ms-2" title="Delete">
                  <i class="fas fa-trash-alt fa-lg"></i>
                </button>
              </div>     
        </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="d-flex justify-content-center mt-3"><button class="btn btn-sm btn-falcon-default me-1" type="button" title="Previous" data-list-pagination="prev"><span class="fas fa-chevron-left"></span></button>
    <ul class="pagination mb-0"></ul><button class="btn btn-sm btn-falcon-default ms-1" type="button" title="Next" data-list-pagination="next"><span class="fas fa-chevron-right"> </span></button>
  </div>


</div>
         
</template>

<style>
@import 'datatables.net-bs5';

</style>
