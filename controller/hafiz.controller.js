const uniData = [
	{
		id: '1',
		image: 'https://res.cloudinary.com/ssani7/image/upload/v1720196595/hafiz/diu.png',
		shortName: 'DIU',
		fullName: 'Daffodil International University',
	},
	{
		id: '2',
		image: 'https://res.cloudinary.com/ssani7/image/upload/v1720196595/hafiz/buet.png',
		shortName: 'BUET',
		fullName: 'Bangladesh University of Engineering and Technology',
	},
	{
		id: '3',
		image: 'https://res.cloudinary.com/ssani7/image/upload/v1720196595/hafiz/du.png',
		shortName: 'DU',
		fullName: 'University of Dhaka',
	},
	{
		id: '4',
		image: 'https://res.cloudinary.com/ssani7/image/upload/v1720196595/hafiz/ju.png',
		shortName: 'JU',
		fullName: 'Jahangirnagar University',
	},
	{
		id: '5',
		image: 'https://res.cloudinary.com/ssani7/image/upload/v1720196595/hafiz/nsu.png',
		shortName: 'NSU',
		fullName: 'North South University',
	},
	{
		id: '6',
		image: 'https://res.cloudinary.com/ssani7/image/upload/v1720196595/hafiz/bup.png',
		shortName: 'BUP',
		fullName: 'Bangladesh University of Professionals',
	},
	{
		id: '7',
		image: 'https://res.cloudinary.com/ssani7/image/upload/v1720196595/hafiz/aiub.png',
		shortName: 'AIUB',
		fullName: 'American International University-Bangladesh',
	},
	{
		id: '8',
		image: 'https://res.cloudinary.com/ssani7/image/upload/v1720196595/hafiz/bracu.png',
		shortName: 'BRAC',
		fullName: 'BRAC University',
	},
	{
		id: '9',
		image: 'https://res.cloudinary.com/ssani7/image/upload/v1720196595/hafiz/iub.png',
		shortName: 'IUB',
		fullName: 'Independent University, Bangladesh',
	},
	{
		id: '10',
		image: 'https://res.cloudinary.com/ssani7/image/upload/v1720196595/hafiz/ewu.png',
		shortName: 'EWU',
		fullName: 'East West University',
	},
	{
		id: '11',
		image: 'https://res.cloudinary.com/ssani7/image/upload/v1720196595/hafiz/city.png',
		shortName: 'SCU',
		fullName: 'City University',
	},
	{
		id: '12',
		image: 'https://res.cloudinary.com/ssani7/image/upload/v1720196595/hafiz/gub.png',
		shortName: 'GUB',
		fullName: 'Green University Bangladesh',
	},
	{
		id: '13',
		image: 'https://res.cloudinary.com/ssani7/image/upload/v1720196595/hafiz/ruet.png',
		shortName: 'RUET',
		fullName: 'Rajshahi University of Engineering & Technology',
	},
	{
		id: '14',
		image: 'https://res.cloudinary.com/ssani7/image/upload/v1720196595/hafiz/ru.png',
		shortName: 'RU',
		fullName: 'University of Rajshahi',
	},
	{
		id: '15',
		image: 'https://res.cloudinary.com/ssani7/image/upload/v1720196595/hafiz/jnu.png',
		shortName: 'JnU',
		fullName: 'Jagannath University',
	},
	{
		id: '16',
		image: 'https://res.cloudinary.com/ssani7/image/upload/v1720196595/hafiz/iut.png',
		shortName: 'IUT',
		fullName: 'Islamic University of Technology',
	},
];

module.exports.getUniData = async (req, res) => {
	try {
		res.send({ data: JSON.stringify(uniData) });
	} catch (error) {
		console.log(error);
		res.status(400).send({
			status: 'failed',
			message: error.message,
		});
	}
};

// class CoverPageList {
//     static const List<String> coverList = ['Assignment', 'Lab Report'];

//     static const List<Map> uniVarsityList = [
//       {
//         'id': '1',
//         'image': CImages.diuLogo,
//         'shortName': CTexts.diuShortName,
//         'fullName': CTexts.diuFullName,
//       },
//       {
//         'id': '2',
//         'image': CImages.buetLogo,
//         'shortName': CTexts.buetShortName,
//         'fullName': CTexts.buetFullName,
//       },
//       {
//         'id': '3',
//         'image': CImages.duLogo,
//         'shortName': CTexts.duShortName,
//         'fullName': CTexts.duFullName,
//       },
//       {
//         'id': '4',
//         'image': CImages.juLogo,
//         'shortName': CTexts.juShortName,
//         'fullName': CTexts.juFullName,
//       },
//       {
//         'id': '5',
//         'image': CImages.nsuLogo,
//         'shortName': CTexts.nsuShortName,
//         'fullName': CTexts.nsuFullName,
//       },
//       {
//         'id': '6',
//         'image': CImages.bupLogo,
//         'shortName': CTexts.bupShortName,
//         'fullName': CTexts.bupFullName,
//       },
//       {
//         'id': '7',
//         'image': CImages.aiubLogo,
//         'shortName': CTexts.aiubShortName,
//         'fullName': CTexts.aiubFullName,
//       },
//       {
//         'id': '8',
//         'image': CImages.bracLogo,
//         'shortName': CTexts.bracShortName,
//         'fullName': CTexts.bracFullName,
//       },
//       {
//         'id': '9',
//         'image': CImages.iubLogo,
//         'shortName': CTexts.iubShortName,
//         'fullName': CTexts.iubFullName,
//       },
//       {
//         'id': '10',
//         'image': CImages.ewuLogo,
//         'shortName': CTexts.ewuShortName,
//         'fullName': CTexts.ewuFullName,
//       },
//       {
//         'id': '11',
//         'image': CImages.scuLogo,
//         'shortName': CTexts.cityShortName,
//         'fullName': CTexts.cityFullName,
//       },
//       {
//         'id': '12',
//         'image': CImages.gubLogo,
//         'shortName': CTexts.gubShortName,
//         'fullName': CTexts.gubFullName,
//       },
//       {
//         'id': '13',
//         'image': CImages.ruetLogo,
//         'shortName': CTexts.ruetShortName,
//         'fullName': CTexts.ruetFullName,
//       },
//       {
//         'id': '14',
//         'image': CImages.ruLogo,
//         'shortName': CTexts.ruShortName,
//         'fullName': CTexts.ruetFullName,
//       },
//       {
//         'id': '15',
//         'image': CImages.jnuLogo,
//         'shortName': CTexts.jnuShortName,
//         'fullName': CTexts.jnuFullName,
//       },
//       {
//         'id': '16',
//         'image': CImages.iutLogo,
//         'shortName': CTexts.iutShortName,
//         'fullName': CTexts.iutFullName,
//       },
//     ];
//   }
