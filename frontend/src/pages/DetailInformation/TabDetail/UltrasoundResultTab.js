// import { Fragment, useEffect, useLayoutEffect, useRef, useState } from 'react';
/* A library that allows you to validate the props you pass to your React components. */
import PropTypes from 'prop-types';
import { useEffect, useState, useRef } from 'react';

import { InputTextarea } from 'primereact/inputtextarea';
import { Galleria } from 'primereact/galleria';
import { Image } from 'primereact/image';
import { Toast } from 'primereact/toast';

import { ThermometerIcon, ArmIcon, WeightIcon, PulseIcon, BreathIcon, HeightIcon } from '@/components/Icons';
import ImageComponent from '@/components/Image';
import ButtonComponent from '@/components/Button';

import * as ultrasoundResultService from '@/services/ultrasoundResultService';

import classNames from 'classnames/bind';
import styles from './TabDetail.module.scss';

const cx = classNames.bind(styles);

function UltrasoundResultTab({ ultrasoundResult, setUltrasoundResult, specFormId, setDataChange, dataChange }) {
    const toast = useRef(null);

    const handleChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _ultrasoundResult = { ...ultrasoundResult };
        _ultrasoundResult[`${name}`] = val;
        setUltrasoundResult(_ultrasoundResult);
    };

    const responsiveOptions = [
        {
            breakpoint: '991px',
            numVisible: 4,
        },
        {
            breakpoint: '767px',
            numVisible: 3,
        },
        {
            breakpoint: '575px',
            numVisible: 1,
        },
    ];

    const itemTemplate = (item) => {
        return (
            <div className="card flex justify-content-center">
                <Image src={item.itemImageSrc} alt={item.alt} width="100%" preview />
            </div>
        );
    };

    const thumbnailTemplate = (item) => {
        return <img src={item.thumbnailImageSrc} alt={item.alt} />;
    };

    const handlerComplete = () => {
        let _ultrasoundResult = { ...ultrasoundResult };

        if (_ultrasoundResult._id) {
            ultrasoundResultService.updateUltrasoundResult(_ultrasoundResult, _ultrasoundResult._id).then((result) => {
                toast.current.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Ultrasound Result Updated',
                    life: 3000,
                });
            });
        } else {
            _ultrasoundResult.specFormId = specFormId;
            // console.log(_ultrasoundResult);
            ultrasoundResultService.createUltrasoundResult(_ultrasoundResult).then((result) => {
                toast.current.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Ultrasound Result Create',
                    life: 3000,
                });
            });
            setDataChange(dataChange);
        }
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
                    <label className={cx('title-input')}>Image</label>
                    <div className={cx('image-group')}>
                        {ultrasoundResult.images.length === 0 && (
                            <ImageComponent
                                src="https://rimereact.org/images/galleria/galleria2s.jpg"
                                alt="No Image"
                                width="400px"
                                height="400px"
                            />
                        )}

                        {ultrasoundResult.images.length !== 0 && (
                            <Galleria
                                value={ultrasoundResult.images}
                                responsiveOptions={responsiveOptions}
                                numVisible={5}
                                style={{ maxWidth: '500px' }}
                                item={itemTemplate}
                                thumbnail={thumbnailTemplate}
                            />
                        )}
                    </div>
                </div>
            </div>
            <div className={cx('row')}>
                <div className={cx('input-group')}>
                    <label className={cx('title-input')} htmlFor="result">
                        Result
                    </label>
                    <InputTextarea
                        className={cx('input-text-area')}
                        id="result"
                        value={ultrasoundResult.result}
                        onChange={(e) => handleChange(e, 'result')}
                        required
                        rows={3}
                        cols={20}
                    />
                </div>
            </div>
            <div className={cx('row')}>
                <div className={cx('input-group')}>
                    <label className={cx('title-input')} htmlFor="conclusion">
                        Conclusion
                    </label>
                    <InputTextarea
                        className={cx('input-text-area')}
                        id="conclusion"
                        value={ultrasoundResult.conclusion}
                        onChange={(e) => handleChange(e, 'conclusion')}
                        required
                        rows={3}
                        cols={20}
                    />
                </div>
            </div>
        </div>
    );
}

UltrasoundResultTab.prototype = {
    ultrasoundResult: PropTypes.string,
    setUltrasoundResult: PropTypes.func,
};

export default UltrasoundResultTab;
