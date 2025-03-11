const { SUCCESS, CREATED } = require("../core/success.response");
const PaymentService = require("../services/vnpay.service");
class PaymentController {
	static returnURL = async (req, res) => {
		const order_code = await PaymentService.returnURL({ query: req.query });
		if (order_code) {
			return res.redirect(`http://localhost:5173/payment/${order_code}`);
		}
		return res.redirect("http://localhost:5173/payment/failed");
	};
}
module.exports = PaymentController;
