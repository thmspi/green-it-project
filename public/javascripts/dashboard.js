document.addEventListener("DOMContentLoaded", () => {
  const openBtn = document.getElementById("open-new-list");
  const modal = document.getElementById("new-list-modal");
  const closeBtn = document.getElementById("close-new-list");
  const overlay = document.querySelector(".modal-overlay");

  openBtn.addEventListener("click", () => modal.classList.remove("hidden"));
  closeBtn.addEventListener("click", () => modal.classList.add("hidden"));
  overlay.addEventListener("click", () => modal.classList.add("hidden"));
});
