FROM node:14

# Create app directory
WORKDIR /app/knbot/

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# 可以更换国内apt源

# 安装中文字体
# 参考https://blog.llcat.tech/2018/12/03/add-zh-CN-locales-and-fonts-in-docker-images/
RUN apt-get update \ 
  && apt-get install -y locales \
  # 安装emoji
  # && apt-get install ttf-ancient-fonts \
  && sed -ie 's/# zh_CN.UTF-8 UTF-8/zh_CN.UTF-8 UTF-8/g' /etc/locale.gen \
  && locale-gen \
  && mkdir /usr/share/fonts/myfont/
ADD ./fonts/*.ttf /usr/share/fonts/truetype/myfont/
RUN fc-cache -vf \
  && fc-list

# playwright
RUN apt-get update -y && \
  apt-get -y install chromium chromium-l10n && \
  apt-get -y install libatk-adaptor libgail-common && \
  apt -y install libxkbcommon-dev && \
  apt -y install libgbm-dev

# Bundle app source
COPY . .

#EVN
ENV HOST 0.0.0.0
ENV PORT 16700
# 中文
ENV LANG zh_CN.utf8 

EXPOSE 16700

CMD [ "npm", "run", "start" ]
