SHELL := /bin/bash
.PHONY: help build build-prod deploy test-ssh clean

# ==============================================================================
# Remote Server Configuration (Hosting Staging/Production)
# ==============================================================================
SSH_USER      ?= ymsdwuqshosting
SSH_HOST      ?= 202.92.5.66
SSH_PORT      ?= 65333
SSH_KEY       ?=
REMOTE_FE_DIR ?= ~/public_html

# SSH command builder
SSH_KEY_OPT   := $(if $(SSH_KEY),-i $(SSH_KEY),)
SSH_CMD       := ssh $(SSH_KEY_OPT) -p $(SSH_PORT)

# ==============================================================================
# Targets
# ==============================================================================
help:
	@echo "========================================================================"
	@echo "  Platform Frontend (platform-fe) Makefile"
	@echo "  Target Host: $(SSH_USER)@$(SSH_HOST):$(SSH_PORT)"
	@echo "========================================================================"
	@echo "  make build       : Build Frontend cho môi trường local (kiểm tra lỗi)"
	@echo "  make build-prod  : Build Frontend với .env.production"
	@echo "  make deploy      : Build cho Production và deploy lên server ($(REMOTE_FE_DIR))"
	@echo "  make test-ssh    : Kiểm tra kết nối SSH tới server"
	@echo "  make clean       : Xóa thư mục dist/"
	@echo "========================================================================"

test-ssh:
	@echo "Kiểm tra kết nối SSH tới $(SSH_USER)@$(SSH_HOST):$(SSH_PORT)..."
	@$(SSH_CMD) $(SSH_USER)@$(SSH_HOST) "echo 'SSH connected successfully as user:' \$$(whoami)"

build:
	@echo "===> [FE] Bắt đầu build Frontend cho Local check..."
	@npm run build

build-prod:
	@echo "===> [FE] Bắt đầu build Frontend cho Production (.env.production)..."
	@npm run build:prod

deploy: build-prod
	@echo "------------------------------------------------------------------------"
	@echo "===> [FE] Deploying Frontend lên $(SSH_USER)@$(SSH_HOST):$(REMOTE_FE_DIR)..."
	@echo "------------------------------------------------------------------------"
	@$(SSH_CMD) $(SSH_USER)@$(SSH_HOST) "mkdir -p $(REMOTE_FE_DIR)"
	@if command -v rsync >/dev/null 2>&1 && $(SSH_CMD) $(SSH_USER)@$(SSH_HOST) "command -v rsync" >/dev/null 2>&1; then \
		echo "Đang đồng bộ files bằng rsync..."; \
		rsync -avz -e "$(SSH_CMD)" --delete dist/ $(SSH_USER)@$(SSH_HOST):$(REMOTE_FE_DIR)/; \
	else \
		echo "Remote không có rsync, tự động chuyển sang scp..."; \
		scp $(SSH_KEY_OPT) -P $(SSH_PORT) -r dist/* $(SSH_USER)@$(SSH_HOST):$(REMOTE_FE_DIR)/; \
	fi
	@$(SSH_CMD) $(SSH_USER)@$(SSH_HOST) "rm -f $(REMOTE_FE_DIR)/env.js"
	@echo "===> [FE] Deploy Frontend thành công!"

clean:
	@echo "===> [FE] Xóa thư mục dist/..."
	@rm -rf dist
	@echo "===> [FE] Đã dọn dẹp sạch."
