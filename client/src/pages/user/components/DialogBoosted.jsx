import { useState } from 'react';

import {
  Check,
  ChevronsUpDown,
  Clock,
} from 'lucide-react';

import ApartmentApi from '@/api/apartment.api';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import {
  ENUM_PRIORY,
  ENUM_STRING_PRIORY,
} from '@/constant';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/utils/formatCurrency';

const calculatePrice = ({ config, currentPriority, duration, endDate, newPriority }) => {
	const result = {
		amountToPay: config[newPriority] * duration,
	};
	const now = new Date().getTime();
	endDate = new Date(endDate).getTime();
	if (now < endDate) {
		result["remain_time"] = Math.floor((endDate - now) / (24 * 60 * 60 * 1000));
		result["amount_to_upgrade"] =
			(config[newPriority] - config[currentPriority]) * result["remain_time"];
		result["amountToPay"] += result["amount_to_upgrade"];
	}
	return result;
};
function AmountComponent({ config, currentPriority, duration, endDate, priority }) {
	const resultCalculateAmount = calculatePrice({
		config,
		currentPriority,
		duration: duration[0],
		endDate,
		newPriority: priority,
	});
	return (
		<div className="flex flex-1 gap-2 flex-col">
			<div>
				<div className="text-sm text-muted-foreground">
					{ENUM_STRING_PRIORY[currentPriority]} đến {ENUM_STRING_PRIORY[priority]} trong{" "}
					{resultCalculateAmount.remain_time} ngày
				</div>
				<div className="text-sm font-semibold">
					{formatCurrency("" + resultCalculateAmount.amount_to_upgrade * 100)}
				</div>
			</div>
			<div>
				<div className="text-sm text-muted-foreground">Tổng cộng</div>
				<div className="text-sm font-semibold">
					{formatCurrency("" + resultCalculateAmount.amountToPay * 100)}
				</div>
			</div>
		</div>
	);
}
export default function DialogBoosted({ config, endDate, currentPriority, apart_id }) {
	const [open, setOpen] = useState(false);
	const [priority, setPriority] = useState(0);
	const [duration, setDuration] = useState([1]);
	const [popoverOpen, setPopoverOpen] = useState(false);
	const handleSubmit = async () => {
		const response = await ApartmentApi.boostApartment(apart_id, {
			priority,
			duration: duration[0],
		});
		if (response?.status === 200) {
			window.open(response.metadata.data.payment_url, "_self");
		}
		setOpen(false);
	};
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="default" className="bg-[#8B5CF6] ">
					Đẩy tin
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Đẩy tin</DialogTitle>
					<DialogDescription>Chọn độ ưu tiên và thời gian bạn muốn</DialogDescription>
				</DialogHeader>
				<div>
					<Label>Đẩy tin giúp bài viết của bạn được nhiều người xem hơn</Label>
					{/* Show config */}
					<div className="grid grid-cols-2 mt-2">
						{config &&
							Object.entries(config).map(([key, value]) => (
								<div key={key} className="flex items-center gap-2">
									<div className="text-sm text-muted-foreground">{ENUM_STRING_PRIORY[key]}:</div>
									<div className="text-sm font-semibold">{`${formatCurrency("" + value * 100)}${
										key != ENUM_PRIORY.DEFAULT ? " / ngày" : ""
									}`}</div>
								</div>
							))}
					</div>
				</div>
				<div className="grid gap-6 py-4">
					<div className="grid gap-2">
						<Label htmlFor="priority">Độ ưu tiên</Label>
						<Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
							<PopoverTrigger asChild>
								<Button
									id="priority"
									variant="outline"
									role="combobox"
									aria-expanded={popoverOpen}
									className="justify-between"
								>
									{ENUM_STRING_PRIORY[priority]}
									<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-[200px] p-0">
								<Command>
									<CommandInput placeholder="Tìm độ ưu tiên..." />
									<CommandList>
										<CommandEmpty>Không thấy độ ưu tiên nào</CommandEmpty>
										<CommandGroup>
											{Object.values(ENUM_PRIORY).map((l) => (
												<CommandItem
													key={l}
													value={l}
													onSelect={(currentValue) => {
														if (currentValue !== ENUM_STRING_PRIORY[ENUM_PRIORY.DEFAULT]) {
															setPriority(
																parseInt(
																	Object.entries(ENUM_STRING_PRIORY).find(
																		([k, v]) => v === currentValue,
																	)[0],
																),
															);
															setPopoverOpen(false);
														}
													}}
												>
													<Check
														className={cn(
															"mr-2 h-4 w-4",
															priority === l ? "opacity-100" : "opacity-0",
														)}
													/>
													{ENUM_STRING_PRIORY[l]}
												</CommandItem>
											))}
										</CommandGroup>
									</CommandList>
								</Command>
							</PopoverContent>
						</Popover>
					</div>
					{priority != ENUM_PRIORY.DEFAULT && (
						<div className="grid gap-2">
							<div className="flex items-center justify-between">
								<Label htmlFor="duration">Thời hạn (ngày)</Label>
								<div className="flex items-center text-sm text-muted-foreground">
									<Clock className="mr-1 h-4 w-4" />
									<span>{duration[0]} ngày</span>
								</div>
							</div>
							<Slider
								id="duration"
								className="py-4"
								thumbClassName="h-5 w-5 bg-white border-2 border-rose-500 shadow-md hover:border-rose-600"
								trackClassName="h-2 bg-gray-100"
								rangeClassName="h-2 bg-rose-500"
								value={duration}
								min={1}
								max={60}
								step={1}
								defaultValue={[1]}
								onValueChange={setDuration}
							/>
							<div className="flex justify-between text-xs text-muted-foreground">
								<span>1 ngày</span>
								<span>60 ngày</span>
							</div>
						</div>
					)}
				</div>
				<DialogFooter>
					{priority != ENUM_PRIORY.DEFAULT ? (
						<AmountComponent
							config={config}
							currentPriority={currentPriority}
							duration={duration}
							endDate={endDate}
							priority={priority}
						></AmountComponent>
					) : null}
					<Button onClick={() => setOpen(false)} className="bg-red-500">
						Hủy
					</Button>
					<Button
						onClick={async () => await handleSubmit()}
						disabled={priority == ENUM_PRIORY.DEFAULT}
						className="bg-blue-500"
					>
						Thanh toán
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
