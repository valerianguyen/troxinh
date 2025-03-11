"use client";

import * as React from 'react';

import {
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const slides = [
	{
		image: "/slide/banner1.webp",
		title: "Banner 1",

	},
	{
		image: "/slide/banner2.webp",
		title: "Banner 2",
	},
	{
		image: "/slide/banner3.webp",
    title: "Banner 3",
	},
];
export function BannerSlider({ autoPlay = true, interval = 5000, className, ...props }) {
	const [currentSlide, setCurrentSlide] = React.useState(0);
	const [isPaused, setIsPaused] = React.useState(false);
	const totalSlides = slides.length;

	const nextSlide = React.useCallback(() => {
		setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
	}, [totalSlides]);

	const prevSlide = React.useCallback(() => {
		setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
	}, [totalSlides]);

	React.useEffect(() => {
		if (autoPlay && !isPaused) {
			const timer = setInterval(() => {
				nextSlide();
			}, interval);
			return () => clearInterval(timer);
		}
	}, [autoPlay, interval, isPaused, nextSlide]);

	return (
		<div
			className={cn("relative overflow-hidden rounded-lg", className)}
			onMouseEnter={() => setIsPaused(true)}
			onMouseLeave={() => setIsPaused(false)}
			{...props}
		>
			<div
				className="flex transition-transform duration-500 ease-in-out"
				style={{ transform: `translateX(-${currentSlide * 100}%)` }}
			>
				{slides.map((slide, index) => (
					<div key={index} className="relative min-w-full">
						<img
							src={slide.image || "/placeholder.svg"}
							alt={slide.title}
							className="w-full object-cover"
						/>
					</div>
				))}
			</div>

			<Button
				variant="outline"
				size="icon"
				className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/30 backdrop-blur-sm hover:bg-white/50"
				onClick={prevSlide}
				aria-label="Previous slide"
			>
				<ChevronLeft className="h-6 w-6" />
			</Button>

			<Button
				variant="outline"
				size="icon"
				className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/30 backdrop-blur-sm hover:bg-white/50"
				onClick={nextSlide}
				aria-label="Next slide"
			>
				<ChevronRight className="h-6 w-6" />
			</Button>

			<div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
				{slides.map((_, index) => (
					<button
						key={index}
						className={cn(
							"h-2 w-2 rounded-full transition-all",
							currentSlide === index ? "w-6 bg-primary" : "bg-white/50",
						)}
						onClick={() => setCurrentSlide(index)}
						aria-label={`Go to slide ${index + 1}`}
					/>
				))}
			</div>
		</div>
	);
}
