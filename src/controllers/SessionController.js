const connection = require("../database/connection")

module.exports = {
	async create(request, response) {
		const { id } = request.body

		try {
			const ong = await connection("ongs")
				.where("id", id)
				.select("name")
				.first()

			if (!ong) {
				return response.status(404).json({ error: "No ONG found with this ID" })
			}

			return response.json(ong)
		} catch (e) {
			request.log.info("could not create ong")
			return response.status(500).send()
		}
	},
}
