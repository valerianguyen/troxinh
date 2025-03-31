const VerifyApartmentService = require("../services/verifyApartment.service");
const { SUCCESS, CREATED } = require("../core/success.response");
const { ENUM_ROLE } = require("../constant");
class VerifyApartmentController {
	static getVerifyApartmentMedia = async (req, res) => {
		const { page, limit, orderBy, orderType } = req.query;
		return new SUCCESS({
			metadata: await VerifyApartmentService.getVerifyApartmentMedia({
				userId: [ENUM_ROLE.ADMIN, ENUM_ROLE.STAFF].includes(req.user.role) ? null : req.user.userId,
				page,
				limit,
				orderBy,
				orderType,
			}),
		}).send(res);
	};
	static approveVerifyApartment = async (req, res) => {
		const { ver_id } = req.params;
		return new CREATED({
			metadata: await VerifyApartmentService.approveVerifyApartment({
				ver_id,
				files: req.files,
			}),
		}).send(res);
	};
	static rejectVerifyApartment = async (req, res) => {
		const { ver_id } = req.params;
		return new CREATED({
			metadata: await VerifyApartmentService.rejectVerifyApartment({
				ver_id,
				reason: req.body.reason,
			}),
		}).send(res);
	};
}
// Compare this snippet from server/src/routes/apartment.route.js:
module.exports = VerifyApartmentController;
