"use client";
import {
  useEffect,
  useState,
} from 'react';

import { ArrowLeft } from 'lucide-react';
import { useParams } from 'react-router-dom';

import BlogApi from '@/api/blog.api';
import Loading from '@/components/Loading';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

import NotFound from '../_notFound';

export default function BlogPostDetailPage() {
	const [blog, setBlog] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const params = useParams();

	useEffect(() => {
		const fetchBlogDetail = async () => {
			const response = await BlogApi.getBlogById(params.blog_id);
			if (response.status === 200) {
				setBlog(response.metadata.data);
			}
			setLoading(false);
		};

		!blog && fetchBlogDetail();
	}, []);

	const handleGoBack = () => {
		window.location.href = "/blog";
	};

	if (loading) {
		return <Loading />;
	}

	if (!loading && !blog) {
		return <NotFound />;
	}
	return (
		<div className="min-h-screen bg-background">
			{/* Header with back button */}
			<header className="container mx-auto px-4 py-6">
				<Button
					onClick={handleGoBack}
					variant="ghost"
					className="flex items-center text-muted-foreground hover:text-foreground"
				>
					<ArrowLeft className="mr-2 h-4 w-4" /> Về trang tin tức
				</Button>
			</header>

			<main className="container mx-auto px-4 py-6 max-w-4xl">
				{/* Hero image */}
				<div className="w-full h-[300px] md:h-[400px] rounded-lg overflow-hidden mb-8">
					<img
						src={blog.blog_image || "/placeholder.svg"}
						alt={blog.blog_title}
						className="w-full h-full object-cover"
					/>
				</div>

				{/* Blog title */}
				<h1 className="text-3xl md:text-4xl font-bold mb-6">{blog.blog_title}</h1>

				{/* Author info */}
				<div className="flex items-center gap-3 mb-8 pb-6 border-b">
					<Avatar className="h-10 w-10">
						<AvatarImage src={blog.user.usr_avatar} alt={blog.user.usr_name} />
						<AvatarFallback>{blog.user.usr_name.charAt(0)}</AvatarFallback>
					</Avatar>
					<div>
						<p className="font-medium">{blog.user.usr_name}</p>
						<p className="text-sm text-muted-foreground">Author</p>
					</div>
				</div>

				{/* Blog content */}
				<article
					className="prose prose-lg max-w-none dark:prose-invert"
					dangerouslySetInnerHTML={{ __html: blog.blog_content }}
				/>
			</main>
		</div>
	);
}
