const error = ((err, _req, res, _next) => {

  let status = err.status || 500;

  if (err.name === 'CastError') {
    status = 400;
  }

  res.status(status).json({ status: 'error', message: err.message });

});

export default { error };