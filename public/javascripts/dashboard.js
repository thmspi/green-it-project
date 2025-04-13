let multiSelectMode = false;

window.addEventListener('DOMContentLoaded', () => {
  const deleteToggleBtn = document.getElementById("delete-toggle");
  const checkboxes = document.querySelectorAll(".multi-select");
  const createToggle = document.getElementById('create-toggle');
  const deleteToggle = document.getElementById('delete-toggle');
  const popupForm = document.querySelector('.popup-form');

  const fileInput = document.getElementById('image');
  const filenameSpan = document.querySelector('.filename');

if (fileInput) {
  fileInput.addEventListener('change', function () {
    const fileName = this.files[0] ? this.files[0].name : 'No file chosen';
    filenameSpan.textContent = fileName;
  });
}


  console.log("✅ Script loaded");
  console.log("createToggle =", createToggle);
  console.log("deleteToggle =", deleteToggle);

  // Show/hide popup form
  if (createToggle) {
    createToggle.addEventListener('click', () => {
      popupForm.classList.toggle('hidden');
    });
  }

  deleteToggleBtn.addEventListener("click", () => {
    if (!multiSelectMode) {
      checkboxes.forEach(cb => cb.style.display = "inline-block");
    } else {
      const selectedIds = Array.from(checkboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.closest("li").getAttribute("data-id"));

      if (selectedIds.length > 0) {
        fetch("/dashboard/delete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ ids: selectedIds })
        })
        .then(async res => {
          const contentType = res.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            return res.json();
          } else {
            const text = await res.text();
            throw new Error("Expected JSON, got: " + text);
          }
        })
        .then(data => {
          console.log("Deleted:", data);
          window.location.reload();
        })
        .catch(err => console.error("Delete failed:", err));
        
      }
    }
    multiSelectMode = !multiSelectMode;
  });
});
