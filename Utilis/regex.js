function replaceDPDWithShiphit(text) {
  return text.replace(/(explus|dpd)/gi, "SHIPHIT");
}

export default { replaceDPDWithShiphit: replaceDPDWithShiphit };