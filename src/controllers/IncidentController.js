const connection = require("../database/connection")

module.exports = {
	async index(request, response) {
		const { page = 1 } = request.query

		const [count] = await connection("incidents").count()

		try {
			const incidents = await connection("incidents")
				.join("ongs", "ongs.id", "=", "incidents.ong_id")
				.limit(5)
				.offset((page - 1) * 5)
				.select(["incidents.*", "ongs.name", "ongs.email", "ongs.whatsapp", "ongs.city", "ongs.uf"])

			response.header("X-Total-Count", count["count(*)"])

			return response.status(200).json(incidents)
		} catch (e) {
			request.log.info("could not get incidents", { error: e })
			return response.status(500).send()
		}
	},

	async create(request, response) {
		const { title, description, value } = request.body
		const ong_id = request.headers.authorization

		try {
			const [id] = await connection("incidents").insert({
				title,
				description,
				value,
				ong_id,
			})

			return response.status(200).json({ id })
		} catch (e) {
			request.log.info("could not insert incident", { error: e })
			return response.status(500).send()
		}
	},

	async delete(request, response) {
		const { id } = request.params
		const ong_id = request.headers.authorization

		const incident = await connection("incidents")
			.where("id", id)
			.select("ong_id")
			.first()

		if (incident.ong_id !== ong_id) {
			// the recommended here was to send a 401 response status to the user,
			// but 401 is used when the user doesn`t have any authentication.
			// the case here is that the user is actually forbidden to access this
			return response.status(403).json({ error: "Operation not permitted." })
		}

		try {
			await connection("incidents")
				.where("id", id)
				.delete()

			return response.status(204).send()
		} catch (e) {
			request.log.info("could not delete incident", { error: e })
			return response.status(500).send()
		}
	},
}
