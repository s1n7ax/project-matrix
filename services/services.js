const Locator = require('../locator');
const DAO = require(Locator.dbManagersPath.dao);



class Services {

	constructor(itemType) {
		this.database = new DAO;
		this.itemType = itemType;
	}

	create(self, values, response) {

		self.database.selectDoc(self.itemType, {
			'name': values.name
		}).then(function (data) {

			if (data.length > 0) {
				throw {
					name: 'test',
					des: 'error'
				};
			} else {
				
				self.database.insertDoc(self.itemType, values).then(function (data) {
					response.send({
						'status': true,
						'error': false,
						'data': data
					});
				});
			}
		}).catch(function (error) {
			response.send({
				'status': false,
				'error': error,
				'data': null
			});
		});
	}
}

module.exports = Services;