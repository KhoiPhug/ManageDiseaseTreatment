import { Fragment, useEffect, useLayoutEffect, useRef, useState } from 'react';
/* A library that allows you to validate the props you pass to your React components. */
import PropTypes from 'prop-types';

import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';

import { ThermometerIcon, ArmIcon, WeightIcon, PulseIcon, BreathIcon, HeightIcon } from '@/components/Icons';
import ButtonComponent from '@/components/Button';

import * as specformService from '@/services/specformService';
import classNames from 'classnames/bind';
import styles from './TabDetail.module.scss';

const cx = classNames.bind(styles);

function ResultTab({ overResult, _id, setOverResult, setDataChange, dataChange }) {
    const toast = useRef(null);

    const handleChange = (e) => {
        const val = (e.target && e.target.value) || '';
        setOverResult(val);
    };

    const handlerComplete = () => {
        let _overResult = overResult;
        specformService.updateOverResult(_overResult, _id).then((result) => {
            console.log(result);
            toast.current.show({
                severity: 'success',
                summary: 'Successful',
                detail: 'Overview Result Updated',
                life: 3000,
            });
        });
    };

    return (
        <div className={cx('grid', 'wide')}>
            <Toast ref={toast} />
            <div className={cx('btn-group')}>
                <ButtonComponent
                    className={cx('btn-add')}
                    primary
                    large
                    // leftIcon={<TrashSmallIcon width="1.6rem" height="1.6rem" />}
                    onClick={handlerComplete}
                    // disable={!selectedProducts || !selectedProducts.length}
                >
                    Complete
                </ButtonComponent>
            </div>
            <div className={cx('row')}>
                <div className={cx('input-group')}>
                    <label className={cx('title-input')} htmlFor="result">
                        Result
                    </label>
                    <InputTextarea
                        className={cx('input-text-area')}
                        id="result"
                        value={overResult}
                        onChange={(e) => handleChange(e)}
                        required
                        rows={3}
                        cols={20}
                    />
                </div>
            </div>
        </div>
    );
}

ResultTab.prototype = {
    overResult: PropTypes.string,
};

export default ResultTab;
