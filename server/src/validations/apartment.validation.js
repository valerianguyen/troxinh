const Joi = require("joi");
const {
	ENUM_APARTMENT_CATEGORIES,
	ENUM_APARTMENT_TYPE,
	ENUM_STATUS_APARTMENT,
	ENUM_PRIORY,
} = require("../constant");
const imageItem = {
	img_url: Joi.string().required(),
	img_alt: Joi.string().required(),
};
const createApartmentBody = {
	apart_title: Joi.string().required().max(100),
	apart_total_toilet: Joi.number().required(),
	apart_price: Joi.number().required(),
	apart_total_room: Joi.number().required(),
	apart_area: Joi.number().required(),
	apart_description: Joi.string().required(),
	apart_images: Joi.array().min(1).required().items(imageItem),
	apart_city: Joi.number().required(),
	apart_district: Joi.number().required(),
	apart_ward: Joi.number().required(),
	apart_address: Joi.string().required(),
	apart_category: Joi.number()
		.required()
		.valid(...Object.values(ENUM_APARTMENT_CATEGORIES)),
	apart_type: Joi.number()
		.required()
		.valid(...Object.values(ENUM_APARTMENT_TYPE)),
};

const updateApartmentBody = {
	apart_title: Joi.string().optional(),
	apart_price: Joi.number().optional(),
	apart_total_toilet: Joi.number().optional(),
	apart_total_room: Joi.number().optional(),
	apart_area: Joi.number().optional(),
	apart_description: Joi.string().optional(),
	apart_images: Joi.array().min(1).required().items(imageItem),
	apart_city: Joi.number().optional(),
	apart_district: Joi.number().optional(),
	apart_ward: Joi.number().optional(),
	apart_address: Joi.string().optional(),
};
const queryApartment = {
	apart_id: Joi.string().optional(),
	apart_title: Joi.string().optional(),
	apart_total_toilet: Joi.string().optional(),
	apart_total_room: Joi.string().optional(),
	apart_area: Joi.string().optional(),
	apart_city: Joi.string().optional(),
	apart_district: Joi.string().optional(),
	apart_ward: Joi.string().optional(),
	apart_status: Joi.number()
		.optional()
		.valid(...Object.values(ENUM_STATUS_APARTMENT)),
	usr_id: Joi.number().optional(),
	page: Joi.number().optional(),
	limit: Joi.number().optional(),
	orderBy: Joi.string()
		.optional()
		.default("apart_id")
		.valid(...Object.keys(createApartmentBody)),
	orderType: Joi.string().default("desc").optional().valid("asc", "desc"),
	apart_address: Joi.string().optional(),
};

const boostApartment ={
	apart_id: Joi.string().required(),
	priority: Joi.number().required().min(1).max(ENUM_PRIORY.EXTRA),
	duration: Joi.number().required().min(1),
}
module.exports = {
	createApartmentBody,
	updateApartmentBody,
	queryApartment,
	boostApartment
};
