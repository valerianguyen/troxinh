import React from 'react';

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from '@/components/ui/pagination';
import { cn } from '@/lib/utils';

export default function PaginationComponent({ total, filter, setFilter }) {
	if(!total) return null;
	return (
		<div className="mt-5">
			<Pagination>
				<PaginationContent>
					<PaginationItem>
						<Button
							onClick={() => {
								setFilter({ ...filter, page: 1 });
							}}
							disabled={filter?.page === 1}
							className={
								"text-black bg-white hover:text-white hover:bg-purple-300 border border-purple-primary-300 disabled:bg-opacity-50 disabled:bg-purple-300 size-10"
							}
						>
							<ChevronsLeft className="h-4 w-4" />
						</Button>
					</PaginationItem>
					<PaginationItem>
						<Button
							onClick={() => {
								setFilter({ ...filter, page: filter.page - 1 });
							}}
							disabled={filter?.page === 1}
							className={
								"text-black bg-white hover:text-white hover:bg-purple-300 border border-purple-primary-300 disabled:bg-opacity-50 disabled:bg-purple-300 size-10"
							}
						>
							<ChevronLeft className="h-4 w-4" />
						</Button>
					</PaginationItem>
					{Array.from({ length: 3 }, (_, i) => {
						const startPage = Math.min(
							filter?.page - 1,
							Math.ceil((total ?? 0) / (filter?.limit ?? 10)) - 3,
						);
						const page = startPage + i + 1;
						return (
							page > 0 && (
								<PaginationItem key={page}>
									<Button
										onClick={() => {
											setFilter({ ...filter, page });
										}}
										className={cn(
											"bg-white border hover:text-white border-purple-primary-300 text-black hover:bg-purple-300 size-10",
											page === filter?.page ? "text-white bg-purple-300" : "",
										)}
									>
										{page}
									</Button>
								</PaginationItem>
							)
						);
					})}
					<PaginationItem>
						<Button
							onClick={() => {
								setFilter({ ...filter, page: filter.page + 1 });
							}}
							disabled={filter?.page === Math.ceil((total ?? 0) / (filter?.limit ?? 10))}
							className={
								"text-black hover:text-white bg-white border border-purple-primary-300 disabled:bg-opacity-50 disabled:bg-purple-300 hover:bg-purple-300 size-10"
							}
						>
							<ChevronRight className="h-4 w-4" />
						</Button>
					</PaginationItem>
					<PaginationItem>
						<Button
							onClick={() => {
								setFilter({ ...filter, page: Math.ceil((total ?? 0) / (filter?.limit ?? 10)) });
							}}
							disabled={filter?.page === Math.ceil((total ?? 0) / (filter?.limit ?? 10))}
							className={
								"text-black hover:text-white bg-white border border-purple-primary-300 disabled:bg-opacity-50 disabled:bg-purple-300 hover:bg-purple-300 size-10"
							}
						>
							<ChevronsRight className="h-4 w-4" />
						</Button>
					</PaginationItem>
				</PaginationContent>
			</Pagination>
		</div>
	);
}
