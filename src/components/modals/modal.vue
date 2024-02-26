<template>
  <div class="modal" :class="{ 'show': showModal }" id="custom-modal" tabindex="-1" role="dialog" aria-hidden="true" @click="onCancel">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-body">
          <slot></slot>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" @click="onConfirm">{{ confirmText }}</button>
          <button type="button" class="btn btn-secondary" @click="onCancel">{{ cancelText }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    showModal: Boolean,
    confirmText: String,
    cancelText: String,
    onConfirm: Function,
    onCancel: Function
  }
};
</script>

<style scoped>
.modal.show {
  display: flex;
}

.modal-dialog {
  max-width: 90%; /* Adjust the max-width as needed */
}

.modal-content {
  width: 100%;
}
</style>
