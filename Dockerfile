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

# puppeteer
RUN apt-get update && \
  apt-get -y install xvfb gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 \
  libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 \
  libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 \
  libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 \
  libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget && \
  rm -rf /var/lib/apt/lists/*

# Bundle app source
COPY . .

#EVN
ENV HOST 0.0.0.0
ENV PORT 16700
# 中文
ENV LANG zh_CN.utf8 

EXPOSE 16700

CMD [ "npm", "run", "start" ]
