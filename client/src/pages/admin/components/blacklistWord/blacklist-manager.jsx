import {
  useEffect,
  useState,
} from 'react';

import { PlusCircle } from 'lucide-react';

import BlacklistWordApi from '@/api/blacklistWord.api';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { AddWordForm } from './add-word-form';
import { BlacklistTable } from './blacklist-table';

export function BlacklistManager() {
	const [blacklistData, setBlacklistData] = useState([]);
	const [isAddingWord, setIsAddingWord] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");

	const filteredWords = blacklistData.filter((word) =>
		word.toLowerCase().includes(searchTerm.toLowerCase()),
	);
	useEffect(() => {
		const fetchData = async () => {
			const response = await BlacklistWordApi.getBlacklistWord();
			if (response?.status === 200) {
				setBlacklistData(response.metadata.data);
			}
		};
		fetchData();
	}, []);
	const addWord = async (words) => {
		const response = await BlacklistWordApi.addBlacklistWord(words.join(","));
		if (response?.status === 201) {
			setBlacklistData([...response.metadata.data]);
		}
		setIsAddingWord(false);
	};

	const removeWord = async (word) => {
		const response = await BlacklistWordApi.deleteBlacklistWord(word);
		if (response?.status === 201) {
			setBlacklistData(response.metadata.data);
		}
	};

	const removeMultipleWords = async (words) => {
		const response = await BlacklistWordApi.deleteBlacklistWord(words.join(","));
		if (response?.status === 201) {
			setBlacklistData(response.metadata.data);
		}
	};

	return (
		<Card className="h-full overflow-auto border-none">
			<CardHeader>
				<CardTitle>Quản lý từ cấm</CardTitle>
				<CardDescription>Quản lý danh sách từ cấm được sử dụng trong hệ thống</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="flex items-center justify-between mb-4">
					<div className="text-sm text-muted-foreground">
						Có {blacklistData.length} từ cấm trong danh sách
					</div>
					<Button variant="outline" onClick={() => setIsAddingWord(true)} disabled={isAddingWord}>
						<PlusCircle className="mr-2 h-4 w-4" />
						Thêm từ mới
					</Button>
				</div>

				{isAddingWord ? (
					<AddWordForm
						onAdd={(words) => addWord(words)}
						onCancel={() => setIsAddingWord(false)}
						existingWords={blacklistData}
					/>
				) : null}

				<BlacklistTable
					words={filteredWords}
					onRemove={removeWord}
					onRemoveMultiple={removeMultipleWords}
					onSearch={setSearchTerm}
					searchTerm={searchTerm}
				/>
			</CardContent>
		</Card>
	);
}
