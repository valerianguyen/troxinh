Cách setup project:
Project hiện tại có 3 folder: Client để chạy frontend(react.js),Server để chạy backend nodejs(express.js), Server_AI để chạy backend API python(fastapi).
- Đầu tiên:
+ Yêu cầu cần có xampp ( để chạy database mysql)
+ Start apache và mysql.
+ Tạo database.
+ Sau đó vào file `.env` trong folder `server` thay 
`DB_NAME=thuecanho`
`DB_USER=guest`
`DB_PASSWORD=guest`
`DB_HOST=localhost`
`DB_PORT=3307`
vào các giá trị tương ứng.
- Tải các dependecies cần thiết:
`cd client;npm i;` sau khi tải xong `npm run dev` để chạy frontend.
- Mở 1 terminal nữa để chạy backend:
`cd server;npm i` sau khi tải xong `npm run dev` để chạy backend.
- Mở thêm 1 terminal nữa để chạy backend cho AI:
+ Yêu cầu python 3.12.x
+ Chạy lệnh: `cd server_ai` sau đó chạy `python -m venv venv`
+ Tiếp đó chạy lệnh: `.\venv\Scripts\Activate.ps1`
+ Tiếp theo tải các module cần thiết: `pip install -r requirements.txt`
+ Khi đã tải xong chạy `uvicorn main:app --reload` để chạy server. Thế là xong.
