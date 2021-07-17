const fonts = {
	Roboto: {
		normal: 'api/config/PDF/Fonts/Roboto-Regular.ttf',
		bold: 'api/config/PDF/Fonts/Roboto-Medium.ttf',
		italics: 'api/config/PDF/Fonts/Roboto-Italic.ttf',
		medium: 'api/config/PDF/Fonts/Roboto-Medium.ttf',
        light:'api/config/PDF/Fonts/Roboto-Light.ttf'
	}
};
const PdfPrinter = require('pdfmake')

const Printer = new PdfPrinter(fonts);


module.exports= Printer
