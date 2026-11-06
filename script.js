const music = document.getElementById("weddingMusic");
const cover = document.getElementById("cover");
const invitation = document.getElementById("invitation");
const openBtn = document.getElementById("openInvitation");
const toggle = document.getElementById("musicToggle");
const record = document.querySelector(".record");
const status = document.getElementById("musicStatus");

const params = new URLSearchParams(location.search);
const nombre = (params.get("nombre") || "").trim();
const cupos = (params.get("cupos") || "").trim();
const esReconfirmacion = params.get("reconfirmar") === "true";

// URL de tu aplicación web de Google Apps Script
const GOOGLE_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxkltJ2OGT3ln3DaivyoR7xoWPcD-95rbRaQftia6npKqRufnNar7uaOtOgJb-diuCO/exec";

// ==========================================================================
// 1. LÓGICA DE RECONFIRMACIÓN (10 DÍAS ANTES) VS VISTA NORMAL
// ==========================================================================

window.addEventListener("DOMContentLoaded", () => {
  if (esReconfirmacion) {
    transformarPaginaParaReconfirmacion();
  } else {
    setGuestText();
  }
});

function setGuestText() {
  const guest = nombre ? decodeURIComponent(nombre.replace(/\+/g, " ")) : "Para ti";
  
  // 1. En la portada: Solo actualizamos el nombre del invitado
  const guestNameEl = document.getElementById("guestName");
  if (guestNameEl) guestNameEl.textContent = guest;
  
  // 2. En la sección principal: Actualizamos nombre y cantidad de cupos
  const guestName2El = document.getElementById("guestName2");
  if (guestName2El) guestName2El.textContent = guest;
  
  const guestSeats2El = document.getElementById("guestSeats2");
  if (guestSeats2El) guestSeats2El.textContent = cupos ? cupos : "Por confirmar";
  
  
// 3. Enlace dinámico para WhatsApp (Directo a tu número)
  const telEsteban = "573163826366";
  
  // Determinamos si el mensaje debe ir en plural (más de 1 cupo)
  const esPlural = cupos && Number(cupos) > 1;

  const saludo = esPlural ? `¡Hola, Esteban y Dayana! Somos ${guest}.` : `¡Hola, Esteban y Dayana! Soy ${guest}.`;
  const accion = esPlural ? "Confirmamos nuestra asistencia" : "Confirmo mi asistencia";
  const cierre = esPlural ? "¡Ahí estaremos para celebrar con ustedes!" : "¡Ahí estaré para celebrar con ustedes!";
  const detalleCupos = cupos ? ` haciendo uso de la reserva asignada (${cupos} cupo${esPlural ? 's' : ''})` : '';

  const msg = `${saludo} ${accion} a su boda este 19 de diciembre de 2026${detalleCupos}. ${cierre}`;

  const btnWhatsapp = document.getElementById("whatsappBtn");
  if (btnWhatsapp) {
    btnWhatsapp.href = `https://wa.me/${telEsteban}?text=${encodeURIComponent(msg)}`;
    
    // Listener para registrar el "SI" de forma automática y silenciosa al hacer clic
    btnWhatsapp.addEventListener("click", () => {
      if (nombre) {
        const confirmationUrl = `${GOOGLE_WEB_APP_URL}?action=confirmar&nombre=${encodeURIComponent(nombre)}`;
        fetch(confirmationUrl, { method: "GET", mode: "no-cors" }).catch(err => {
          console.log("Registro de asistencia enviado en segundo plano");
        });
      }
    });
  }
}

function transformarPaginaParaReconfirmacion() {
  const guest = nombre ? decodeURIComponent(nombre.replace(/\+/g, " ")) : "Invitado";
  
  // Calculamos los cupos y el plural basándonos en el parámetro 'cupos' de la URL
  const totalCupos = cupos ? parseInt(cupos, 10) : 1;
  const esPlural = (totalCupos > 1) || (guest.toLowerCase().includes(' y ') || guest.includes('&'));

  const textoBienvenida = esPlural ? '"Queremos contar con ustedes"' : '"Queremos contar contigo"';
  const textoParrafo = esPlural 
    ? "Ya casi llega el momento más feliz de nuestras vidas, nos ilusiona enormemente saber que nos acompañarán a celebrar este gran día. Ayúdanos a afinar los últimos detalles confirmando su asistencia."
    : "Ya casi llega el momento más feliz de nuestras vidas, nos ilusiona enormemente saber que nos acompañarás a celebrar este gran día. Ayúdanos a afinar los últimos detalles confirmando tu asistencia.";

  // Ocultamos la portada si existe y mostramos el contenedor principal
  if (cover) cover.style.display = "none";
  if (invitation) {
    invitation.classList.add("visible");
    invitation.setAttribute("aria-hidden", "false");
  }
  document.body.classList.add("opened");

  // Reemplazamos el contenido por la tarjeta de reconfirmación exclusiva con los bloques separados
  invitation.innerHTML = `
    <section class="dark-section" style="min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px;">
      <div class="section-inner" style="background: rgba(18, 16, 15, 0.95); border: 1px solid rgba(226, 189, 136, 0.4); border-radius: 20px; padding: 40px 25px; box-shadow: 0 10px 40px rgba(0,0,0,0.8); max-width: 500px; width: 100%; text-align: center;">
        
        <!-- Bloque 1: Se oculta al confirmar -->
        <div id="reconfirmFormBlock">
           <div class="dress-footer-note" style="color: #efd8b5; letter-spacing: 0.3em; margin-bottom: 5px; font-size: 20px; font-family: 'Cormorant Garamond', serif;">¡${guest}!</div>
          
          <h2 style="font-family: 'Cormorant Garamond', serif; font-size: 18px; color: #fff7eb; margin-bottom: 8px; font-style: normal;">
            ${textoBienvenida}
          </h2>
          
          <div class="ornament" style="margin-bottom: 05px;"><span></span>♡<span></span></div>
          
          <p style="font-size: 18px; line-height: 1.6; margin-bottom: 30px; color: #f7f0e6; text-align: center;">
            ${textoParrafo}
          </p>

          <div id="reconfirmBox">
            <button id="btnReconfirmarAccion" class="cream-btn" style="width: 100%; justify-content: center; font-size: 13px; padding: 18px; cursor: pointer;">
              ✓ &nbsp; ${esPlural ? 'CONFIRMAMOS NUESTRA ASISTENCIA' : 'CONFIRMO MI ASISTENCIA'}
            </button>
          </div>
        </div>

        <!-- Bloque 2: Éxito (Icono de fiesta, mensaje limpio y serpentinas) -->
        <div id="reconfirmSuccess" style="display: none; animation: fadeIn 1s ease forwards; padding: 10px 0;">
          <div style="font-size: 55px; margin-bottom: 15px;">🎉</div>
          <h3 id="successTitle" style="font-size: 24px; color: #fff7eb; font-weight: 400; margin-bottom: 15px; font-family: 'Cormorant Garamond', serif; line-height: 1.4;"></h3>
          <p style="font-size: 18px; font-style: italic; color: #e2bd88; line-height: 1.5; margin-top: 15px;">
            ¡Nos vemos el 19 de diciembre!
          </p>
        </div>

      </div>
    </section>
  `;

  // Listener para ejecutar el evento de reconfirmación al presionar el botón
  setTimeout(() => {
    const btnAccion = document.getElementById("btnReconfirmarAccion");
    if (btnAccion) {
      btnAccion.addEventListener("click", async () => {
        btnAccion.disabled = true;
        btnAccion.textContent = "REGISTRANDO...";

        let finalCupos = totalCupos;

        try {
          const response = await fetch(`${GOOGLE_WEB_APP_URL}?action=reconfirmar&nombre=${encodeURIComponent(nombre)}`);
          const data = await response.json();
          if (data && data.cupos) {
            finalCupos = parseInt(data.cupos);
          }
        } catch (e) {
          console.log("Reconfirmación enviada / fallback de red");
        }

        // Ocultamos el bloque inicial y mostramos únicamente el mensaje de éxito limpio
        document.getElementById("reconfirmFormBlock").style.display = "none";
        const successDiv = document.getElementById("reconfirmSuccess");
        successDiv.style.display = "block";

        const mensajeFinal = finalCupos === 1
          ? "Muchas gracias, estamos ansiosos de compartir este día contigo."
          : "Muchas gracias, estamos ansiosos de compartir este día con ustedes.";

        document.getElementById("successTitle").textContent = mensajeFinal;

        // Disparar animación festiva de serpentinas/confeti
        if (typeof confetti === 'function') {
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#e2bd88', '#ffffff', '#efd8b5', '#ffd700', '#ff6b6b']
          });
        }
      });
    }
  }, 100);
}

// ==========================================================================
// 2. CONTROL DE INTERFAZ Y REPRODUCTOR MULTIMEDIA
// ==========================================================================

if (openBtn) {
  openBtn.addEventListener("click", async () => {
    cover.classList.add("is-open");
    invitation.classList.add("visible");
    invitation.setAttribute("aria-hidden", "false");
    document.body.classList.add("opened");

    try {
      if (music) {
        await music.play();
        if (toggle) toggle.textContent = "❚❚";
        if (status) status.textContent = "Reproduciendo nuestra canción";
      }
    } catch (e) {
      if (status) status.textContent = "Toca ▶ para reproducir nuestra canción";
    }
    setTimeout(() => {
      const invEl = document.getElementById("invitation");
      if (invEl) invEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
  });
}

if (toggle) {
  toggle.addEventListener("click", async () => {
    if (!music) return;
    if (music.paused) {
      await music.play();
      toggle.textContent = "❚❚";
      if (record) record.classList.remove("paused");
      if (status) status.textContent = "Reproduciendo nuestra canción";
    } else {
      music.pause();
      toggle.textContent = "▶";
      if (record) record.classList.add("paused");
      if (status) status.textContent = "Canción en pausa";
    }
  });
}

// ==========================================================================
// 3. CUENTA REGRESIVA
// ==========================================================================

const target = new Date("2026-12-19T16:00:00-05:00").getTime();

function updateCountdown() {
  let diff = target - Date.now();
  if (diff < 0) diff = 0;
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  const values = [d, h, m, s].map(v => String(v).padStart(2, "0"));
  
  const elements = document.querySelectorAll("#countdown b");
  if (elements.length >= 4) {
    elements.forEach((el, i) => el.textContent = values[i]);
  }
}

updateCountdown();
setInterval(updateCountdown, 1000);

/*const music = document.getElementById("weddingMusic");
const cover = document.getElementById("cover");
const invitation = document.getElementById("invitation");
const openBtn = document.getElementById("openInvitation");
const toggle = document.getElementById("musicToggle");
const record = document.querySelector(".record");
const status = document.getElementById("musicStatus");

const params = new URLSearchParams(location.search);
const nombre = (params.get("nombre") || "").trim();
const cupos = (params.get("cupos") || "").trim();

// Reemplaza esta URL con la "URL de la aplicación web" real que te de Google Apps Script al desplegar
const GOOGLE_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbx4sFH8Nm1vcJ0ghsf_kFeY-ScfDl0Okw90xyEM7YkGFlKY9R5kuGwJ1J1Z0AylTgcC/exec";

function setGuestText() {
  const guest = nombre ? decodeURIComponent(nombre.replace(/\+/g, " ")) : "Para ti";
  
  // 1. En la portada: Solo actualizamos el nombre del invitado
  document.getElementById("guestName").textContent = guest;
  
  // 2. En la sección principal: Actualizamos nombre y cantidad de cupos
  document.getElementById("guestName2").textContent = guest;
  document.getElementById("guestSeats2").textContent = cupos ? cupos : "Por confirmar";
  
  // 3. Enlace dinámico para WhatsApp (Directo a tu número)
  const telEsteban = "573163826366";

  const msg = `¡Hola, Esteban y Dayana! Soy ${guest}. Confirmo mi asistencia a su boda este 19 de diciembre de 2026${cupos ? ` haciendo uso de la reserva asignada (${cupos} cupo${cupos > 1 ? 's' : ''})` : ''}. ¡Ahí estaré para celebrar con ustedes!`;

  const btnWhatsapp = document.getElementById("whatsappBtn");
  if (btnWhatsapp) {
    btnWhatsapp.href = `https://wa.me/${telEsteban}?text=${encodeURIComponent(msg)}`;
    
    // Añadimos un listener para registrar el "SI" de forma automática y silenciosa al hacer clic
    btnWhatsapp.addEventListener("click", () => {
      if (nombre) {
        // Petición silenciosa a Google Sheets en segundo plano
        const confirmationUrl = `${GOOGLE_WEB_APP_URL}?action=confirmar&nombre=${encodeURIComponent(nombre)}`;
        fetch(confirmationUrl, { method: "GET", mode: "no-cors" }).catch(err => {
          console.log("Registro de asistencia enviado en segundo plano");
        });
      }
    });
  }
}
setGuestText();

openBtn.addEventListener("click", async () => {
  cover.classList.add("is-open");
  invitation.classList.add("visible");
  invitation.setAttribute("aria-hidden", "false");
  document.body.classList.add("opened");

  // La reproducción se inicia directamente por el clic del usuario
  try {
    await music.play();
    toggle.textContent = "❚❚";
    status.textContent = "Reproduciendo nuestra canción";
  } catch (e) {
    status.textContent = "Toca ▶ para reproducir nuestra canción";
  }
  setTimeout(() => document.getElementById("invitation").scrollIntoView({ behavior: "smooth", block: "start" }), 120);
});

toggle.addEventListener("click", async () => {
  if (music.paused) {
    await music.play();
    toggle.textContent = "❚❚";
    record.classList.remove("paused");
    status.textContent = "Reproduciendo nuestra canción";
  } else {
    music.pause();
    toggle.textContent = "▶";
    record.classList.add("paused");
    status.textContent = "Canción en pausa";
  }
});

const target = new Date("2026-12-19T16:00:00-05:00").getTime();
function updateCountdown() {
  let diff = target - Date.now();
  if (diff < 0) diff = 0;
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  const values = [d, h, m, s].map(v => String(v).padStart(2, "0"));
  document.querySelectorAll("#countdown b").forEach((el, i) => el.textContent = values[i]);
}
updateCountdown();
setInterval(updateCountdown, 1000);*/