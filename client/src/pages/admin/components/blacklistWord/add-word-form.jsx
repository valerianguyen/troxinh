"use client";

import { useState } from 'react';

import { AlertCircle } from 'lucide-react';

import {
  Alert,
  AlertDescription,
} from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export function AddWordForm({ onAdd, onCancel, existingWords }) {
	const [word, setWord] = useState("");
	const [error, setError] = useState(null);

	const handleSubmit = (e) => {
		e.preventDefault();

		// Validation
		if (!word.trim()) {
			setError("Vui lòng nhập từ cần thêm vào danh sách");
			return;
		}
		const sliptWords = word.split(",").map((w) => w.trim().toLowerCase()).filter((w) => w.length > 0);
    if(sliptWords.length === 0) {
      setError("Vui lòng nhập từ cần thêm vào danh sách");
      return;
    }
		const newWords = new Set([...existingWords.map((w) => w.toLowerCase()), ...sliptWords]);
		onAdd([...newWords]);
	};

	return (
		<Card className="mb-6">
			<form onSubmit={handleSubmit}>
				<CardHeader>
					<CardTitle>Thêm từ mới</CardTitle>
					<CardDescription>Các từ cách nhau bởi dấu phẩy</CardDescription>
				</CardHeader>
				<CardContent>
					{error && (
						<Alert variant="destructive" className="mb-4">
							<AlertCircle className="h-4 w-4" />
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}
					<div className="grid gap-4">
						<div className="grid gap-2">
							<label htmlFor="word" className="text-sm font-medium">
								Từ cấm
							</label>
							<Input
								id="word"
								placeholder="Mỗi từ cách nhau bởi dấu phẩy"
								value={word}
								onChange={(e) => {
									setWord(e.target.value);
									setError(null);
								}}
								autoFocus
							/>
							<p className="text-xs text-muted-foreground">
								Từ này sẽ được lọc từ tất cả các nội dung người dùng.
							</p>
						</div>
					</div>
				</CardContent>
				<CardFooter className="flex justify-between">
					<Button variant="outline" onClick={onCancel} type="button">
						Hủy
					</Button>
					<Button type="submit">Thêm vào danh sách</Button>
				</CardFooter>
			</form>
		</Card>
	);
}
