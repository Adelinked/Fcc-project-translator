const americanOnly = require("./american-only.js");
const americanToBritishSpelling = require("./american-to-british-spelling.js");
const americanToBritishTitles = require("./american-to-british-titles.js");
const britishOnly = require("./british-only.js");

function swap(json) {
  var ret = {};
  for (var key in json) {
    ret[json[key]] = key;
  }
  return ret;
}
const britishToAmericanTitles = swap(americanToBritishTitles);
const britishToAmericanSpelling = swap(americanToBritishSpelling);

class Translator {
  validate(text, locale) {
    if (locale == undefined || text == undefined) {
      return "Required field(s) missing";
    }

    if (locale !== "british-to-american" && locale !== "american-to-british") {
      return "Invalid value for locale field";
    }
    if (text.length <= 0) {
      return "No text to translate";
    }

    return true;
  }

  americanToBritish(text) {
    let resultText = " " + text.toLowerCase();
    let arr = Object.keys(americanToBritishTitles);
    for (let w of arr) {
      resultText = resultText.replace(
        w,
        `<span class=\"highlight\">${americanToBritishTitles[w]}</span>`
      );
    }
    arr = Object.keys(americanToBritishSpelling);
    for (let w of arr) {
      let reg = new RegExp("([^a-z])" + w + "([^a-z])", "i");
      resultText = resultText.replace(
        reg,
        `$1<span class=\"highlight\">${americanToBritishSpelling[w]}</span>$2`
      );
    }
    arr = Object.keys(americanOnly);
    for (let w of arr) {
      let reg = new RegExp("([^a-z])" + w + "([^a-z])", "i");
      resultText = resultText.replace(
        reg,
        `$1<span class=\"highlight\">${americanOnly[w]}</span>$2`
      );
    }

    text.split(/[^a-z]/i).forEach((w) => {
      //restore any upercase letter
      if (w?.length > 0 && w[0] === w[0].toUpperCase()) {
        let reg = new RegExp("([^a-z])" + w.toLowerCase() + "([^a-z])", "i");
        resultText = resultText.replace(reg, `$1${w}$2`);
      }
    });
    // translate time from hh:mm to hh.mm
    resultText = resultText.replace(
      /(\d*\d):(\d\d)/g,
      `<span class=\"highlight\">$1.$2</span>`
    );
    return resultText.slice(1);
  }
  //////
  britishToAmerican(text) {
    let resultText = " " + text.toLowerCase();
    let arr = Object.keys(britishToAmericanTitles);
    for (let w of arr) {
      resultText = resultText.replace(
        `${w} `,
        `<span class=\"highlight\">${britishToAmericanTitles[w]}</span> `
      );
    }
    arr = Object.keys(britishToAmericanSpelling);
    for (let w of arr) {
      let reg = new RegExp("([^a-z])" + w + "([^a-z])", "i");
      resultText = resultText.replace(
        reg,
        `$1<span class=\"highlight\">${britishToAmericanSpelling[w]}</span>$2`
      );
    }
    arr = Object.keys(britishOnly);
    for (let w of arr) {
      let reg = new RegExp("([^a-z\\-])" + w + "([^a-z\\-])", "i");
      resultText = resultText.replace(
        reg,
        `$1<span class=\"highlight\">${britishOnly[w]}</span>$2`
      );
    }

    text.split(/[^a-z]/i).forEach((w) => {
      //restore any upercase letter
      if (w?.length > 0 && w[0] === w[0].toUpperCase()) {
        let reg = new RegExp("([^a-z])" + w.toLowerCase() + "([^a-z])", "i");
        resultText = resultText.replace(reg, `$1${w}$2`);
      }
    });
    // translate time from hh:mm to hh.mm
    resultText = resultText.replace(
      /(\d*\d).(\d\d)/g,
      `<span class=\"highlight\">$1:$2</span>`
    );
    return resultText.slice(1);
  }

  translate(text, locale) {
    switch (locale) {
      case "american-to-british":
        return this.americanToBritish(text);
      case "british-to-american":
        return this.britishToAmerican(text);
    }
  }
}
module.exports = Translator;
