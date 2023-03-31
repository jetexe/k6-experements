#!/usr/bin/make
# Makefile readme (ru): <http://linux.yaroslavl.ru/docs/prog/gnu_make_3-79_russian_manual.html>
# Makefile readme (en): <https://www.gnu.org/software/make/manual/html_node/index.html#SEC_Contents>
SHELL = /bin/sh

DC_RUN_ARGS = --rm --user "$(shell id -u):$(shell id -g)"

.DEFAULT_GOAL : help

.SILENT: help
help: ## Show this help
	@printf "\033[33m%s:\033[0m\n" 'Available commands'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  \033[32m%-11s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

.SILENT: all
.PHONY: all
all: ## Run app tests and linters
	docker-compose run $(DC_RUN_ARGS) k6 run all.js

.SILENT: stress
.PHONY: stress
stress: ## Run app tests and linters
	docker-compose run $(DC_RUN_ARGS) k6 run stress.js

.SILENT: ci
.PHONY: ci
ci: ## Run app tests and linters
	docker-compose run $(DC_RUN_ARGS) k6 run ci.js

.PHONY: clean
.SILENT: clean
clean: ## Make clean
	docker-compose down -v -t 1
