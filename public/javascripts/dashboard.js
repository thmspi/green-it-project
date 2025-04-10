document.addEventListener('DOMContentLoaded', () => {
  const createToggle = document.getElementById('create-toggle');
  const deleteToggle = document.getElementById('delete-toggle');
  const popupForm = document.querySelector('.popup-form');
  let deleteMode = false;

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

  // Toggle multi-delete mode
  deleteToggle.addEventListener('click', () => {
    deleteMode = !deleteMode;
    console.log("hey", deleteMode);
    console.log("hey");
    console.log(`🗑️ Delete mode: ${deleteMode ? 'ON' : 'OFF'}`);

    const checkboxes = document.querySelectorAll('.multi-select');

    checkboxes.forEach(cb => {
      cb.style.visibility = deleteMode ? 'visible' : 'hidden';
      cb.checked = false;
    });

    if (!deleteMode) {
      const selected = Array.from(checkboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.closest('.todo-item').dataset.id);

      console.log("✅ Selected IDs:", selected);

      if (selected.length > 0) {
        fetch('/dashboard/delete-multiple', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ ids: selected })
        })
          .then(res => {
            if (res.ok) {
              console.log("💥 Delete request sent, reloading...");
              window.location.reload();
            } else {
              console.error("❌ Server responded with error:", res.status);
            }
          })
          .catch(err => {
            console.error("❌ Fetch error:", err);
          });
      } else {
        console.log("⚠️ No items selected for deletion.");
      }
    }
  });
});
