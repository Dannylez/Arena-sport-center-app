/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import styles from './form.module.css';
import { useController, useForm } from 'react-hook-form';
import Joi from 'joi';
import Select from 'react-select';
import { joiResolver } from '@hookform/resolvers/joi';
import { addYears, format, parse, subYears } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClasses } from '../../../redux/class/classSlice';
import { fetchContracts } from '../../../redux/contract/contractSlice';
import createMember from '../../../utils/member/createMember';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Modal from '../../shared/modal';
import { fetchMemberById } from '../../../redux/member/memberSlice';
import editMember from '../../../utils/member/editMember';

function MemberForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { classes } = useSelector((state) => state.class);
  const { contracts } = useSelector((state) => state.contract);
  const { member } = useSelector((state) => state.member);

  const [classesOptions, setClassesOptions] = useState([]);
  const [contractsOptions, setContractsOptions] = useState([]);
  const [modalError, setModalError] = useState(false);
  const [messageError, setMessageError] = useState('');
  const [inputs, setInputs] = useState([]);
  const [onEdit, setOnEdit] = useState(false);

  const maxBirthDay = format(subYears(new Date(), 3), 'yyyy-MM-dd');
  const minBirthDay = format(subYears(new Date(), 100), 'yyy-MM-dd');
  const maxVigencyDate = format(addYears(new Date(), 10), 'yyy-MM-dd');
  const minVigencyDate = format(new Date(), 'yyy-MM-dd');
  const createSchema = Joi.object({
    firstName: Joi.string()
      .required()
      .min(3)
      .max(15)
      .pattern(/^[a-zA-Z-]+$/)
      .messages({
        'string.pattern.base': 'El nombre solo puede contener letras',
        'string.min': 'El nombre debe contener al menos 3 caracteres',
        'string.max': 'El nombre no puede tener mas de 15 caracteres',
        'string.empty': 'Campo obligatorio',
      }),
    lastName: Joi.string()
      .required()
      .min(3)
      .max(25)
      .pattern(/^[a-zA-Z-]+$/)
      .messages({
        'string.pattern.base': 'El apellido solo puede contener letras',
        'string.min': 'El apellido debe contener al menos 3 caracteres',
        'string.max': 'El apellido no puede tener mas de 25 caracteres',
        'string.empty': 'Campo obligatorio',
      }),
    ci: Joi.string()
      .required()
      .min(7)
      .max(8)
      .pattern(/^[0-9]+$/)
      .messages({
        'string.pattern.base': 'Cédula de identidad sin puntos ni guiones',
        'string.min': 'Debe contener 7 u 8 números',
        'string.max': 'Debe contener 7 u 8 números',
        'string.empty': 'Campo obligatorio',
      }),
    phone: Joi.string()
      .min(7)
      .max(15)
      .allow('')
      .pattern(/^[0-9]+$/)
      .messages({
        'string.pattern.base': 'Solo se aceptan números',
        'string.min': 'Debe contener al menos 7 números',
        'string.max': 'Número de teléfono demasiado largo',
      }),
    email: Joi.string()
      .allow('')
      .pattern(/^[^@]+@[^@]+\.[a-zA-Z]{2,}$/)
      .messages({ 'string.pattern.base': 'Formato de Email inválido' }),
    birthDay: Joi.date().required().min(minBirthDay).max(maxBirthDay).messages({
      'string.empty': 'Campo obligatorio',
      'date.min': 'El alumno no puede tener mas de 100 años',
      'date.max': 'El alumno no puede tener menos de 3 años',
    }),
    medService: Joi.string().allow('').min(2).max(25).messages({
      'string.min': 'Debe contener al menos 2 caracteres',
      'string.max': 'Debe contener menos de 25 caracteres',
    }),
    healthCardUpToDate: Joi.boolean(),
    healthCardVigency: Joi.date().allow('').min(minVigencyDate).messages({
      'date.min': 'No ingresar carnets vencidos',
    }),
    classes: Joi.array().items(Joi.string()),
    contracts: Joi.array().items(Joi.string()),
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    onChange,
    control,
    formState: { errors, touchedFields },
  } = useForm({
    mode: 'onChange',
    resolver: joiResolver(createSchema),
    defaultValues: inputs,
  });

  const formatDate = (date) => {
    const dateParsed = parse(date, 'dd/MM/yyyy', new Date());
    const dateFormated = format(dateParsed, 'yyyy-MM-dd');
    return dateFormated;
  };

  const watchAllFields = watch();

  const {
    field: { value: clase, onChange: onClassChange },
  } = useController({ name: 'classes', control });

  const {
    field: { value: contract, onChange: onContractChange },
  } = useController({ name: 'contracts', control });

  const onSubmit = async (data) => {
    data.birthDay = format(data.birthDay, 'dd/MM/yyyy');
    data.healthCardVigency = format(data.healthCardVigency, 'dd/MM/yyyy');
    try {
      let res;
      onEdit
        ? (res = await editMember(location.state?.id, data))
        : (res = await createMember(data));
      if (res.data) {
        navigate('/members', {
          state: { message: res.data.message, class: location.state.class },
        });
      } else {
        setMessageError(res);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onError = (errors) => console.error(errors);

  useEffect(() => {
    let orderedClasses = [...classes];

    orderedClasses.sort((a, b) => {
      const nameA = a.startsAt;
      const nameB = b.startsAt;
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });

    setClassesOptions(
      orderedClasses.map((clase) => ({
        value: clase._id,
        label: `${clase.activity?.name} (${clase.day.substring(0, 3)} ${
          clase.startsAt
        })`,
      })),
    );
  }, [classes]);

  useEffect(() => {
    const activities = classes.filter((obj2) =>
      watchAllFields.classes?.some((obj1) => obj1.value === obj2._id),
    );
    const newContracts = contracts.filter((obj2) =>
      activities.some((obj1) => obj1.activity?._id === obj2.activity?._id),
    );
    const setContracts = newContracts.map((cont) => ({
      value: cont._id,
      label: cont.name,
    }));
    setContractsOptions(setContracts);
  }, [watchAllFields.classes]);

  useEffect(() => {
    dispatch(fetchClasses());
    dispatch(fetchContracts());
    if (location.state?.id) {
      setOnEdit(true);
      dispatch(fetchMemberById(location.state.id));
    }
  }, []);

  useEffect(() => {
    if (Object.keys(member).length !== 0 && location.state?.id) {
      const { _id, __v, ...newImput } = member;
      setInputs(newImput);
    }
  }, [member]);

  useEffect(() => {
    if (Object.keys(inputs).length !== 0 && location.state?.id) {
      const classesId = inputs.classes?.map((item) => item._id);
      const classesNew = classes.filter((clase) =>
        classesId.includes(clase._id),
      );
      const finalClasses = classesNew.map((item) => ({
        value: item._id,
        label: `${item.activity?.name} (${item.day.substring(0, 3)} ${
          item.startsAt
        })`,
      }));
      const contractsId = inputs.contracts?.map((item) => item._id);
      const contractsNew = contracts.filter((item) =>
        contractsId.includes(item._id),
      );
      const finalContracts = contractsNew.map((item) => ({
        value: item._id,
        label: `${item.name}`,
      }));
      setValue('firstName', inputs.firstName || '');
      setValue('lastName', inputs.lastName || '');
      setValue('ci', inputs.ci || '');
      setValue('phone', inputs.phone || '');
      setValue('email', inputs.email || '');
      setValue('birthDay', formatDate(inputs.birthDay) || '');
      setValue('medService', inputs.medService || '');
      setValue('healthCardUpToDate', inputs.healthCardUpToDate || false);
      setValue('healthCardVigency', formatDate(inputs.healthCardVigency) || '');
      setValue('classes', finalClasses || []);
      setValue('contracts', finalContracts || []);
    }
  }, [inputs]);

  useEffect(() => {
    if (messageError !== '') {
      setModalError(true);
      setTimeout(async () => {
        setModalError(false);
        setMessageError('');
      }, 3000);
    }
  });

  return (
    <div className={styles.container}>
      <Modal
        isOpen={modalError}
        popUp
        onClose={() => setModalError(false)}
        error
      >
        <p className={styles.errorMsg}>Error: {messageError}</p>
      </Modal>
      <h2 className={styles.titleForm}>
        {onEdit ? 'Editar alumno' : 'Agregar un alumno'}
      </h2>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit, onError)}>
        <div className={styles.formField}>
          <label className={styles.formLabel}>Nombre:</label>
          <input
            className={styles.formInput}
            name={'firstName'}
            onChange={onChange}
            {...register('firstName')}
          ></input>
          <div
            className={
              errors.firstName?.message && touchedFields.firstName
                ? `${styles.error}`
                : `${styles.error}  ${styles.hidden} `
            }
          >
            <img src='/assets/logos/warning.svg' alt='Warning Logo' />
            <p className={styles.errorMsg}>{errors.firstName?.message}</p>
          </div>
        </div>
        <div className={styles.formField}>
          <label className={styles.formLabel}>Apellido:</label>
          <input
            className={styles.formInput}
            name={'lastName'}
            onChange={onChange}
            {...register('lastName')}
          ></input>
          <div
            className={
              errors.lastName?.message && touchedFields.lastName
                ? `${styles.error}`
                : `${styles.error}  ${styles.hidden} `
            }
          >
            <img src='/assets/logos/warning.svg' alt='Warning Logo' />
            <p className={styles.errorMsg}>{errors.lastName?.message}</p>
          </div>
        </div>
        <div className={styles.formField}>
          <label className={styles.formLabel}>CI:</label>
          <input
            className={styles.formInput}
            name={'ci'}
            onChange={onChange}
            {...register('ci')}
          ></input>
          <div
            className={
              errors.ci?.message && touchedFields.ci
                ? `${styles.error}`
                : `${styles.error}  ${styles.hidden} `
            }
          >
            <img src='/assets/logos/warning.svg' alt='Warning Logo' />
            <p className={styles.errorMsg}>{errors.ci?.message}</p>
          </div>
        </div>
        <div className={styles.formField}>
          <label className={styles.formLabel}>Teléfono:</label>
          <input
            className={styles.formInput}
            name={'phone'}
            onChange={onChange}
            {...register('phone')}
          ></input>
          <div
            className={
              errors.phone?.message && touchedFields.phone
                ? `${styles.error}`
                : `${styles.error}  ${styles.hidden} `
            }
          >
            <img src='/assets/logos/warning.svg' alt='Warning Logo' />
            <p className={styles.errorMsg}>{errors.phone?.message}</p>
          </div>
        </div>
        <div className={styles.formField}>
          <label className={styles.formLabel}>Email:</label>
          <input
            className={styles.formInput}
            name={'email'}
            onChange={onChange}
            {...register('email')}
          ></input>
          <div
            className={
              errors.email?.message && touchedFields.email
                ? `${styles.error}`
                : `${styles.error}  ${styles.hidden} `
            }
          >
            <img src='/assets/logos/warning.svg' alt='Warning Logo' />
            <p className={styles.errorMsg}>{errors.email?.message}</p>
          </div>
        </div>
        <div className={styles.formField}>
          <label className={styles.formLabel}>Fecha de nacimiento:</label>
          <input
            className={`${styles.formInput} ${styles.inputDate}`}
            name={'birthDay'}
            onChange={onChange}
            {...register('birthDay')}
            type='date'
          ></input>
          <div
            className={
              errors.birthDay?.message && touchedFields.birthDay
                ? `${styles.error}`
                : `${styles.error}  ${styles.hidden} `
            }
          >
            <img src='/assets/logos/warning.svg' alt='Warning Logo' />
            <p className={styles.errorMsg}>{errors.birthDay?.message}</p>
          </div>
        </div>
        <div className={styles.formField}>
          <label className={styles.formLabel}>Servicio médico:</label>
          <input
            className={styles.formInput}
            name={'medService'}
            onChange={onChange}
            {...register('medService')}
          ></input>
          <div
            className={
              errors.medService?.message && touchedFields.medService
                ? `${styles.error}`
                : `${styles.error}  ${styles.hidden} `
            }
          >
            <img src='/assets/logos/warning.svg' alt='Warning Logo' />
            <p className={styles.errorMsg}>{errors.medService?.message}</p>
          </div>
        </div>
        <div className={styles.formField}>
          <label className={styles.formLabel}>Carnet de salud:</label>
          <input
            name={'healthCardUpToDate'}
            onChange={onChange}
            {...register('healthCardUpToDate')}
            type='checkbox'
          ></input>
          <input
            className={`${styles.formInput} ${styles.inputDate}`}
            name={'healthCardVigency'}
            onChange={onChange}
            {...register('healthCardVigency')}
            type='date'
          ></input>
          <div
            className={
              errors.healthCardVigency?.message &&
              touchedFields.healthCardVigency
                ? `${styles.error}`
                : `${styles.error}  ${styles.hidden} `
            }
          >
            <img src='/assets/logos/warning.svg' alt='Warning Logo' />
            <p className={styles.errorMsg}>
              {errors.healthCardVigency?.message}
            </p>
          </div>
        </div>
        <div className={`${styles.formField} ${styles.selectField}`}>
          <label className={styles.formLabel}>Clases:</label>
          <Select
            onChange={(e) => {
              onClassChange(e);
            }}
            className={`${styles.formInput} ${styles.formSelect}`}
            value={
              !onEdit
                ? classesOptions.find(
                    (singleClass) => singleClass.value === clase,
                  )
                : clase
            }
            options={classesOptions}
            isMulti
          />
        </div>
        {watchAllFields.classes && watchAllFields.classes?.length !== 0 ? (
          <div className={`${styles.formField} ${styles.selectField}`}>
            <label className={styles.formLabel}>Contratos:</label>
            <Select
              onChange={(e) => {
                onContractChange(e);
              }}
              className={`${styles.formInput} ${styles.formSelect}`}
              value={
                !onEdit
                  ? contractsOptions.find(
                      (singleClass) => singleClass.value === contract,
                    )
                  : contract
              }
              options={contractsOptions}
              isMulti
            />
          </div>
        ) : (
          ''
        )}
        <div className={styles.divBtns}>
          <Link to={'/members'} state={location.state}>
            <button className={`${styles.cancelBtn} ${styles.btn}`}>
              Cancelar
            </button>
          </Link>
          <button className={`${styles.addBtn} ${styles.btn}`} type='submit'>
            Confirmar
          </button>
        </div>
      </form>
    </div>
  );
}

export default MemberForm;
