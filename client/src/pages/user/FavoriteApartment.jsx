import {
  useEffect,
  useState,
} from 'react';

import { Bookmark } from 'lucide-react';

import FavoriteApi from '@/api/favorite.api';
import Loading from '@/components/Loading';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { formatTimeAgo } from '@/utils';

const initialItems = [
	{
		id: "1",
		title: "Mountain Landscape",
		description: "A beautiful mountain landscape with snow-capped peaks and green valleys.",
		imageUrl: "/placeholder.svg?height=400&width=600",
		dateAdded: "2 days ago",
		isFavorite: true,
	},
	{
		id: "2",
		title: "Coastal Sunset",
		description: "Breathtaking sunset view over the ocean with golden hour colors.",
		imageUrl: "/placeholder.svg?height=400&width=600",
		dateAdded: "1 week ago",
		isFavorite: true,
	},
	{
		id: "3",
		title: "Forest Trail",
		description: "A serene walking trail through an ancient forest with filtered sunlight.",
		imageUrl: "/placeholder.svg?height=400&width=600",
		dateAdded: "3 days ago",
		isFavorite: true,
	},
	{
		id: "4",
		title: "Desert Dunes",
		description: "Rolling sand dunes stretching as far as the eye can see.",
		imageUrl: "/placeholder.svg?height=400&width=600",
		dateAdded: "5 days ago",
		isFavorite: true,
	},
];

export default function FavoriteItemsList() {
	const [items, setItems] = useState([]);
	const [loading, setLoading] = useState(true);
	const toggleFavorite = async (id) => {
		const res = await FavoriteApi.removeFavoriteApartment(id);
		if (res?.status === 200) {
			setItems(items.filter((item) => item.apartment.apart_id !== id));
		}
	};
	useEffect(() => {
		const fetchFavoriteItems = async () => {
			const response = await FavoriteApi.searchFavoriteApartment();
			if (response?.status === 200) {
				setItems(response.metadata.data.favorites);
			}
		};
		if (items.length === 0) {
			fetchFavoriteItems().finally(() => setLoading(false));
		}
	}, []);
	if (loading) {
		<Loading />;
	}

	return items.length === 0 ? (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-6">Tin đã lưu</h1>
			<p className="text-muted-foreground">Bạn chưa lưu tin nào</p>
		</div>
	) : (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-6">Tin đã lưu</h1>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{items.map((item) => (
					<Card key={item.apartment.apart_id} className="flex flex-col">
						<CardHeader>
							<CardTitle className="line-clamp-1 text-pink-400 text-xl">
								<a href={`/apartment/${item.apartment.apart_id}`}>{item.apartment.apart_title}</a>
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4 flex-grow px-6 pb-2">
							<a href={`/apartment/${item.apartment.apart_id}`} className='flex flex-col gap-3'>
								<span className="aspect-video relative rounded-lg overflow-hidden inline-block border border-pink-400">
									<img
										src={item.apartment.images[0].img_url || "/placeholder.svg"}
										alt={item.apartment.images[0].img_alt}
										className="object-cover w-full h-full"
									/>
								</span>
								<p className="text-muted-foreground text-sm line-clamp-2">
									Mô tả: {item.apartment.apart_description}
								</p>
							</a>
						</CardContent>
						<CardFooter className="flex justify-between items-center">
							<p className="text-sm text-muted-foreground">Thêm {formatTimeAgo(item.createdAt)}</p>
							<Button
								variant="ghost"
								size="icon"
								onClick={async () => await toggleFavorite(item.apartment.apart_id)}
							>
								<Bookmark className={`w-5 h-5 text-yellow-400 fill-yellow-400`} />
							</Button>
						</CardFooter>
					</Card>
				))}
			</div>
		</div>
	);
}
