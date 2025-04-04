
export default function NotFound() {
	return (
		<div>
			<div className="h-[calc(100vh-300px)] flex-col flex-center">
				<p className="text-base font-semibold text-indigo-600">404</p>
				<h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">Trang này không tồn tại</h1>
				<p className="mt-6 text-base leading-7 text-gray-600">Xin lỗi, chúng tôi không tìm thấy trang bạn yêu cầu</p>
				<div className="mt-10 flex-center gap-x-6">
					<a href="/" className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Về trang chủ</a>
					<a href="/contact" className="text-sm font-semibold text-gray-900">Liên hệ hỗ trợ<span aria-hidden="true">&rarr;</span></a>
				</div>
			</div>

		</div>
	)
}