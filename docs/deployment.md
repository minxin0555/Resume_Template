# 部署到云服务器（VPS）指南

本文档介绍如何把本项目（Next.js 16 在线简历生成器）部署到一台 Linux 云服务器上，让你可以远程随时访问。

部署方案：**Node.js + PM2（进程守护） + Nginx（反向代理）**。

文档分两阶段：

1. **阶段一：跑起来**——只用 IP + 端口就能远程访问。
2. **阶段二：上域名 + HTTPS**——绑定域名，配置 Let's Encrypt 免费证书。

> 适用系统：Ubuntu 22.04 / 24.04（其他发行版同理，包管理器命令自行替换）。
> 适用服务器：阿里云 / 腾讯云 / 华为云 / AWS EC2 / DigitalOcean 等任意 VPS。

---

## 0. 准备工作

在开始之前，确认你有：

- 一台 Linux 云服务器，至少 **2 核 2GB 内存**（Next.js 构建比较吃内存，1GB 容易 OOM，建议加 swap 或选 2GB 以上）。
- 服务器的 **公网 IP** 和 **root / sudo 用户**（下文以 `ubuntu` 用户示例，命令前用 `sudo` 提权）。
- 本地能 SSH 到服务器：

  ```bash
  ssh ubuntu@<服务器公网IP>
  ```

- 云控制台的**安全组 / 防火墙**已放行下列端口（关键，新手最容易漏）：
  - `22`：SSH
  - `80`：HTTP
  - `443`：HTTPS（阶段二用）
  - 阶段一临时用的端口，比如 `3000`（阶段二上 Nginx 后可关掉）

---

## 阶段一：跑起来（IP + 端口访问）

目标：在浏览器输入 `http://<服务器IP>:3000` 能看到简历生成器。

### 1. 安装 Node.js 20（推荐 LTS）

本项目要求 Next.js 16 + React 19，需要 **Node.js ≥ 20**。

用 NodeSource 安装：

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 验证
node -v   # 应输出 v20.x.x
npm -v
```

> 如果服务器在国内访问 NodeSource 慢，可改用 [nvm](https://github.com/nvm-sh/nvm) 安装：
> ```bash
> curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
> source ~/.bashrc
> nvm install 20
> nvm use 20
> ```

### 2. 安装 Git 并克隆代码

```bash
sudo apt-get update
sudo apt-get install -y git

# 克隆你的仓库（替换为你自己的 git 地址）
cd ~
git clone <你的仓库地址> resume-template
cd resume-template
```

> 如果还没把项目推到 Git 仓库，也可以本地用 `scp` 或 `rsync` 把项目目录上传：
> ```bash
> # 本地执行（注意排除 node_modules 和 .next）
> rsync -avz --exclude node_modules --exclude .next \
>   /Users/minixin/Desktop/code/AI_coding/Resume_Template/ \
>   ubuntu@<服务器IP>:~/resume-template/
> ```

### 3. 安装依赖并构建

```bash
cd ~/resume-template

# 安装依赖（生产 + 构建期）
npm install

# 生产构建
npm run build
```

> **如果构建时 OOM 被 killed**：临时加 swap。
> ```bash
> sudo fallocate -l 2G /swapfile
> sudo chmod 600 /swapfile
> sudo mkswap /swapfile
> sudo swapon /swapfile
> echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
> ```

构建完成后，`.next/` 目录里就是产物。

### 4. 用 PM2 守护进程

直接 `npm run start` 关闭 SSH 后进程就没了，必须用进程守护工具。这里用 PM2。

```bash
# 全局安装
sudo npm install -g pm2

# 用 PM2 启动 Next.js（监听 3000 端口）
cd ~/resume-template
pm2 start npm --name "resume" -- run start

# 查看状态
pm2 status
pm2 logs resume    # 看日志，Ctrl+C 退出
```

**设置开机自启**：

```bash
pm2 startup       # 它会打印一条命令，复制下来粘贴执行
pm2 save          # 保存当前进程列表
```

### 5. 远程访问验证

浏览器打开：

```
http://<服务器公网IP>:3000
```

能看到简历编辑器即成功。

> **打不开的排查顺序**：
> 1. 服务器内 `curl http://localhost:3000` 通不通？不通说明 PM2 没跑起来，看 `pm2 logs resume`。
> 2. 云控制台**安全组**有没有放行 3000 端口？最常见的坑。
> 3. 系统防火墙（ufw）：`sudo ufw status`，没启用就跳过；启用了就 `sudo ufw allow 3000`。

至此**阶段一完成**——你已经可以远程访问了。下面阶段二把它变成 `https://你的域名/`。

---

## 阶段二：绑定域名 + HTTPS

目标：通过 `https://resume.example.com/` 访问，地址栏带小绿锁。

### 1. 域名解析

到你的域名服务商（Cloudflare / 阿里云 / 腾讯云 / Namecheap 等）后台，添加一条 **A 记录**：

| 类型 | 主机记录 | 记录值 |
|------|----------|--------|
| A | `resume`（子域名）或 `@`（裸域名） | `<服务器公网IP>` |

等 1-5 分钟生效，本地验证：

```bash
# 应解析到你的服务器 IP
nslookup resume.example.com
# 或
dig +short resume.example.com
```

### 2. 安装 Nginx

```bash
sudo apt-get install -y nginx

# 启动并设置开机自启
sudo systemctl enable --now nginx

# 浏览器访问 http://<服务器IP> 应看到 Nginx 欢迎页
```

### 3. 配置反向代理

新建站点配置文件：

```bash
sudo nano /etc/nginx/sites-available/resume
```

粘贴以下内容（把 `resume.example.com` 替换为你的域名）：

```nginx
server {
    listen 80;
    server_name resume.example.com;

    # 客户端最大上传体积（PDF 预览不大，给个 10M 足够）
    client_max_body_size 10M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;

        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # WebSocket / HMR 支持（生产用不到，但留着无害）
        proxy_set_header Upgrade    $http_upgrade;
        proxy_set_header Connection "upgrade";

        # Typst WASM 文件较大，加大超时
        proxy_read_timeout 300;
    }

    # Next.js 静态资源缓存
    location /_next/static/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_cache_valid 200 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}
```

启用并重载：

```bash
# 创建软链启用站点
sudo ln -s /etc/nginx/sites-available/resume /etc/nginx/sites-enabled/

# （可选）禁用默认站点，避免与你的站点冲突
sudo rm /etc/nginx/sites-enabled/default

# 测试配置语法
sudo nginx -t

# 重载
sudo systemctl reload nginx
```

此时访问 `http://resume.example.com/` 应该已经能通过 80 端口转发到 Next.js 了。

### 4. 申请 Let's Encrypt 免费 HTTPS 证书

用官方推荐的 Certbot：

```bash
sudo apt-get install -y certbot python3-certbot-nginx

# 一行命令申请证书 + 自动改 Nginx 配置
sudo certbot --nginx -d resume.example.com
```

执行后按提示操作：

- 输入邮箱（用于证书到期提醒）
- 同意服务条款（A）
- 是否分享邮箱给 EFF（N 即可）
- 是否把 HTTP 自动跳转到 HTTPS（**选 2**，强制 HTTPS）

成功后再访问 `https://resume.example.com/`，地址栏就有小绿锁了。

### 5. 证书自动续期

Let's Encrypt 证书 90 天到期。Certbot 装好后会自动添加 systemd timer 续期，验证一下：

```bash
sudo systemctl list-timers | grep certbot

# 手动测试续期流程（不会真的续）
sudo certbot renew --dry-run
```

### 6. 关闭裸 3000 端口（推荐）

既然走 Nginx 反向代理了，3000 端口就不该再对外暴露：

- 云控制台安全组**移除** 3000 端口的入站规则。
- 系统防火墙若启用了：`sudo ufw deny 3000`。

只保留 22 / 80 / 443 三个端口即可。

---

## 日常运维速查

### 部署新版本

```bash
cd ~/resume-template
git pull
npm install          # 依赖有变化时才需要
npm run build
pm2 reload resume    # 平滑重启，无停机
```

> 写成脚本 `~/deploy.sh`，以后一行命令搞定：
> ```bash
> #!/usr/bin/env bash
> set -e
> cd ~/resume-template
> git pull
> npm install
> npm run build
> pm2 reload resume
> echo "✅ deployed at $(date)"
> ```

### PM2 常用命令

```bash
pm2 status              # 看进程状态
pm2 logs resume         # 看实时日志
pm2 logs resume --lines 200    # 看最近 200 行
pm2 restart resume      # 重启（有短暂停机）
pm2 reload resume       # 平滑重启（推荐）
pm2 stop resume         # 停止
pm2 delete resume       # 删除进程
pm2 monit               # 实时监控面板
```

### Nginx 常用命令

```bash
sudo nginx -t                       # 测试配置
sudo systemctl reload nginx         # 重载（改完配置用这个）
sudo systemctl restart nginx        # 重启
sudo tail -f /var/log/nginx/access.log    # 访问日志
sudo tail -f /var/log/nginx/error.log     # 错误日志
```

### 内存 / CPU 不够用

- Next.js 构建期内存峰值可能到 1.5GB+，建议至少 2GB 内存或常驻 2GB swap。
- 运行期单进程通常 200-400MB，2GB 内存够用。
- 若并发高，可以让 PM2 起 cluster 模式：
  ```bash
  pm2 delete resume
  pm2 start npm --name resume -i max -- run start
  ```

---

## 常见坑

1. **PDF 预览首次很慢或卡住**：本项目用浏览器端 Typst WASM 编译 PDF，首次需下载几 MB WASM + 中文字体。这是客户端行为，与服务器无关。但如果你的服务器在境外，国内访问 CDN 字体可能慢甚至失败——必要时考虑把字体文件托管到自己服务器。
2. **`npm run build` 被 Killed**：内存不够，加 swap（见阶段一第 3 步注释）。
3. **域名不生效**：DNS 缓存或解析未生效，等几分钟，或换 `dig` 验证。Cloudflare 用户注意如果开了橙色云朵代理，证书申请可能需要额外配置，建议先用灰色云朵（仅 DNS）申请完证书再开。
4. **`pm2 startup` 报错**：按它最后一行打印的 `sudo env PATH=... pm2 startup ...` 命令原样执行一次。
5. **改了代码 PM2 不更新**：必须 `npm run build` 后再 `pm2 reload`，PM2 跑的是 `npm run start`，吃的是 `.next/` 产物。

---

## 部署完成自检清单

- [ ] `pm2 status` 显示 `resume` 进程 `online`
- [ ] 服务器内 `curl -I http://localhost:3000` 返回 `200`
- [ ] 浏览器访问 `https://你的域名/` 出现简历编辑器界面
- [ ] 地址栏小绿锁，证书有效期 ~90 天
- [ ] PDF 预览能正常生成、下载
- [ ] `sudo certbot renew --dry-run` 通过
- [ ] 服务器重启后服务能自启（`sudo reboot` 验证，可选）

全部打勾即部署完成。
