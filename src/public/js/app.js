// Modal de confirmação de exclusão
function confirmarExclusao(id) {
  const modal = document.getElementById('modalExclusao');
  const form = document.getElementById('formExclusao');
  if (modal && form) {
    form.action = `/medicoes/${id}/excluir`;
    modal.style.display = 'flex';
  }
}

function cancelarExclusao() {
  const modal = document.getElementById('modalExclusao');
  if (modal) modal.style.display = 'none';
}

// Fechar modal ao clicar fora
document.addEventListener('click', (e) => {
  const modal = document.getElementById('modalExclusao');
  if (modal && e.target === modal) {
    modal.style.display = 'none';
  }
});

// Auto-hide alertas
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.alerta').forEach(el => {
    setTimeout(() => {
      el.style.transition = 'opacity 0.5s';
      el.style.opacity = '0';
      setTimeout(() => el.remove(), 500);
    }, 4000);
  });
});
