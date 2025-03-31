import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { useSearchParams } from 'react-router-dom';

import ApartmentApi from '@/api/apartment.api';
import ListApartments from '@/components/apartment/ListApartments';
import { SearchFilter } from '@/components/apartment/SearchFilter';
import { BannerSlider } from '@/components/BannerSlider';
import EmptyListPage from '@/components/Empty';
import PaginationComponent from '@/components/PaginationComponent';
import { RealEstateRegions } from '@/components/RealEstateEegions';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function Home() {
	const [apartments, setApartments] = useState(null);
	const [total, setTotal] = useState(null);
	const [searchParams] = useSearchParams();
	const articleRef = useRef(null);
	const [filter, setFilter] = useState({
		page: 1,
		limit: 20,
		orderType: "desc",
	});

	const fetchApartments = useCallback(
		async (currentFilter) => {
			const cleanedFilter = { ...currentFilter };
			if (searchParams.get("q")) {
				cleanedFilter.apart_title_like = `${searchParams.get("q")}`;
			}

			try {
				const response = await ApartmentApi.searchGuestApartment({
					...cleanedFilter,
				});

				if (response?.status === 200) {
					const { apartments: apartmentData, totalCount } = response.metadata.data;
					setApartments(apartmentData);
					setTotal(totalCount);
				}
				return response;
			} catch (error) {
				console.error("Failed to fetch apartments:", error);
				// Handle error state here
			}
		},
		[searchParams],
	);

	useEffect(() => {
		fetchApartments(filter);
	}, [filter.page, searchParams, fetchApartments]);

	const handleFilter = async (filter) => {
		const cleanedFilter = { ...filter };
		try {
			const response = await fetchApartments(cleanedFilter);
			if (response?.status === 200) {
				const { apartments: apartmentData, totalCount } = response.metadata.data;
				setApartments(apartmentData);
				setTotal(totalCount);
				setFilter((prev) => ({ ...prev, page: 1 }));
				articleRef.current.scrollIntoView({ behavior: "smooth" });
			}
		} catch (error) {
			console.error("Failed to apply filter:", error);
		}
	};

	return (
		<div className="container mx-auto">
			<BannerSlider />
			<RealEstateRegions filter={filter} setFilter={setFilter} handleFilter={handleFilter} />
			<div className="mt-4 flex gap-4 flex-col md:flex-row">
				<aside className="md:w-[300px] w-full flex-grow-0 flex-shrink-0 flex flex-col gap-3">
					<SearchFilter filter={filter} setFilter={setFilter} onFilter={handleFilter} />
				</aside>
				<article className="flex-1" ref={articleRef}>
					{apartments?.length > 0 ? (
						<>
							<div className="mb-6 flex md:items-center justify-between md:flex-row flex-col items-start gap-3">
								<div>
									<h3 className="text-xl font-semibold">Bất động sản nổi bật</h3>
									<p className="text-muted-foreground">
										Khám phá những bất động sản được đánh giá cao
									</p>
								</div>
								<div className="flex items-center gap-2">
									<Select
										defaultValue="newest"
										onValueChange={(value) => {
											if (value === "newest") {
												handleFilter({ ...filter, orderType: "desc" });
											} else {
												const [orderBy, orderType] = value.split("-");
												handleFilter({ ...filter, orderBy, orderType });
											}
										}}
									>
										<SelectTrigger className="w-[180px]">
											<SelectValue placeholder="Sắp xếp theo" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="newest">Mới nhất</SelectItem>
											<SelectItem value="apart_price-asc">Giá tăng dần</SelectItem>
											<SelectItem value="apart_price-desc">Giá giảm dần</SelectItem>
											<SelectItem value="apart_area-asc">Diện tích tăng dần</SelectItem>
											<SelectItem value="apart_area-desc">Diện tích giảm dần</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>
							<ListApartments apartments={apartments} total={total} />
							<PaginationComponent total={total} filter={filter} setFilter={setFilter} />
						</>
					) : (
						<EmptyListPage />
					)}
				</article>
			</div>
		</div>
	);
}
