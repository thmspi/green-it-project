document.addEventListener('DOMContentLoaded', () => {
  const createToggle = document.getElementById('create-toggle');
  const deleteToggle = document.getElementById('delete-toggle');
  const popupForm = document.querySelector('.popup-form');
  const checkboxes = document.querySelectorAll('.multi-select');
  let deleteMode = false;

  // Show/hide popup form
  createToggle.addEventListener('click', () => {
    popupForm.classList.toggle('hidden');
  });

  // Toggle multi-delete mode
  deleteToggle.addEventListener('click', () => {
    deleteMode = !deleteMode;
    checkboxes.forEach(cb => {
      cb.style.display = deleteMode ? 'inline-block' : 'none';
      cb.checked = false;
    });

    if (!deleteMode) {
      // Collect selected IDs and send to delete
      const selected = Array.from(checkboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.closest('.todo-item').dataset.id);

      if (selected.length > 0) {
        fetch('/dashboard/delete-multiple', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ ids: selected })
        }).then(() => window.location.reload());
      }
    }
  });
});
