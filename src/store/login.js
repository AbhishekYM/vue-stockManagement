import { useAuth } from "/src/store/auth";

import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import Swal from 'sweetalert2';

export const useLogin = defineStore("login", () => {
  const auth = useAuth();
  const errors = reactive({});
  const loading = ref(false);
  const captchaError = ref(false);

  const form = reactive({
    email: "",
    password: "",
    remember: false,
    captchaImageData:"",
    captcha: "",
    captchaKey: "",  
  });

  function resetForm() {
    form.email = "";
    form.password = "";
    form.remember = false;
    form.captcha = "";
    errors.value = {};
  }
  const config = {
    headers: { 'content-type': 'application/json' }
}

async function handleSubmit() {
  console.log('Before Request - Captcha Key:', form.captchaKey);
  console.log('Before Request - Captcha Value:', form.captcha);

  if (loading.value) return;

  loading.value = true;
  errors.value = {};
  
  const formData = {
    email: form.email,
    password: form.password,
    captchaKey: form.captchaKey,
    // captcha: form.captcha
  };
  console.log('Login Form Data:', formData);

  try {
    const response = await window.axios.post("login", formData);
    auth.login(response.data.token);
  } catch (error) {
    if (error.response.data && error.response.data.message === 'validation error') {
      // Validation error, display alert with error messages
      const validationErrors = error.response.data.data;
      let errorMessage = '';

      for (const field in validationErrors) {
        errorMessage += `<span style="color: white;">  ${validationErrors[field][0]}</span><b><hr></b>`;
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
    } else if (error.response.data && error.response.data.message === 'Invalid Captcha') {
      // Invalid Captcha error, display alert with the same styling as validation error
      const invalidCaptchaMessage = `<span style="color: white;">  ${error.response.data.message}</span><b><hr></b>`;
      
      Swal.fire({
        title: 'Error',
        html: invalidCaptchaMessage,
        customClass: {
          container: 'red-bg-alert',
        },
        background: '#A52A2A',
        width: '800px',
      });
    }
    else if (error.response.data && error.response.data.status === 'error') {
      // Other error, display alert
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response.data.message,
      });
    }
    // alert('invalid captcha');
  } finally {
    resetForm();
    form.password = "";
    loading.value = false;
  }
}

 
  return { captchaError,form, errors, loading, resetForm, handleSubmit ,config};
});
