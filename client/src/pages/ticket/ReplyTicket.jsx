import React, {
  useEffect,
  useState,
} from 'react';

import {
  Loader2,
  Send,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import TicketApi from '@/api/ticket.api';
import { Textarea } from '@/components/ui/textarea';
import { ENUM_STATUS_TICKET } from '@/constant';

import NotFound from '../_notFound';

export default function ReplyTicket() {
	const user = useSelector((state) => state.user);
	const { ticketId } = useParams();
	const [ticket, setTicket] = useState(null);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		const fetchTicket = async () => {
			const response = await TicketApi.getTicketById(ticketId);
			if (response.status === 200) {
				setTicket(response.metadata.data);
			}
		};
		if (!ticket) {
			fetchTicket().finally(() => setLoading(false));
		}
	}, []);
	const [inputMessage, setInputMessage] = useState("");
	const handleSendMessage = async () => {
		if (inputMessage.trim() === "") return;
		const res = await TicketApi.replyTicket(ticketId, {
			message: inputMessage,
		});
		if (res.status === 201) {
			setTicket((prev) => ({
				...prev,
				replies: [...prev.replies, res.metadata.data],
			}));
		}
		setInputMessage("");
	};

	return !loading && !ticket ? (
		<NotFound />
	) : loading ? (
		<>
			<div className="flex justify-center items-center h-screen container mx-auto">
				<Loader2 className="animate-spin size-10" />
			</div>
		</>
	) : (
		<>
			<div className="w-full h-[500px] bg-white border rounded-lg shadow-md flex flex-col container mx-auto">
				<div className="flex-grow overflow-y-auto p-4 space-y-3">
					<div
						className={`flex ${
							ticket.user.usr_id === user.usr_id ? "justify-end" : "justify-start"
						}`}
					>
						<div
							className={`max-w-[70%] text-wrap p-2 rounded-lg ${
								ticket.user.usr_id === user.usr_id
									? "bg-blue-500 text-white"
									: "bg-gray-200 text-black"
							}`}
						>
							<h3 className="font-medium text-base">Title: {ticket.ticket_title}</h3>
							<p className="text-sm line-clamp-2">{ticket.ticket_content}</p>
						</div>
					</div>
					{ticket.replies.map((msg, index) => (
						<div
							key={index}
							className={`flex ${
								msg.ticket_reply_by === user.usr_role ? "justify-end" : "justify-start"
							}`}
						>
							<div
								className={`max-w-[70%] text-wrap p-2 rounded-lg ${
									msg.ticket_reply_by === user.usr_role
										? "bg-blue-500 text-white"
										: "bg-gray-200 text-black"
								}`}
							>
								{msg.message}
							</div>
						</div>
					))}
				</div>

				{/* Input Area */}
				{[ENUM_STATUS_TICKET.PENDING, ENUM_STATUS_TICKET.REPLYING].includes(
					ticket.ticket_status,
				) ? (
					<div className="p-4 border-t flex items-center">
						<Textarea
							value={inputMessage}
							onChange={(e) => setInputMessage(e.target.value)}
							onKeyPress={(e) => {
								if (e.keyCode === 13 && e.shiftKey === false) {
									e.preventDefault();
									handleSendMessage();
								}
							}}
							placeholder="Type a message..."
							className="flex-grow mr-2 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 max-h-10"
						/>
						<button
							onClick={handleSendMessage}
							className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition"
						>
							<Send size={20} />
						</button>
					</div>
				) : (
					<div className="p-4 border-t flex-center">Bạn không thể phản hồi phiếu hỗ trợ này</div>
				)}
			</div>
		</>
	);
}
