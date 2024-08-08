/* eslint-disable react-hooks/exhaustive-deps */
import Header from './components/shared/header';
import styles from './app.module.css';
import Schedule from './components/schedule';
import Landing from './components/landing';
import MemberList from './components/members/list';
import MemberForm from './components/members/form';
import {
	Route,
	Routes,
	useLocation,
} from 'react-router-dom';
import { useEffect, useState } from 'react';
import Login from './components/login';
import TrainerProfile from './components/trainers/profile';
import ClassForm from './components/admin/class-form';
import Footer from './components/shared/footer';
import { useDispatch, useSelector } from 'react-redux';
import { verifyUser } from './redux/auth/authSlice';
import Loader from './components/shared/loader';
import TrainerList from './components/admin/trainers/list';
import TrainerForm from './components/admin/trainers/form';
import ContractList from './components/admin/contracts/list';
import ContractForm from './components/admin/contracts/form';
import { EasyLogin } from './components/login/EasyLogin';

function App() {
	const location = useLocation();
	const dispatch = useDispatch();
	const [menuOpened, setMenuOpened] = useState(false);

	const [windowSize, setWindowSize] = useState({
		width: window.innerWidth,
		height: window.innerHeight,
	});

	const { role } = useSelector((state) => state.auth);

	useEffect(() => {
		const handleResize = () => {
			setWindowSize({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		};
		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, [window.innerWidth]);

	useEffect(() => {
		const token = localStorage.getItem('token');
		dispatch(verifyUser(token));
	}, [location.pathname]);

	return (
		<div className={styles.allContent}>
			<div className={styles.header}>
				<Header
					menuOpened={menuOpened}
					setMenuOpened={setMenuOpened}
				/>
			</div>

			<div
				className={styles.principalContent}
				onClick={() => setMenuOpened(false)}
			>
				<Routes>
					<Route path="/" element={<Landing />} />
					<Route path="/schedule" element={<Schedule />} />
					<Route
						path="/class/form"
						element={<ClassForm />}
					></Route>
					<Route path="/members" element={<MemberList />} />
					<Route
						path="/members/form"
						element={<MemberForm />}
					/>
					<Route
						path="/trainers"
						element={<TrainerList />}
					/>
					<Route
						path="/trainers/form"
						element={<TrainerForm />}
					/>
					<Route
						path="/contracts"
						element={<ContractList />}
					/>
					<Route path="/login" element={<EasyLogin />} />
					<Route path="/loader" element={<Loader />} />
				</Routes>
			</div>
			<div className={styles.footer}>
				<Footer />
			</div>
		</div>
	);
}

export default App;
