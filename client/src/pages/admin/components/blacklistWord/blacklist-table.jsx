"use client";

import { useState } from 'react';

import {
  Search,
  Trash,
} from 'lucide-react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export function BlacklistTable({ words, onRemove, onRemoveMultiple, onSearch, searchTerm }) {
	const [selectedWords, setSelectedWords] = useState([]);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

	const handleSelectAll = () => {
		if (selectedWords.length === words.length) {
			setSelectedWords([]);
		} else {
			setSelectedWords([...words]);
		}
	};

	const handleSelectWord = (word) => {
		if (selectedWords.includes(word)) {
			setSelectedWords(selectedWords.filter((w) => w !== word));
		} else {
			setSelectedWords([...selectedWords, word]);
		}
	};

	const handleDeleteSelected = () => {
		onRemoveMultiple(selectedWords);
		setSelectedWords([]);
		setIsDeleteDialogOpen(false);
	};

	return (
		<div className="space-y-4">
			<div className="flex flex-col sm:flex-row justify-between gap-4">
				<div className="relative w-full sm:w-64">
					<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder="Tìm kiếm từ cấm..."
						className="pl-8"
						value={searchTerm}
						onChange={(e) => onSearch(e.target.value)}
					/>
				</div>
				<div className="flex gap-2">
					{selectedWords.length > 0 && (
						<Button variant="destructive" size="sm" onClick={() => setIsDeleteDialogOpen(true)}>
							<Trash className="mr-2 h-4 w-4" />
							Xóa ({selectedWords.length})
						</Button>
					)}
				</div>
			</div>

			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-12">
								<Checkbox
									checked={selectedWords.length === words.length && words.length > 0}
									indeterminate={
										selectedWords.length > 0 && selectedWords.length < words.length
											? "true"
											: undefined
									}
									onCheckedChange={handleSelectAll}
									aria-label="Select all"
								/>
							</TableHead>
							<TableHead>Từ cấm</TableHead>
							<TableHead className="w-12"></TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{words.length === 0 ? (
							<TableRow>
								<TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
									{searchTerm ? "Không tìm thấy từ này" : "Chưa có từ cấm nào"}
								</TableCell>
							</TableRow>
						) : (
							words.map((word) => (
								<TableRow key={word}>
									<TableCell>
										<Checkbox
											checked={selectedWords.includes(word)}
											onCheckedChange={() => handleSelectWord(word)}
											indeterminate={
												selectedWords.length > 0 && !selectedWords.includes(word)
													? "true"
													: undefined
											}
											aria-label={`Select ${word}`}
										/>
									</TableCell>
									<TableCell className="font-medium">{word}</TableCell>
									<TableCell>
										<Button
											variant="ghost"
											size="icon"
											onClick={() => onRemove(word)}
											aria-label={`Delete ${word}`}
										>
											<Trash className="h-4 w-4" />
										</Button>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			<AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Bạn có muốn xóa chúng?</AlertDialogTitle>
						<AlertDialogDescription>
							{selectedWords.length} từ này sẽ được xóa vĩnh viễn khỏi danh sách.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Hủy</AlertDialogCancel>
						<AlertDialogAction onClick={handleDeleteSelected}>Xóa</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
