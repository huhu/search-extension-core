#!/usr/bin/env bash
set -e

BRANCH="now"

# Pin Zola to 0.17.2, the same version the go/cpp/js/k8s-search-extension
# GitHub Actions workflows install with taiki-e/install-action (`zola@0.17.2`).
# 0.17.2 matches the existing highlight_code config. Callers may install that
# version before calling build(); otherwise build() downloads the official
# getzola/zola v0.17.2 linux x86_64 release and puts it on PATH.
# Do not install Zola from snap edge: that channel floats (0.22.1 today,
# possibly 0.23 tomorrow) and newer Zola breaks the docs build.
ZOLA_VERSION="0.17.2"
ZOLA_SHA256="48742322fc0660afb22a4ce194e9b2bd610b5bd36f43abe121e56eb8a704b464"

install_zola() {
  if command -v zola >/dev/null 2>&1; then
    local existing
    existing="$(zola --version 2>/dev/null || true)"
    if [[ "${existing}" == "zola ${ZOLA_VERSION}" ]]; then
      return 0
    fi
  fi

  local arch
  arch="$(uname -m)"
  if [[ "${arch}" != "x86_64" ]]; then
    echo "Zola ${ZOLA_VERSION} is installed from the official linux x86_64 release; this runner is ${arch}." >&2
    exit 1
  fi

  local dest="${HOME:-/tmp}/.local/zola-${ZOLA_VERSION}"
  local bin="${dest}/zola"
  if [[ ! -x "${bin}" ]] || [[ "$("${bin}" --version 2>/dev/null || true)" != "zola ${ZOLA_VERSION}" ]]; then
    local asset="zola-v${ZOLA_VERSION}-x86_64-unknown-linux-gnu.tar.gz"
    local url="https://github.com/getzola/zola/releases/download/v${ZOLA_VERSION}/${asset}"
    local tmp
    tmp="$(mktemp)"
    mkdir -p "${dest}"
    curl -fsSL "${url}" -o "${tmp}"
    echo "${ZOLA_SHA256}  ${tmp}" | sha256sum -c -
    tar -xzf "${tmp}" -C "${dest}"
    rm -f "${tmp}"
    chmod +x "${bin}"
  fi

  export PATH="${dest}:${PATH}"
}

build() {
  echo "Starting building..."

  install_zola
  cd docs
  zola build
  mv public /tmp/public
  cd ..
}

deploy() {
  echo "Starting deploying..."
  git config --global url."https://".insteadOf git://
  git config --global url."https://github.com/".insteadOf git@github.com:

  git checkout ${BRANCH}
  cp -vr /tmp/public/* .
  git config user.name "GitHub Actions"
  git config user.email "github-actions-bot@users.noreply.github.com"
  git add .
  git commit -m "Deploy new version docs"
  git push --force "https://${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git" ${BRANCH}

  echo "Deploy complete"
}
