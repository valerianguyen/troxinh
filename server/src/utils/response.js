
const apiResponse = ({ code, message = "Internal error", status = "success", data = null }) => {
	return {
		message,
		status: code === 500 ? "error" : status,
		data,
	};
};

module.exports = { apiResponse };
