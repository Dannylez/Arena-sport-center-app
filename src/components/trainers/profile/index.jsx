/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTrainerById } from '../../../redux/trainer/trainerSlice';
import styles from './profile.module.css';
import { fetchActivities } from '../../../redux/activity/activitySlice';
import { fetchMembers } from '../../../redux/member/memberSlice';
import { differenceInYears } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import editTrainer from '../../../utils/trainer/editTrainer';
import Modal from '../../shared/modal';

function TrainerProfile(id) {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { trainer } = useSelector((state) => state.trainer);
	const { activities } = useSelector(
		(state) => state.activity
	);
	const { members } = useSelector((state) => state.member);
	const { loadingAuth, role, user } = useSelector(
		(state) => state.auth
	);

	const [allMembers, setAllMembers] = useState([]);
	const [totalFee, setTotalFee] = useState(0);
	const [changePass, setChangePass] = useState(false);
	const [modalSuccess, setModalSuccess] = useState(false);
	const [modalMessage, setModalMessage] = useState('');
	const [isAdmin, setIsAdmin] = useState(false);
	const [isTrainer, setIsTrainer] = useState(false);

	const { register, handleSubmit } = useForm({
		mode: 'onChange',
	});

	useEffect(() => {
		isAdmin
			? dispatch(fetchTrainerById(id.id))
			: dispatch(fetchTrainerById(user));
		dispatch(fetchActivities());
		dispatch(fetchMembers());
	}, []);

	useEffect(() => {
		if (modalMessage) {
			setModalSuccess(true);
			setTimeout(async () => {
				setModalSuccess(false);
				setModalMessage('');
			}, 3000);
		}
	}, []);

	useEffect(() => {
		if (!role && !loadingAuth) {
			navigate('/', {
				state: { error: 'Acceso denegado' },
			});
		}
		if (role === 'ADMIN') {
			setIsAdmin(true);
		}
		if (role === 'TRAINER') {
			setIsTrainer(true);
		}
	}, []);

	useEffect(() => {
		setChangePass(false);
	}, []);

	useEffect(() => {
		let sumOfMembers = [];
		let final = 0;

		activities.forEach((activity) => {
			const membersInActivities = trainer.classes
				?.filter(
					(clase) =>
						clase.activity._id === activity._id &&
						clase.trainer?._id === trainer.id
				)
				.flatMap((clase) =>
					clase.members.map((member) => member._id)
				);
			console.log('members', membersInActivities);
			if (membersInActivities) {
				const setUniqueMembers = new Set(
					membersInActivities
				);
				sumOfMembers = [
					...sumOfMembers,
					...setUniqueMembers,
				];
				const membersToFee = [...setUniqueMembers];
				const feeArray = membersToFee.map((memberId) => {
					return members.find(
						(member) => member._id === memberId
					);
				});
				const fee = feeArray.map((member) => {
					console.log('member', member);
					return member?.contracts?.find(
						(cont) => cont.activity === activity._id
					)?.price;
				});
				const newFee = fee.reduce(
					(acumulador, numero) => acumulador + numero,
					0
				);
				final = final + newFee;
				setTotalFee(final);
				console.log('activity', activity);
				console.log('fee', fee);
				console.log('totalFee', totalFee);
			}
		});
		console.log(sumOfMembers);
		setAllMembers(sumOfMembers);
	}, [trainer]);

	const onSubmit = async (data) => {
		try {
			const res = await editTrainer(trainer?._id, data);
			setChangePass(false);
			console.log(res);
			setModalMessage(res.data.message);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div>
			<Modal popUp success isOpen={modalSuccess}>
				{modalMessage}
			</Modal>
			{!changePass ? (
				isAdmin ? (
					<div>
						<h2 className={styles.title}>
							{trainer?.firstName} {trainer?.lastName}
						</h2>
						<div className={styles.personalData}>
							<p className={styles.p}>
								Email: {trainer.email}
							</p>
							<p className={styles.p}>
								Teléfono: {trainer.phone}
							</p>
							<p className={styles.p}>
								Edad:{' '}
								{differenceInYears(
									new Date(),
									new Date(trainer.birthDay)
								)}
							</p>
							<p className={styles.p}>
								Servicio médico: {trainer.medService}
							</p>
						</div>
						<p className={styles.p}>Clases:</p>
						<div className={styles.activityBox}>
							{trainer.classes?.map((clase) => {
								return (
									<p key={clase._id} className={styles.p}>
										{clase.activity.name} ({clase.day}{' '}
										{clase.startsAt})
									</p>
								);
							})}
						</div>
						<p className={styles.p}>
							Alumnos totales: {allMembers.length}
						</p>
						<p className={styles.p}>
							Cuota total: {totalFee}
						</p>
						<div className={styles.divBtns}>
							<button
								className={styles.btn}
								onClick={() =>
									navigate('./form', {
										state: { id: trainer?._id },
									})
								}
							>
								Editar profesor
							</button>
							<button
								className={styles.btn}
								onClick={() => setChangePass(true)}
							>
								Cambiar Contraseña
							</button>
						</div>
					</div>
				) : (
					<div className={styles.trainerContainer}>
						<h2 className={styles.title}>
							{trainer?.firstName} {trainer?.lastName}
						</h2>
						<div className={styles.personalData}>
							<p className={styles.p}>
								Email: {trainer.email}
							</p>
							<p className={styles.p}>
								Teléfono: {trainer.phone}
							</p>
							<p className={styles.p}>
								Edad:{' '}
								{differenceInYears(
									new Date(),
									new Date(trainer.birthDay)
								)}
							</p>
							<p className={styles.p}>
								Servicio médico: {trainer.medService}
							</p>
						</div>
						<p className={styles.p}>Clases:</p>
						<div className={styles.activityBox}>
							{trainer.classes?.map((clase) => {
								return (
									<p key={clase._id} className={styles.p}>
										{clase.activity.name} ({clase.day}{' '}
										{clase.startsAt})
									</p>
								);
							})}
						</div>
						<p className={styles.p}>
							Alumnos totales: {allMembers.length}
						</p>
						<p className={styles.p}>
							Cuota total: {totalFee}
						</p>
						<div className={styles.divBtns}>
							<button
								className={styles.btn}
								onClick={() =>
									navigate('./form', {
										state: { id: trainer?._id },
									})
								}
							>
								Editar profesor
							</button>
							<button
								className={styles.btn}
								onClick={() => setChangePass(true)}
							>
								Cambiar Contraseña
							</button>
						</div>
					</div>
				)
			) : (
				<div className={styles.container}>
					<h2 className={styles.title}>
						{trainer?.firstName} {trainer?.lastName}
					</h2>{' '}
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className={styles.formField}>
							<label className={styles.formLabel}>
								Nueva contraseña:
							</label>
							<input
								name="password"
								className={styles.formInput}
								{...register('password')}
							></input>{' '}
						</div>
						<div className={styles.divBtns}>
							<button className={styles.btn} type="submit">
								Aceptar
							</button>
							<button
								className={styles.btn}
								onClick={() => setChangePass(false)}
							>
								Cancelar
							</button>
						</div>
					</form>
				</div>
			)}
		</div>
	);
}

export default TrainerProfile;
