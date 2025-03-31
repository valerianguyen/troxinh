import { NavLink } from 'react-router-dom';

export default function Footer() {
	return (
		<footer>
			<div className="mx-auto mt-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
				<div className="text-3xl flex justify-center text-teal-600">
					<NavLink
						to="/"
						className={`h-10 flex items-center text-xl font-logo text-pink-600 font-semibold`}
					>
						Trọ xinh
					</NavLink>
				</div>

				<p className="mx-auto mt-6 max-w-md text-center leading-relaxed text-gray-500">
					Lorem ipsum dolor, sit amet consectetur adipisicing elit. Incidunt consequuntur amet culpa
					cum itaque neque.
				</p>
			</div>
		</footer>
	);
}
