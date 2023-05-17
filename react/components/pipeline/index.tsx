import React, {
    useCallback, useEffect, useState, useMemo,
} from 'react';
import { Content, devopsOrganizationsApi, pipelineTemplateApi } from '@choerodon/master';
import { CustomSelect } from '@choerodon/components';
import { DataSet, Form, TextField } from 'choerodon-ui/pro';
import { LabelLayoutType } from 'choerodon-ui/pro/lib/form/Form';
import FormDs from './formDs';
import defaultImg from './assets/1.png'
import './index.less';

const Index = (props: any) => {
    const { level, useTabData } = props;

    const [savedData, setSavedData, f, d] = useTabData();

    const formDs = useMemo(() => new DataSet(FormDs(level, setSavedData)), []);

    useEffect(() => {
        if (savedData) {
            if (!formDs?.current?.get('ciTemplateCategoryId')) {
                formDs?.loadData([
                    {
                        name: savedData.name,
                        ciTemplateCategoryId: savedData.ciTemplateCategoryId
                    }
                ])
            }
        }
    }, [savedData]);

    const [categoryData, setCategoryData] = useState([]);

    useEffect(() => {
        async function forSync() {
            let res;
            if (level === 'organization') {
                res = await devopsOrganizationsApi.getOrgPinelineCategory();
            } else if (level === 'site') {
                res = await pipelineTemplateApi.getSitePinelineCategory();
            }
            setCategoryData(res);
            if (!savedData?.ciTemplateCategoryId) {
                formDs?.current?.set('ciTemplateCategoryId', res[0].id)
            }
        }
        forSync();
    }, []);

    const selectChange = (value: any) => {
        formDs?.current?.set('ciTemplateCategoryId', value.id);
    };

    return (
        <>
            <Form style={{ width: '553px' }} dataSet={formDs} labelLayout={'float' as LabelLayoutType}>
                <TextField name="name" autoFocus />
                <TextField name="category" hidden />
            </Form>
            <p className="org-pipeline-template-required-column" style={{ color: '#4A5C90' }}>流水线分类</p>

            <div className="c7ncd-pipeline-template-basicInfo-container-customSelect">
                <div className="c7ncd-pipeline-template-basicInfo-container-customSelect-content">
                    {categoryData?.length ? (
                        <CustomSelect
                            onClickCallback={(value) => { selectChange(value); }}
                            selectedKeys={formDs?.current?.get('ciTemplateCategoryId')}
                            data={categoryData}
                            identity="id"
                            mode="single"
                            customChildren={(item): any => (
                                <div className="c7ncd-pipeline-template-basicInfo-item">
                                    {/* @ts-ignore */}
                                    <img src={item.image || defaultImg} alt="" />
                                    {/* @ts-ignore */}
                                    <p>{item.category}</p>
                                </div>
                            )}
                        />
                    ) : null}
                </div>
            </div>
        </>
    );
};

export default Index;
