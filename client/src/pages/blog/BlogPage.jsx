"use client";
import {
  useEffect,
  useState,
} from 'react';

import { ChevronRight } from 'lucide-react';

import BlogApi from '@/api/blog.api';
import Loading from '@/components/Loading';
import PaginationComponent from '@/components/PaginationComponent';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';

export default function BlogListPage() {
	const [blogs, setBlogs] = useState([]);
	const [loading, setLoading] = useState(true);
	const [total, setTotal] = useState(0);
	const [filter, setFilter] = useState({
		page: 1,
		limit: 6,
	});
	useEffect(() => {
		fetchBlogs();
	}, [filter.page, filter.limit]);

	const fetchBlogs = async () => {
		setLoading(true);
		const response = await BlogApi.getBlogs(filter);

		if (response.status === 200) {
			setBlogs(response.metadata.data.blogs);
			setTotal(response.metadata.data.total);
		}
		setLoading(false);
	};

	const navigateToBlog = (blogId) => {
		window.location.href = `/blog/${blogId}`;
	};

	// Function to extract plain text preview from HTML content
	const getContentPreview = (htmlContent, maxLength = 100) => {
		// Create a temporary div to parse HTML
		const tempDiv = document.createElement("div");
		tempDiv.innerHTML = htmlContent;
		const textContent = tempDiv.textContent || tempDiv.innerText || "";

		// Return truncated text with ellipsis if needed
		return textContent.length > maxLength
			? textContent.substring(0, maxLength) + "..."
			: textContent;
	};
	if (loading) return <Loading />;

	return (
		<div className="min-h-screen bg-background">
			<div className="container mx-auto px-4 py-8">
				<div className="mb-10">
					<h1 className="text-3xl md:text-4xl font-bold mb-2">Blog</h1>
					<p className="text-muted-foreground">Khám phá bài viết mới nhất</p>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{blogs.map((blog) => (
						<Card
							key={blog.blog_id}
							className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
							onClick={() => navigateToBlog(blog.blog_id)}
						>
							<div className="aspect-video w-full overflow-hidden">
								<img
									src={blog.blog_image || "/placeholder.svg"}
									alt={blog.blog_title}
									className="w-full h-full object-cover transition-transform hover:scale-105"
								/>
							</div>

							<CardHeader className="pb-2">
								<h2 className="text-xl font-bold line-clamp-2">{blog.blog_title}</h2>
							</CardHeader>

							<CardContent className="pb-2">
								<p className="text-muted-foreground line-clamp-3">
									{getContentPreview(blog.blog_content)}
								</p>
							</CardContent>

							<CardFooter className="flex justify-between items-center pt-2">
								<div className="flex items-center gap-2">
									<Avatar className="h-8 w-8">
										<AvatarImage src={blog.user.usr_avatar} alt={blog.user.usr_name} />
										<AvatarFallback>{blog.user.usr_name.charAt(0)}</AvatarFallback>
									</Avatar>
									<span className="text-sm">{blog.user.usr_name}</span>
								</div>
								<ChevronRight className="h-5 w-5 text-muted-foreground" />
							</CardFooter>
						</Card>
					))}
				</div>
				<PaginationComponent total={total} filter={filter} setFilter={setFilter} />
			</div>
		</div>
	);
}
