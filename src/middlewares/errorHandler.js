const error = ((err, _req, res, _next) => {
  let status = err.status || 500;
  let message = err.message;

  if (err.name === 'CastError') {
    status = 400;
    message = 'Formato de datos inválido';
  } else if (err.code === 11000) {
    status = 409;
    message = 'El email ingresado ya está registrado';
  };

  res.status(status).json({ status: 'error', message: message });

});

export default { error };