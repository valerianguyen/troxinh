const { VNPay, ignoreLogger } = require("vnpay");
const { VNP_TMN_CODE, VNP_HASH_SECRET } = require("../configs/vnpay.config");
const vnpay = new VNPay({
	tmnCode: VNP_TMN_CODE,
	secureSecret: VNP_HASH_SECRET,
	vnpayHost: "https://sandbox.vnpayment.vn",
	testMode: true,
	hashAlgorithm: "SHA512",
	enableLog: true,
	loggerFn: ignoreLogger,
});

module.exports = vnpay;