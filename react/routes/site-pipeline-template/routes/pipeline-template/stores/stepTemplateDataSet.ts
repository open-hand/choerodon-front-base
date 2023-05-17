/* eslint-disable max-len */
import { DataSet } from 'choerodon-ui/pro';
import { IntlFormatters } from 'react-intl';
import { pipelineTemplateApiConfig } from '@choerodon/master';

interface StepTemplateProps {
    formatPipelineTemplate: IntlFormatters['formatMessage'],
    formatCommon: IntlFormatters['formatMessage'],
    sourceDs:DataSet,
}
export default ({
  formatPipelineTemplate, formatCommon, sourceDs,
}: StepTemplateProps): any => {
  const categoryNameData = [{
    text: formatPipelineTemplate({ id: 'build' }),
    value: formatPipelineTemplate({ id: 'build' }),
  }, {
    text: formatPipelineTemplate({ id: 'unitTest' }),
    value: formatPipelineTemplate({ id: 'unitTest' }),
  }, {
    text: formatPipelineTemplate({ id: 'codeReview' }),
    value: formatPipelineTemplate({ id: 'codeReview' }),
  }, {
    text: formatPipelineTemplate({ id: 'upload' }),
    value: formatPipelineTemplate({ id: 'upload' }),
  }];
  return {
    autoQuery: false,
    selection: false,
    fields: [
      { name: 'name', type: 'string', label: formatPipelineTemplate({ id: 'stepName' }) },
      { name: 'categoryName', type: 'string', label: formatPipelineTemplate({ id: 'categoryName' }) },
      { name: 'creator', type: 'string', label: formatPipelineTemplate({ id: 'creator' }) },
      { name: 'creationDate', type: 'string', label: formatPipelineTemplate({ id: 'creationDate' }) },
      { name: 'builtIn', type: 'string', label: formatPipelineTemplate({ id: 'builtIn' }) },
    ],

    queryFields: [
      { name: 'name', type: 'string', label: formatPipelineTemplate({ id: 'stepName' }) },
      {
        name: 'builtIn', type: 'string', textField: 'text', valueField: 'value', options: sourceDs, label: formatPipelineTemplate({ id: 'builtIn' }),
      },
      {
        name: 'category_id',
        type: 'string',
        textField: 'name',
        valueField: 'id',
        lookupAxiosConfig: () => (
          pipelineTemplateApiConfig.getSiteStepCategory()),
        label: formatPipelineTemplate({ id: 'categoryName' }),
      },
    ],
    transport: {
      read: {
        url: '/devops/v1/site/0/ci_template_step',
        method: 'get',
      },
    },
  };
};
