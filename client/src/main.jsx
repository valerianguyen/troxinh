import './index.css';

import { StrictMode } from 'react';

import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import App from './App.jsx';
import store from './lib/store';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<Provider store={store}>
		<BrowserRouter
				future={{
					v7_relativeSplatPath: true,
					v7_startTransition: true,
				}}
		>
			<StrictMode>
				<App />
			</StrictMode>
		</BrowserRouter>
	</Provider>,
);
