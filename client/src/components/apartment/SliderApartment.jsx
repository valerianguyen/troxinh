// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

import React, {
  useEffect,
  useState,
} from 'react';

import {
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  Navigation,
  Pagination,
} from 'swiper/modules';
import {
  Swiper,
  SwiperSlide,
} from 'swiper/react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const SliderApartment = ({ apartImages }) => {
	const [thumbImage, setThumbImage] = useState(apartImages[0]?.img_url);
	const [swiper, setSwiper] = useState(null);
	const [key, setKey] = useState(0);
	const handlePrev = () => {
		if (swiper.activeIndex === 0) return;
		setThumbImage(apartImages[swiper.activeIndex - 1]?.img_url);
		swiper.slidePrev();
	};

	const handleNext = () => {
		if (swiper.activeIndex === apartImages.length - 1) return;
		setThumbImage(apartImages[swiper.activeIndex + 1]?.img_url);
		swiper.slideNext();
	};

	if (!apartImages?.length) {
		return null;
	}
	useEffect(()=>{
		setThumbImage(apartImages[0]?.img_url);	
		setKey((prevKey) => prevKey + 1);
	},[apartImages[0]?.img_url])

	return (
		<div className="flex flex-col overflow-hidden md:w-1/2 select-none">
			{/* Main Image Display */}
			<div className="relative overflow-hidden border-2 border-gray-400  rounded-md w-full md:h-[350px] lg:h-[500px] xl:h-[600px]">
				<Dialog>
					<DialogTrigger asChild>
						<img
							src={thumbImage}
							alt="Selected apartment view"
							className="w-full h-full object-cover ro"
						/>
					</DialogTrigger>
					<DialogContent
						className="max-w-none bg-transparent border-none outline-none h-[90%]"
						classNameClose={"size-10 flex-center rounded-full bg-white top-0 focus:ring-0"}
						aria-describedby={undefined}
					>
						<DialogHeader className={"hidden"}>
							<DialogTitle></DialogTitle>
						</DialogHeader>
						<div className="h-full absolute w-full p-5">
							<img
								src={thumbImage}
								alt="Selected apartment view"
								className="w-full h-full object-contain"
							/>
						</div>
					</DialogContent>
				</Dialog>
			</div>

			{/* Thumbnail Slider */}
			<div className="relative mt-4">
				<Swiper
					onSwiper={(swiper) => {
						setSwiper(swiper);
					}}
					key={key}
					centeredSlides={true}
					slidesPerView={2}
					spaceBetween={10}
					navigation={false}
					pagination={{
						type: "fraction",
					}}
					modules={[Navigation, Pagination]}
					className="h-[100px]"
					breakpoints={{
						540: {
							slidesPerView: 3,
						},
						1024: {
							slidesPerView: Math.min(apartImages.length, 4),
						},
					}}
				>
					{apartImages.map((image, index) => (
						<SwiperSlide
							key={image.img_url || index}
							className={`overflow-hidden rounded-md cursor-pointer ${
								thumbImage === image.img_url ? "border-red-400 border-2" : ""
							}`}
							onClick={() => setThumbImage(image.img_url)}
						>
							<img
								src={image.img_url}
								alt={`Apartment view ${index + 1}`}
								loading="lazy"
								className="w-full h-full object-cover"
							/>
						</SwiperSlide>
					))}
				</Swiper>

				{/* Navigation Buttons */}
				<button
					onClick={handlePrev}
					className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-gray-400 hover:bg-gray-300 shadow-md transition-all"
				>
					<ChevronLeft className="w-5 h-5" />
				</button>
				<button
					onClick={handleNext}
					className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-gray-400 shadow-md transition-all"
				>
					<ChevronRight className="w-5 h-5" />
				</button>
			</div>
		</div>
	);
};

export default SliderApartment;
