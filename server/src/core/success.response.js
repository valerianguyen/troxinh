"use strict";
const StatusCode = {
	OK: 200,
	CREATE: 201,
};

const ReasonStatusCode = {
	OK: "Success",
	CREATE: "Created",
};

class SuccessResponse {
	constructor({
		message = "Success",
		status = StatusCode.OK,
		reasonStatusCode = ReasonStatusCode.OK,
		metadata = {},
	}) {
		this.status = status;
		this.metadata = metadata;
		this.message = message ? message : reasonStatusCode;
	}
	setCookie(res, name, value, maxAge) {
		if (value) {
			res.cookie(name, value, {
				maxAge,
				httpOnly: true,
				secure: false,
				sameSite: "none",
				path: "/"
			});
		}
		return this;
	}
	send(res, header = {}) {
		return res.status(this.status).json(this);
	}
}

class SUCCESS extends SuccessResponse {
	constructor({ message, metadata }) {
		super({ message, metadata });
	}
}

class CREATED extends SuccessResponse {
	constructor({
		message = "Success",
		status = StatusCode.CREATE,
		reasonStatusCode = ReasonStatusCode.CREATE,
		metadata,
	}) {
		super({ message, status, reasonStatusCode, metadata });
	}
}

module.exports = {
	SUCCESS,
	CREATED,
};
