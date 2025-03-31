const ENUM_ROLE = {
	ADMIN: 2,
	STAFF: 1,
	USER: 0,
	BAN: -1,
};
const ENUM_RENT_REQUEST = {
	PENDING: 0,
	ACCEPTED: 1,
	REJECTED: -1,
	CANCEL: -2,
};
const ENUM_STATUS_TICKET = {
	PENDING: 0,
	DONE: 2,
	REPLYING: 1,
	REJECTED: -1,
	CANCEL: -2,
};
const ENUM_COMMENT = {
	PENDING: 0,
	APPROVED: 1,
	REJECTED: -1,
};
const ENUM_STRING_ROLE = {
	0: "User",
	1: "Staff",
	2: "Admin",
	"-1": "Ban",
};
const ENUM_STRING_RENT_REQUEST = {
	2: "Đã trả phòng",
	0: "Đang chờ",
	1: "Đã đồng ý",
	"-1": "Đã từ chối",
	"-2": "Đã hủy",
};
const ENUM_STRING_STATUS_TICKET = {
	0: "Đang chờ",
	1: "Đang phản hồi",
	2: "Đã xử lí",
	"-1": "Đã từ chối",
	"-2": "Đã hủy",
};
const ENUM_STRING_COMMENT = {
	0: "Đang chờ",
	1: "Đã chấp nhận",
	"-1": "Đã từ chối",
};
const COLOR_STATUS_TICKET = {
	0: "bg-yellow-400",
	1: "bg-blue-400",
	2: "bg-green-400",
	"-1": "bg-red-400",
	"-2": "bg-gray-400",
};
const COLOR_COMMENT = {
	0: "bg-yellow-400",
	2: "bg-green-400",
	"-1": "bg-red-400",
};
const COLOR_RENT_REQUEST = {
	2: "bg-blue-400",
	0: "bg-yellow-400",
	1: "bg-green-400",
	"-1": "bg-red-400",
	"-2": "bg-gray-400",
};
const ENUM_APARTMENT_TYPE = {
	SHARE_ROOM: 1,
	FOR_RENT: 2,
};
const ENUM_APARTMENT_CATEGORIES = {
	APARTMENT: 1,
	HOUSE: 2,
	BOARDING_HOUSE: 3,
};
const ENUM_STRING_APARTMENT_TYPE = {
	1: "Tìm người ở ghép",
	2: "Cho thuê",
};
const ENUM_STRING_APARTMENT_CATEGORIES = {
	1: "Chung cư / Căn hộ",
	2: "Nhà riêng",
	3: "Nhà trọ",
};
const ENUM_STATUS_APARTMENT = {
	PENDING: 0,
	BLOCK: 1,
	ACTIVE: 2,
	IS_VERIFIED: 3,
};
const ENUM_STRING_STATUS_APARTMENT = {
	0: "Chưa thanh toán",
	1: "Đã khóa",
	2: "Đang hoạt động",
	3: "Đã xác thực",
};
const ENUM_ACTION = {
	DELETE: 0,
	PUBLISH: 1,
	BLOCK: 2,
	UNPUBLISH: 3,
	MAKE_STAFF: 4,
	REJECTED: 5,
	DONE: 6,
	CANCEL: 7,
	PAY: 8,
	UNBLOCK: 9,
	VERIFY_APARTMENT: 10,
};
const ENUM_STRING_ACTION = {
	0: "xóa",
	1: "công khai",
	2: "khóa",
	3: "gỡ công khai",
	4: "làm nhân viên",
	5: "từ chối",
	6: "đã xử lí",
	7: "hủy",
	8: "thanh toán",
	9: "mở khóa",
	10: "xác thực",
};
const ENUM_ORDER = {
	PENDING: 0,
	SUCCESS: 1,
	FAILED: -1,
};
const ENUM_STATUS_VERIFY_APARTMENT = {
	PENDING: 0,
	DONE: 1,
	REJECTED: -1,
};
const ENUM_STATUS_STRING_VERIFY_APARTMENT = {
	0: "Chưa xác thực",
	1: "Đã xác thực",
	"-1": "Đã từ chối",
};
const ENUM_STYLE_VERIFY_APARTMENT = {
	0: "bg-yellow-100 text-yellow-800 border-yellow-200",
	1: "bg-green-100 text-green-800 border-green-200",
	"-1": "bg-red-100 text-red-800 border-red-200",
};
const ENUM_STRING_ORDER = {
	0: "Đã hủy",
	1: "Thành công",
	"-1": "Thất bại",
};
const ENUM_COLOR_ORDER = {
	0: "bg-yellow-400",
	1: "bg-green-400",
	"-1": "bg-red-400",
};
const ENUM_PRIORY = {
	DEFAULT: 0,
	LOW: 1,
	MEDIUM: 2,
	HIGH: 3,
	EXTRA: 4,
};

const ENUM_STRING_PRIORY = {
	[ENUM_PRIORY.DEFAULT]: "Tin thường",
	[ENUM_PRIORY.LOW]: "Đồng",
	[ENUM_PRIORY.MEDIUM]: "Bạc",
	[ENUM_PRIORY.HIGH]: "Vàng",
	[ENUM_PRIORY.EXTRA]: "Kim cương",
};
const HEADER_HEIGHT = "4rem";
export {
  COLOR_COMMENT,
  COLOR_RENT_REQUEST,
  COLOR_STATUS_TICKET,
  ENUM_ACTION,
  ENUM_APARTMENT_CATEGORIES,
  ENUM_APARTMENT_TYPE,
  ENUM_COLOR_ORDER,
  ENUM_COMMENT,
  ENUM_ORDER,
  ENUM_PRIORY,
  ENUM_RENT_REQUEST,
  ENUM_ROLE,
  ENUM_STATUS_APARTMENT,
  ENUM_STATUS_STRING_VERIFY_APARTMENT,
  ENUM_STATUS_TICKET,
  ENUM_STATUS_VERIFY_APARTMENT,
  ENUM_STRING_ACTION,
  ENUM_STRING_APARTMENT_CATEGORIES,
  ENUM_STRING_APARTMENT_TYPE,
  ENUM_STRING_COMMENT,
  ENUM_STRING_ORDER,
  ENUM_STRING_PRIORY,
  ENUM_STRING_RENT_REQUEST,
  ENUM_STRING_ROLE,
  ENUM_STRING_STATUS_APARTMENT,
  ENUM_STRING_STATUS_TICKET,
  ENUM_STYLE_VERIFY_APARTMENT,
  HEADER_HEIGHT,
};
