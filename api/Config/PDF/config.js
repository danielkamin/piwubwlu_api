const fonts = {
	Roboto: {
		normal: 'fonts/Roboto-Regular.ttf',
		bold: 'fonts/Roboto-Medium.ttf',
		italics: 'fonts/Roboto-Italic.ttf',
		medium: 'fonts/Roboto-Medium.ttf',
        light:'fonts/Roboto-Light.ttf'
	}
};
const PdfPrinter = require('pdfmake')
const Printer = new PdfPrinter(fonts);

export default Printer
