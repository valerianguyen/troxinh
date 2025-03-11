import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import { Loader2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import {
  NavLink,
  useParams,
} from 'react-router-dom';
import { toast } from 'sonner';

import ApartmentApi from '@/api/apartment.api';
import CommentApi from '@/api/comment.api';
import ApartmentItem from '@/components/apartment/ApartmentItem';
import { InfoApartment } from '@/components/apartment/InfoApartment';
import SliderApartment from '@/components/apartment/SliderApartment';
import PaginationComponent from '@/components/PaginationComponent';
import Rating from '@/components/Rating';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

import NotFound from '../_notFound';

export default function DetailApartment() {
	const { apart_id } = useParams();
	const [loading, setLoading] = useState(true);
	const [apartment, setApartment] = useState(null);
	const [relatedApartment, setRelatedApartment] = useState(null);
	const [rate, setRate] = useState(0);
	const [comments, setComments] = useState(null);
	const [filterComment, setFilterComment] = useState({
		page: 1,
		limit: 10,
	});
	const user = useSelector((state) => state.user);
	const [totalComment, setTotalComment] = useState(null);
	const textArea = useRef(null);
	useEffect(() => {
		setLoading(true);
		const fetchApartment = async () => {
			const response = await ApartmentApi.getApartmentById(apart_id);
			if (response.status === 200) {
				setApartment(response.metadata.data);
				const [relatedResponse, comments] = await Promise.all([
					ApartmentApi.searchGuestApartment({
						apart_district: response.metadata.data.apart_district,
						apart_id_ne: response.metadata.data.apart_id,
						page: 1,
						limit: 4,
					}),
					CommentApi.getCommentById(response.metadata.data.apart_id, filterComment),
				]);
				if (relatedResponse.status === 200) {
					setRelatedApartment(relatedResponse.metadata.data);
				}
				if (comments.status === 200) {
					setComments(comments.metadata.data.comments);
					setTotalComment(comments.metadata.data.totalCount);
				}
			}
			return response;
		};
		fetchApartment().finally(() => setLoading(false));
		window.scrollTo(0, 0);
	}, [apart_id, user]);
	const handlePageChangeComment = async (filter) => {
		const response = await CommentApi.getCommentById(apart_id, filter);
		if (response.status === 200) {
			setComments(response.metadata.data.comments);
		}
	};
	const handlePostComment = async () => {
		if (!textArea.current.value || !rate) {
			toast.error("Vui lòng nhập bình luận và đánh giá", {
				duration: 1000,
			});
			return;
		}
		const response = await CommentApi.createComment(apart_id, {
			cmt_content: textArea.current.value,
			cmt_rate: rate,
		});
		if (response.status === 201) {
			textArea.current.value = "";
			setRate(0);
			toast.success("Bình luận thành công", {
				duration: 1000,
			});
			setComments((prev) => [
				{
					...response.metadata.data,
					user: {
						usr_id: user.usr_id,
						usr_name: user.usr_name,
						usr_avatar: user.usr_avatar,
					},
				},
				...prev,
			]);
		}
	};
	return loading ? (
		<div className="flex justify-center items-center h-screen">
			<Loader2 className="animate-spin size-10" />
		</div>
	) : apartment ? (
		<div className="container mx-auto p-4">
			<div className="flex gap-10 md:flex-row flex-col">
				<SliderApartment apartImages={apartment.images} />
				<InfoApartment
					apartment={apartment}
					rate={
						comments?.length > 0
							? comments.reduce((acc, cur) => acc + cur.cmt_rate, 0) / comments.length
							: 0
					}
				/>
			</div>
			<div className="mt-4">
				<hr />
				<h2 className="text-2xl mt-4">Mô tả chi tiết</h2>
				<p className="text-gray-600 text-base">{apartment?.apart_description}</p>
			</div>
			<div className="mt-4">
				<hr />
				<h2 className="text-2xl mt-4">Bình luận</h2>
				<div className="flex items-center gap-3 my-3">
					<h4>Đánh giá</h4>
					<Rating rate={rate} setRate={setRate} className={"size-5"} />
				</div>
				<div className="flex gap-3 flex-col md:flex-row my-4">
					<Textarea ref={textArea} />
					<Button onClick={handlePostComment}>Bình luận</Button>
				</div>
				<div>
					{comments?.map((comment) => (
						<NavLink
							to={"/user/profile/" + comment.usr_id}
							key={comment.cmt_id}
							className="flex gap-4 hover:bg-gray-100 p-2 rounded-md"
						>
							<img
								src={comment.user.usr_avatar}
								alt="avatar"
								className="w-12 h-12 rounded-full border border-gray-400"
							/>
							<div>
								<h4 className="text-base">{comment.user.usr_name}</h4>
								<Rating rate={comment.cmt_rate} className={"size-3"} />
								<p className="mt-3">{comment.cmt_content}</p>
							</div>
							<hr />
						</NavLink>
					))}
				</div>
				<PaginationComponent
					total={totalComment}
					filter={filterComment}
					setFilter={(arg) => {
						setFilterComment(arg);
						handlePageChangeComment(arg);
					}}
				/>
			</div>
			<div className="mt-4">
				<hr />
				<h2 className="text-2xl my-4">tin đăng liên quan</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					{relatedApartment?.apartments.map((apartment) => (
						<ApartmentItem key={apartment.apart_id} apartment={apartment} />
					))}
				</div>
			</div>
		</div>
	) : (
		<NotFound />
	);
}
