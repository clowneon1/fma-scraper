function sanitizeFileName(name) {
  return name
    .replace(/[<>:"/\\|?*]+/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

module.exports = {
  sanitizeFileName,
};
