/**
 * 裁剪头像上传
 */
/*eslint-disable*/
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { inject } from 'mobx-react';
import { Icon, Modal, Upload } from 'choerodon-ui';
import { Button } from 'choerodon-ui/pro';
import { axios, Choerodon } from '@choerodon/boot';
import PropTypes from 'prop-types';
import querystring from 'query-string';
import './AvatarUploader.less';

const { Dragger } = Upload;
const { round } = Math;
const editorWidth = 540;
const editorHeight = 300;
const defaultRectSize = 200;
const minRectSize = 80;
const prefixClas = 'c7n-iam-avatar-edit';
const limitSize = 1024;
let relativeX = 0;
let relativeY = 0;
let resizeMode;
let resizeX = 0;
let resizeY = 0;
let resizeSize = 0;

function rotateFlag(rotate) {
  return (rotate / 90) % 2 !== 0;
}
const propTypes = {
  visible: PropTypes.bool.isRequired, // 上传图片模态框的显示状态
  intlPrefix: PropTypes.string, // 多语言的前缀
  onVisibleChange: PropTypes.func, // 模态框关闭时的回调
  onUploadOk: PropTypes.func, // 成功上传时的回调
  title: PropTypes.string,
};
@injectIntl
@inject('AppState')
export default class AvatarUploader extends Component {
  constructor() {
    super();
    this.state = {
      submitting: false,
      img: null,
      file: null,
      size: defaultRectSize,
      x: 0,
      y: 0,
      rotate: 0,
    };
  }

  handleOk = () => {
    const {
      x, y, size, rotate, file, imageStyle: { width, height }, img: { naturalWidth, naturalHeight },
    } = this.state;
    const flag = rotateFlag(rotate);
    const scale = naturalWidth / width;
    const startX = flag ? x - ((width - height) / 2) : x;
    const startY = flag ? y + ((width - height) / 2) : y;
    const qs = querystring.stringify({
      rotate,
      startX: round(startX * scale),
      startY: round(startY * scale),
      endX: round(size * scale),
      endY: round(size * scale),
      bucketName: 'iam-service',
    });
    const data = new FormData();
    const { AppState: { currentMenuType: { organizationId } } } = this.props;
    data.append('file', file);
    this.setState({ submitting: true });
    axios.post(`/hfle/choerodon/v1/${organizationId}/cut_image?${qs}`, data)
      .then((res) => {
        if (res.failed) {
          Choerodon.prompt(res.message);
          this.setState({ submitting: false });
        } else {
          this.uploadOk(res);
        }
      })
      .catch((error) => {
        Choerodon.handleResponseError(error);
        this.setState({ submitting: false });
      });
  };

  close() {
    this.setState({
      img: null,
    });
    this.props.onVisibleChange(false);
  }

  uploadOk(res) {
    this.setState({
      img: null,
      submitting: false,
    }, () => {
      this.props.onUploadOk(res);
    });
  }

  handleCancel = () => {
    this.close();
  };

  handleMoveStart = ({ clientX, clientY }) => {
    const { x, y } = this.state;
    relativeX = clientX - x;
    relativeY = clientY - y;
    document.addEventListener('mousemove', this.handleMoving);
    document.addEventListener('mouseup', this.handleMoveEnd);
  };

  handleMoving = ({ clientX, clientY }) => {
    const { size, imageStyle: { width, height }, rotate } = this.state;
    const flag = rotateFlag(rotate);
    const minX = flag ? (width - height) / 2 : 0;
    const minY = flag ? (height - width) / 2 : 0;
    const maxX = width - size - minX;
    const maxY = height - size - minY;
    this.setState({
      x: Math.min(Math.max(minX, clientX - relativeX), maxX),
      y: Math.min(Math.max(minY, clientY - relativeY), maxY),
    });
  };

  handleMoveEnd = () => {
    document.removeEventListener('mousemove', this.handleMoving);
    document.removeEventListener('mouseup', this.handleMoveEnd);
  };

  handleResizeStart = (e) => {
    e.stopPropagation();
    const { currentTarget, clientX, clientY } = e;
    const { x, y, size } = this.state;
    relativeX = clientX - x;
    relativeY = clientY - y;
    resizeMode = currentTarget.className;
    resizeX = x;
    resizeY = y;
    resizeSize = size;
    document.addEventListener('mousemove', this.handleResizing);
    document.addEventListener('mouseup', this.handleResizeEnd);
  };

  handleResizing = ({ clientX, clientY }) => {
    const { imageStyle: { width, height }, rotate } = this.state;
    const flag = rotateFlag(rotate);
    const newX = clientX - relativeX;
    const newY = clientY - relativeY;
    let x = resizeX;
    let y = resizeY;
    let size;
    if (resizeMode === 'lt') {
      const relative = Math.min(newX - resizeX, newY - resizeY);
      x += relative;
      y += relative;
      size = (resizeSize - x) + resizeX;
    } else if (resizeMode === 'rt') {
      const relative = Math.min(resizeX - newX, newY - resizeY);
      y += relative;
      size = (resizeSize - y) + resizeY;
    } else if (resizeMode === 'lb') {
      const relative = Math.min(newX - resizeX, resizeY - newY);
      x += relative;
      size = (resizeSize - x) + resizeX;
    } else {
      const relative = Math.min(resizeX - newX, resizeY - newY);
      size = resizeSize - relative;
    }
    const minX = flag ? (width - height) / 2 : 0;
    const minY = flag ? (height - width) / 2 : 0;
    const maxWidth = flag ? ((width - height) / 2) + height : width;
    const maxHeight = flag ? ((height - width) / 2) + width : height;
    x = Math.min(Math.max(minX, x), (resizeSize - minRectSize) + resizeX);
    y = Math.min(Math.max(minY, y), (resizeSize - minRectSize) + resizeY);
    this.setState({
      x,
      y,
      size: Math.max(Math.min(size, maxWidth - x, maxHeight - y), minRectSize),
    });
  };

  handleResizeEnd = () => {
    document.removeEventListener('mousemove', this.handleResizing);
    document.removeEventListener('mouseup', this.handleResizeEnd);
  };

  initImageSize(img, rotate = 0) {
    const { naturalWidth, naturalHeight } = img;
    const flag = rotateFlag(rotate);
    let width = flag ? naturalHeight : naturalWidth;
    let height = flag ? naturalWidth : naturalHeight;
    if (width < minRectSize || height < minRectSize) {
      if (width > height) {
        width = (width / height) * minRectSize;
        height = minRectSize;
      } else {
        height = (height / width) * minRectSize;
        width = minRectSize;
      }
    } else if (width > editorWidth || height > editorHeight) {
      if (width / editorWidth > height / editorHeight) {
        height = (height / width) * editorWidth;
        width = editorWidth;
      } else {
        width = (width / height) * editorHeight;
        height = editorHeight;
      }
    }
    if (flag) {
      const tmp = width;
      width = height;
      height = tmp;
    }
    const size = Math.min(defaultRectSize, width, height);
    this.setState({
      img,
      imageStyle: {
        width,
        height,
        top: (editorHeight - height) / 2,
        left: (editorWidth - width) / 2,
        transform: `rotate(${rotate}deg)`,
      },
      size,
      x: (width - size) / 2,
      y: (height - size) / 2,
      rotate,
    });
  }

  loadImage(src) {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      this.initImageSize(img);
    };
  }

  getPreviewProps(previewSize) {
    const {
      size, x, y, img: { src }, rotate, imageStyle: { width, height },
    } = this.state;
    const previewScale = previewSize / size;
    let radius = (rotate % 360) / 90;
    let px = -x;
    let py = -y;
    if (radius < 0) radius += 4;
    if (radius === 1) {
      py = ((x + ((height - width) / 2)) - height) + size;
      px = ((height - width) / 2) - y;
    } else if (radius === 2) {
      px = (x - width) + size;
      py = (y - height) + size;
    } else if (radius === 3) {
      px = ((y + ((width - height) / 2)) - width) + size;
      py = ((width - height) / 2) - x;
    }
    return {
      style: {
        width: previewSize,
        height: previewSize,
        backgroundImage: `url('${src}')`,
        backgroundSize: `${width * previewScale}px ${height * previewScale}px`,
        backgroundPosition: `${px * previewScale}px ${py * previewScale}px`,
        transform: `rotate(${rotate}deg)`,
      },
    };
  }

  renderPreviewItem(previewSize) {
    return (
      <div className={`${prefixClas}-preview-item`}>
        <i {...this.getPreviewProps(previewSize)} />
        <p>{`${previewSize}＊${previewSize}`}</p>
      </div>
    );
  }

  renderEditor(props) {
    const {
      img, imageStyle, file, size, x, y, rotate,
    } = this.state;
    const { intlPrefix, intl } = this.props;
    const { src } = img;
    const { left, top } = imageStyle;
    const style = {
      width: editorWidth,
      height: editorHeight,
    };
    const maskStyle = {
      borderTopWidth: y + top,
      borderRightWidth: editorWidth - x - left - size,
      borderBottomWidth: editorHeight - y - top - size,
      borderLeftWidth: x + left,
    };
    return (
      <div>
        <h3 className={`${prefixClas}-text`}>
          {intl.formatMessage({ id: `${intlPrefix}.text` })}
          {/* <FormattedMessage id={`${intlPrefix}.text`} /> */}
          <Icon type="keyboard_arrow_right" />
          <span>{file.name}</span>
        </h3>
        <h4 className={`${prefixClas}-hint`}>
          {intl.formatMessage({ id: `${intlPrefix}.hint` })}
          {/* <FormattedMessage id={`${intlPrefix}.hint`} /> */}
        </h4>
        <div className={`${prefixClas}-wraper`}>
          <div className={prefixClas} style={style}>
            <img alt="" src={src} style={imageStyle} />
            <div className={`${prefixClas}-mask`} style={maskStyle}>
              <div onMouseDown={this.handleMoveStart}>
                <i className="lt" onMouseDown={this.handleResizeStart} />
                <i className="rt" onMouseDown={this.handleResizeStart} />
                <i className="lb" onMouseDown={this.handleResizeStart} />
                <i className="rb" onMouseDown={this.handleResizeStart} />
              </div>
            </div>
          </div>
          <div className={`${prefixClas}-toolbar`}>
            <Button icon="replay_90" shape="circle" onClick={() => this.initImageSize(img, rotate - 90)} />
            <Button icon="play_90" shape="circle" onClick={() => this.initImageSize(img, rotate + 90)} />
          </div>
          <div className={`${prefixClas}-preview`}>
            <h5 className={`${prefixClas}-preview-title`}>
              {/* <FormattedMessage id={`${intlPrefix}.preview`} /> */}
              {intl.formatMessage({ id: `${intlPrefix}.preview` })}
            </h5>
            {this.renderPreviewItem(80)}
            {this.renderPreviewItem(30)}
            {this.renderPreviewItem(18)}
          </div>
        </div>
        <div className={`${prefixClas}-button`}>
          <Upload {...props}>
            <Button icon="file_upload" type="primary">
              {/* <FormattedMessage id={`${intlPrefix}.button`} /> */}
              {intl.formatMessage({ id: `${intlPrefix}.button` })}
            </Button>
          </Upload>
        </div>
      </div>
    );
  }

  getUploadProps() {
    const { intl, id, intlPrefix } = this.props;
    return {
      multiple: false,
      name: 'file',
      accept: 'image/jpeg, image/png, image/jpg',
      action: id && `${window._env_.API_HOST}/iam/choerodon/v1/users/${id}/upload_photo`, // eslint-disable-line
      headers: {
        Authorization: `bearer ${Choerodon.getCookie('access_token')}`,
      },
      showUploadList: false,
      beforeUpload: (file) => {
        const { size } = file;
        if (size > limitSize * 1024) {
          Choerodon.prompt(intl.formatMessage({ id: `${intlPrefix}.file.size.limit` }, { size: `${limitSize / 1024}M` }));
          return false;
        }
        this.setState({ file });
        const windowURL = window.URL || window.webkitURL;
        if (windowURL && windowURL.createObjectURL) {
          this.loadImage(windowURL.createObjectURL(file));
          return false;
        }
      },
      onChange: ({ file }) => {
        const { status, response } = file;
        if (status === 'done') {
          this.loadImage(response);
        } else if (status === 'error') {
          Choerodon.prompt(`${response.message}`);
        }
      },
    };
  }

  renderContainer() {
    const { img } = this.state;
    const { intlPrefix, intl } = this.props;
    const props = this.getUploadProps();
    return img ? (
      this.renderEditor(props)
    )
      : (
        <Dragger className="c7n-iam-avatar-dragger" {...props}>
          <Icon type="inbox" />
          <h3 className="c7n-iam-avatar-dragger-text">
            {/* <FormattedMessage id={`${intlPrefix}.dragger.text`} /> */}
            {intl.formatMessage({ id: `${intlPrefix}.dragger.text` })}

          </h3>
          <h4 className="c7n-iam-avatar-dragger-hint">
            {/* <FormattedMessage id={`${intlPrefix}.dragger.hint`} values={{ size: `${limitSize / 1024}M`, access: 'PNG、JPG、JPEG' }} /> */}
            {intl.formatMessage({ id: `${intlPrefix}.dragger.hint` }, { size: `${limitSize / 1024}M`, access: 'PNG、JPG、JPEG' })}
          </h4>
        </Dragger>
      );
  }

  render() {
    const {
      visible, intlPrefix, intl, title,
    } = this.props;
    const { img, submitting } = this.state;
    const modalFooter = [
      <Button disabled={submitting} key="cancel" onClick={this.handleCancel}>
        {/* <FormattedMessage id="cancel" /> */}
        {intl.formatMessage({ id: 'cancel' })}
      </Button>,
      <Button key="save" color="primary" disabled={!img} loading={submitting} onClick={this.handleOk}>
        {/* <FormattedMessage id="save" /> */}
        {intl.formatMessage({ id: 'save' })}
      </Button>,
    ];
    return (
      <Modal
        title={title || intl.formatMessage({ id: `${intlPrefix}.title` })}
        // <FormattedMessage id={`${intlPrefix}.title`} />
        className="avatar-modal"
        visible={visible}
        width={980}
        closable={false}
        maskClosable={false}
        footer={modalFooter}
      >
        {this.renderContainer()}
      </Modal>
    );
  }
}
AvatarUploader.propTypes = propTypes;
