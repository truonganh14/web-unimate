const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContact(req, res, next) {
  const { name, email, phone, subject, message } = req.body ?? {};
  const errors = [];

  if (typeof name !== 'string' || !name.trim()) {
    errors.push('name is required');
  } else if (name.trim().length > 100) {
    errors.push('name must be at most 100 characters');
  }

  if (typeof email !== 'string' || !email.trim()) {
    errors.push('email is required');
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.push('email is invalid');
  }

  if (typeof phone !== 'string' || !phone.trim()) {
    errors.push('phone is required');
  } else if (phone.trim().length > 20) {
    errors.push('phone must be at most 20 characters');
  }

  if (typeof subject !== 'string' || !subject.trim()) {
    errors.push('subject is required');
  } else if (subject.trim().length > 200) {
    errors.push('subject must be at most 200 characters');
  }

  if (typeof message !== 'string' || !message.trim()) {
    errors.push('message is required');
  } else if (message.trim().length < 10) {
    errors.push('message must be at least 10 characters');
  } else if (message.trim().length > 2000) {
    errors.push('message must be at most 2000 characters');
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  req.validatedContact = {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    subject: subject.trim(),
    message: message.trim(),
  };

  next();
}
