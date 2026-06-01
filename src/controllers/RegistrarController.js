function formatDateTimeLocal(iso) {
  const d = new Date(iso);
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

class RegistrarController {
  index(req, res) {
    res.render('registrar/index', {
      title: 'Registrar',
      userName: req.session.userName,
      activeRegistrar: true,
      dataHoraAtual: formatDateTimeLocal(new Date().toISOString()),
      errors: req.flash('error'),
      success: req.flash('success')
    });
  }
}

module.exports = new RegistrarController();
