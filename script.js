const CORREO_DEMO = "demo@ejemplo.com";
const CLAVE_DEMO = "Demo1234!";

const CLAVE_STORAGE_CORREO = "correoRecordado";

const form = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const emailError = document.getElementById("email-error");
const passwordError = document.getElementById("password-error");
const rememberCheck = document.getElementById("remember");
const togglePasswordBtn = document.getElementById("togglePassword");
const forgotLink = document.getElementById("forgotLink");
const submitBtn = document.getElementById("submitBtn");
const formMessage = document.getElementById("formMessage");

function validarCorreo() {
  const valor = emailInput.value.trim();

  if (valor === "") {
    return "Ingresa tu correo electrónico.";
  }
 
  const formatoValido = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!formatoValido.test(valor)) {
    return "El formato del correo no es válido. Ejemplo: nombre@correo.com";
  }
  return "";
}

function validarContrasena() {
  const valor = passwordInput.value; 

  if (valor === "") {
    return "Ingresa tu contraseña.";
  }
  if (valor.length < 8) {
    return "La contraseña debe tener al menos 8 caracteres.";
  }
  return "";
}


function mostrarError(input, contenedorError, mensaje) {
  contenedorError.textContent = mensaje;                
  input.setAttribute("aria-invalid", mensaje ? "true" : "false");
}


function revisarCampo(input, contenedorError, funcionValidar) {
  const mensaje = funcionValidar();
  mostrarError(input, contenedorError, mensaje);
  return mensaje === "";
}


function mostrarMensaje(texto, tipo) {
  formMessage.textContent = texto;
  formMessage.className = "message message--" + tipo;
  formMessage.hidden = false;
}

function ocultarMensaje() {
  formMessage.hidden = true;
  formMessage.textContent = "";
}


function cargarCorreoGuardado() {
  try {
    const guardado = localStorage.getItem(CLAVE_STORAGE_CORREO);
    if (guardado) {
      emailInput.value = guardado;
      rememberCheck.checked = true;
    }
  } catch (e) {
  
  }
}

function actualizarCorreoGuardado() {
  try {
    if (rememberCheck.checked) {
      localStorage.setItem(CLAVE_STORAGE_CORREO, emailInput.value.trim());
    } else {
      localStorage.removeItem(CLAVE_STORAGE_CORREO);
    }
  } catch (e) {
    
  }
}



togglePasswordBtn.addEventListener("click", function () {
  const estabaOculta = passwordInput.type === "password";

  passwordInput.type = estabaOculta ? "text" : "password";
  togglePasswordBtn.setAttribute("aria-pressed", String(estabaOculta));
  togglePasswordBtn.setAttribute(
    "aria-label",
    estabaOculta ? "Ocultar contraseña" : "Mostrar contraseña"
  );
});


emailInput.addEventListener("blur", function () {
  revisarCampo(emailInput, emailError, validarCorreo);
});
passwordInput.addEventListener("blur", function () {
  revisarCampo(passwordInput, passwordError, validarContrasena);
});


emailInput.addEventListener("input", function () {
  if (emailInput.getAttribute("aria-invalid") === "true") {
    revisarCampo(emailInput, emailError, validarCorreo);
  }
});
passwordInput.addEventListener("input", function () {
  if (passwordInput.getAttribute("aria-invalid") === "true") {
    revisarCampo(passwordInput, passwordError, validarContrasena);
  }
});

forgotLink.addEventListener("click", function (evento) {
  evento.preventDefault(); 
  mostrarMensaje(
    "Función simulada: en una aplicación real se enviaría un enlace de recuperación a tu correo.",
    "info"
  );
});


form.addEventListener("submit", function (evento) {
  
  evento.preventDefault();
  ocultarMensaje();


  const correoOk = revisarCampo(emailInput, emailError, validarCorreo);
  const claveOk = revisarCampo(passwordInput, passwordError, validarContrasena);

  if (!correoOk || !claveOk) {
    (!correoOk ? emailInput : passwordInput).focus();
    return;
  }

  actualizarCorreoGuardado();
  mostrarMensaje("Datos válidos. Verificando credenciales...", "success");

  submitBtn.disabled = true;
  setTimeout(function () {
    autenticar(emailInput.value.trim(), passwordInput.value);
    submitBtn.disabled = false;
  }, 900);
});

function autenticar(correo, clave) {
  const correoCoincide = correo.toLowerCase() === CORREO_DEMO;
  const claveCoincide = clave === CLAVE_DEMO;

  if (correoCoincide && claveCoincide) {
    mostrarMensaje("¡Bienvenido! Has iniciado sesión correctamente.", "success");
  } else {
    mostrarMensaje("Credenciales incorrectas. Revisa tu correo y tu contraseña.", "error");
  }
}

cargarCorreoGuardado();