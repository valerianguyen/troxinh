import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ENUM_STRING_ACTION } from '@/constant';
import { toCapitalized } from '@/utils';

export function ActionDialog({ action, title, color, submit, id, userId }) {
	const [open, setOpen] = useState(false);
	const [reason, setReason] = useState("");
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className={`${color} min-w-20`}>{toCapitalized(ENUM_STRING_ACTION[action])}</Button>
			</DialogTrigger>
			<DialogContent
				className="sm:max-w-[425px] flex flex-col rounded-md"
				aria-describedby={undefined}
			>
				<DialogHeader className="mb-4">
					<DialogTitle className="font-normal">
						Bạn có muốn {ENUM_STRING_ACTION[action]} <span className="font-semibold">{title}</span> không?
					</DialogTitle>
				</DialogHeader>
				{action === 2 && (
					<textarea
						className="w-full p-2 border border-gray-300 rounded-lg"
						placeholder="Nhập lý do khóa bài đăng"
						value={reason}
						onChange={(e) => setReason(e.target.value)}
					></textarea>
				)}
				<DialogFooter>
					<div className="flex gap-2 justify-end">
						<Button
							onClick={async () => {
								await submit(userId, id, reason);
								setOpen(false);
							}}
							className="bg-blue-400 hover:bg-blue-300"
						>
							Xác nhận
						</Button>
						<Button className="bg-red-500" onClick={() => setOpen(false)}>
							Hủy
						</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
