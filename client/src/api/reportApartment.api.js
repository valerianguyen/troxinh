import axiosClient from './axiosClient';

export default class ReportApartmentApi {
	static async createReport({ report_apart_id, report_content }) {
		return await axiosClient.post("/report/" + report_apart_id, { report_content });
	}
	static async updateReport({ report_id, report_content }) {
		return await axiosClient.put("/report/" + report_id, { report_content });
	}
	static async searchReport({ filter }) {
		return await axiosClient.get("/report", { params: { ...filter } });
	}
	static async getReportById({ apart_id }) {
		return await axiosClient.get("/report/" + apart_id);
	}
	static async deleteReport({ report_id }) {
		return await axiosClient.delete("/report/" + report_id);
	}
	static async groupByUserId({ page, limit, orderBy, orderType, filter }) {
		return await axiosClient.get("/report/group/user", {
			params: { page, limit, orderBy, orderType, ...filter },
		});
	}
	static async groupByApartmentId({ filter }) {
		return await axiosClient.get("/report/group/apartment", {
			params: { ...filter },
		});
	}
}
