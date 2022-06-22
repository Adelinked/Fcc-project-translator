"use strict";

const Translator = require("../components/translator.js");

module.exports = function (app) {
  const translator = new Translator();

  app.route("/api/translate").post((req, res) => {
    const { text, locale } = req.body;

    const validation = translator.validate(text, locale);
    if (validation === true) {
      const translation = translator.translate(text, locale);
      if (translation !== text) {
        res.json({ text, translation: translation });
      } else {
        res.json({ text, translation: "Everything looks good to me!" });
      }
    } else {
      res.json({ error: validation });
    }
  });
};
