const imageExtensions = ['.jpg', '.png', '.jpeg', '.webp', '.heic', '.HEIC', '.gif'];

module.exports.checkIfImageFile = fileExtension => imageExtensions.includes(fileExtension);

module.exports.checkIfSvg = fileExtension => fileExtension === '.svg';

module.exports.checkIfPdf = fileExtension => fileExtension === '.pdf';

module.exports.isStringsArray = arr => arr.every(i => typeof i === 'string');
