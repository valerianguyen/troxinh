const { ENUM_ORDER, ENUM_STATUS_APARTMENT, ENUM_TYPE_ORDER } = require("../constant");
const sequelize = require("../dbs/init.mysql");
const vnpay = require("../dbs/init.vnpay");
const Apartment = require("../models/apartment.model");
const Order = require("../models/order.model");
class VNPService {
	// createPaymentUrl method
	// return url
	// get transaction info
	// ipn_url(optional)
	static createPaymentUrl = async ({ amount, order_info, order_code, ip_address, return_url }) => {
		// create payment url
		return vnpay.buildPaymentUrl({
			vnp_Amount: amount,
			vnp_OrderInfo: order_info,
			vnp_TxnRef: order_code,
			vnp_IpAddr: ip_address,
			vnp_ReturnUrl: return_url,
		});
	};
	// static async getTransactionInfo({ query }) {
	// 	// get transaction info
	// 	return vnpay.queryDr(query);
	// }
	static async returnURL({ query }) {
		const verifyResult = vnpay.verifyReturnUrl(query);

		if (!verifyResult.isVerified) {
			return null;
		}
		const order = await Order.findOne({
			where: { order_code: verifyResult.vnp_TxnRef },
		});

		if (!order || order.order_status !== ENUM_ORDER.PENDING) {
			return order?.order_code;
		}
		const transaction = await sequelize.transaction();
		const status = {
			isValid: parseFloat(order.order_amount) === parseFloat(verifyResult.vnp_Amount),
			isSuccess: verifyResult.isSuccess,
		};

		const updateData = {
			order_status: status.isValid && status.isSuccess ? ENUM_ORDER.SUCCESS : ENUM_ORDER.FAILED,
			order_note: !status.isValid
				? `Sai số tiền ${verifyResult.vnp_Amount} không khớp với số tiền ${order.order_amount}`
				: verifyResult.message,
			order_bank_tran_no: verifyResult.vnp_BankTranNo,
			order_transaction_no: verifyResult.vnp_TransactionNo,
			order_bank_code: verifyResult.vnp_BankCode,
			order_pay_date: new Date(
				verifyResult.vnp_PayDate.replace(
					/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/,
					"$1-$2-$3 $4:$5:$6",
				),
			),
		};
		// update status apartment
		try {
			if (status.isSuccess && status.isValid) {
				const dataUpdate = {};
				switch (parseInt(order.order_type)) {
					case ENUM_TYPE_ORDER.PAY_FOR_APARTMENT:
						dataUpdate.apart_status = ENUM_STATUS_APARTMENT.ACTIVE;
						break;
					case ENUM_TYPE_ORDER.PAY_FOR_BOOST:
						const jsonData = JSON.parse(order.order_data);
						dataUpdate.apart_priority = parseInt(jsonData.priority);
						dataUpdate.apart_expired_date = new Date(jsonData.newEndDate);
						dataUpdate.apart_time_start = new Date();
						break;
					default:
						break;
				}
				await Apartment.update(dataUpdate, {
					where: { apart_id: order.order_apart_id },
					transaction,
				});
			}
			await order.update(updateData, {
				transaction,
			});
			await transaction.commit();
			return order.order_code;
		} catch (err) {
			console.error(err);
			await transaction.rollback();
			return null;
		}
	}
}
module.exports = VNPService;
