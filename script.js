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
setInterval(updateCountdown, 1000);