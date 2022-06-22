const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server.js");

chai.use(chaiHttp);

let Translator = require("../components/translator.js");
const translator = new Translator();

suite("Functional Tests", () => {
  let text;
  //#24
  test("Translation with text and locale fields: POST request to /api/translate", function (done) {
    text = "Mangoes are my favorite fruit.";
    chai
      .request(server)
      .post("/api/translate")
      .send({ text: text, locale: "american-to-british" })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.text, text);
        assert.equal(
          res.body.translation,
          `Mangoes are my <span class=\"highlight\">favourite</span> fruit.`
        );
        done();
      });
  });
  //#25
  test("Translation with text and invalid locale field: POST request to /api/translate", function (done) {
    text = "Some text to translate.";
    chai
      .request(server)
      .post("/api/translate")
      .send({ text: text, locale: "french-to-german" })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, `Invalid value for locale field`);
        done();
      });
  });
  //#26
  test("Translation with missing text field: POST request to /api/translate", function (done) {
    chai
      .request(server)
      .post("/api/translate")
      .send({ locale: "french-to-german" })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, `Required field(s) missing`);
        done();
      });
  });
  //#27
  test("Translation with missing locale field: POST request to /api/translate", function (done) {
    chai
      .request(server)
      .post("/api/translate")
      .send({ text: "Some text to translate" })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, `Required field(s) missing`);
        done();
      });
  });
  //#28
  test("Translation with empty text: POST request to /api/translate", function (done) {
    chai
      .request(server)
      .post("/api/translate")
      .send({ text: "", locale: "american-to-british" })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, `No text to translate`);
        done();
      });
  });
  //#29
  test("Translation with text that needs no translation: POST request to /api/translate", function (done) {
    text = "Some text that needs no translate";
    chai
      .request(server)
      .post("/api/translate")
      .send({
        text: text,
        locale: "american-to-british",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.text, text);
        assert.equal(res.body.translation, `Everything looks good to me!`);
        done();
      });
  });
});
