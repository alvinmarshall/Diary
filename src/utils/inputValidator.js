module.exports = {
  registerValidation: req => {
    const errors = [];

    if (!req.body.username) {
      errors.push({ text: "provide your username" });
    }

    if (!req.body.f_name) {
      errors.push({ text: "provide your first name" });
    }

    if (!req.body.l_name) {
      errors.push({ text: "provide your last name" });
    }

    if (!req.body.email) {
      errors.push({ text: "provide email address" });
    }

    if (!req.body.password) {
      errors.push({ text: "provide your password" });
    }

    if (req.body.password.length < 4) {
      errors.push({ text: "password must be aleast 4 characters" });
    }
    if (req.body.password !== req.body.confirm_password) {
      errors.push({ text: "password match" });
    }
    return errors;
  }
};
