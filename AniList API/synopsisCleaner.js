function cleaner(synopsis) {
    return synopsis.replace(/<\/?[^>]+>/gi, '');
}

module.exports = {
    cleaner: cleaner
  };  