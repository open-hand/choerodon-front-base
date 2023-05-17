// 空白得分组
const DEFAULT_STAGES_DATA = {
  templateStageVOS: [
    {
      name: '代码扫描',
      sequence: 1,
      id: 1,
      type: 'CI',
    },
    {
      name: '构建',
      sequence: 2,
      id: 2,
      type: 'CI',
    },
  ],
  hasRecords: false,
  name: '',
} as const;

const DEFAULT_BASICINFO = {
  name: '',
  ciTemplateCategoryId: '',
};
export { DEFAULT_STAGES_DATA, DEFAULT_BASICINFO };
