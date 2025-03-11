import React from "react";
import { Star } from "@geist-ui/icons";

export default function Rating({ rate, setRate, className }) {
	return (
		<div className="flex gap-2 mt-2" title={rate}>
			{[1, 2, 3, 4, 5].map((item, index) => (
				<Star
					key={index}
					className={`${className} cursor-pointer`}
					fill={rate >= item ? "yellow" : "white"}
					onClick={() => {
						if (setRate) setRate(item);
					}}
				/>
			))}
		</div>
	);
}
