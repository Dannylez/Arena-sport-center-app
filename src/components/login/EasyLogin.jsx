import styles from './login.module.css';
import { useNavigate } from 'react-router-dom';
import { login } from '../../utils/auth';
import { useDispatch } from 'react-redux';
import { verifyUser } from '../../redux/auth/authSlice';

export function EasyLogin() {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const logAsTrainer = async () => {
		const data = {
			email: 'ceci@gmail.com',
			password: '1234',
		};
		try {
			data.email = data.email.toLowerCase();
			const res = await login(data);
			const token = localStorage.getItem('token');
			dispatch(verifyUser(token));
			if (res === 'Sesión iniciada') {
				return navigate('/schedule');
			}
		} catch (error) {
			console.error(error);
		}
	};

	const logAsAdmin = async () => {
		const data = {
			email: 'admin',
			password: 'admin123',
		};
		try {
			data.email = data.email.toLowerCase();
			const res = await login(data);
			const token = localStorage.getItem('token');
			dispatch(verifyUser(token));
			if (res === 'Sesión iniciada') {
				return navigate('/schedule');
			}
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className={styles.container}>
			<div className={styles.form}>
				<button
					className={styles.addBtn}
					onClick={() => logAsTrainer()}
				>
					Log as Trainer
				</button>
				<button
					className={styles.addBtn}
					onClick={() => logAsAdmin()}
				>
					Log as Admin
				</button>
				<p>
					<strong>Disclaimer:</strong> This is a development
					version of the website, so some features may not
					work as expected. Feel free to explore and
					interact with everything on the page!
				</p>
			</div>
		</div>
	);
}
