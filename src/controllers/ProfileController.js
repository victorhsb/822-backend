const connection = require("../database/connection")

module.exports = {
	async index(request, response) {
		const ong_id = request.headers.authorization

		try {
			const incidents = await connection("incidents")
				.where("ong_id", ong_id)
				.select("*")

			return response.status(200).json(incidents)
		} catch (e) {
			request.log.info("could not get incidents")
			return response.status(500).send()
		}
	},
}
