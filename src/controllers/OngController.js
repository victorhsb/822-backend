const crypto = require("crypto")
const connection = require("../database/connection")

module.exports = {
	async index(request, response) {
		try {
			const ongs = await connection("ongs").select("*")

			return response.status(200).json(ongs)
		} catch (e) {
			request.log.info("could not list ongs", { error: e })
			return response.status(500).send()
		}
	},

	async create(request, response) {
		const { name, email, whatsapp, city, uf } = request.body

		const id = crypto.randomBytes(4).toString("HEX")

		try {
			await connection("ongs").insert({
				id,
				name,
				email,
				whatsapp,
				city,
				uf,
			})

			return response.status(200).json({ id })
		} catch (e) {
			request.log.info("could not create ong", { error: e })
			return response.status(500).send()
		}
	},
}
