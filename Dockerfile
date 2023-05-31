FROM registry.cn-shanghai.aliyuncs.com/c7n/frontbase:0.10.0
RUN chown -R nginx:nginx /usr/share/nginx/html
COPY --chown=nginx:nginx dist /usr/share/nginx/html/base
USER 101