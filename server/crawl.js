const fs = require("fs/promises");

/**
 * Crawls the Chotot API for listings in a specific category and writes the results to a JSON file.
 * This function fetches up to 10 pages of data, with 20 items per page.
 * There is a 3-second delay between each request to avoid rate limiting.
 * 
 * @async
 * @param {string} category - The category name used for organizing and naming the output file
 * @param {number} [cg=1010] - The category ID used in the API request
 * @returns {Promise<void>} - Resolves when all data is fetched and written to the file
 */
async function crawl(category, cg = 1010) {
	const data = [];
	for (let i = 1; i <= 10; i++) {
		const url = `https://gateway.chotot.com/v1/public/ad-listing?region_v2=12000&cg=${cg}&page=${i}&sp=1&st=u,h&limit=20&w=1&include_expired_ads=true&key_param_included=true`;
		const response = await fetch(url);
		const result = await response.json();
		if (result.ads.length === 0) {
			break;
		}
		data.push(...result.ads);
		console.log(`Crawled page ${i} of ${category}`);
		await new Promise((resolve) => setTimeout(resolve, 3000));
	}

	await fs.writeFile(
		`./data/${category}.json`,
		JSON.stringify(
			{
				[category]: data,
			},
			null,
			2,
		),
	);
}

(async () => {
	console.log("Crawling data from Chotot.vn");
	await crawl("apartment", 1010);
	await crawl("house", 1020);
	await crawl("boarding_house", 1050);
})();
