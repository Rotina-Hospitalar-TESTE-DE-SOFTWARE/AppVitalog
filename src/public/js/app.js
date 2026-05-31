// Confirmação de exclusão
function confirmarExclusao(id) {
  const modal = document.getElementById('modalExclusao');
  const form = document.getElementById('formExclusao');
  form.action = `/medicoes/${id}/excluir`;
  modal.style.display = 'flex';
}

function cancelarExclusao() {
  document.getElementById('modalExclusao').style.display = 'none';
}

// Filtro de tabela
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchInput');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const rows = document.querySelectorAll('#medicaoTable tbody tr');

  let currentFilter = 'all';
  let currentSearch = '';

  function applyFilters() {
    rows.forEach(row => {
      const tipo = row.dataset.tipo || '';
      const text = row.textContent.toLowerCase();
      const matchFilter = currentFilter === 'all' || tipo === currentFilter;
      const matchSearch = !currentSearch || text.includes(currentSearch);
      row.style.display = matchFilter && matchSearch ? '' : 'none';
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', e => {
      currentSearch = e.target.value.toLowerCase();
      applyFilters();
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      applyFilters();
    });
  });

  // Auto-hide alerts
  document.querySelectorAll('.alert').forEach(alert => {
    setTimeout(() => {
      alert.style.transition = 'opacity 0.5s';
      alert.style.opacity = '0';
      setTimeout(() => alert.remove(), 500);
    }, 4000);
  });
});
