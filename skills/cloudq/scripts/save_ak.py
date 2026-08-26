#!/usr/bin/env python3
"""
保存 / 校验腾讯云长期密钥（AK/SK）。

用于 DSH 插件设置页的「手工填写密钥」入口，作为 OAuth 扫码登录之外的
第二条凭证路径：用户直接粘贴 SecretId / SecretKey，插件把它写入
~/.tencent-cloudq/credential.json（type="ak"），后续所有 CloudQ 请求
复用 credential_manager.get_credential() 的统一读取逻辑。

用法：
    printf '%s' '{"secretId":"...","secretKey":"..."}' | python3 save_ak.py --test --stdin
    printf '%s' '{"secretId":"...","secretKey":"..."}' | python3 save_ak.py --save --stdin

密钥只从标准输入读取，不允许通过命令行参数传入，避免出现在进程列表中。

两个子命令都输出 JSON 信封：
    成功 {"success": true, ...}
    失败 {"success": false, "error": {"code": "...", "message": "..."}}
"""

import json
import sys
from datetime import datetime, timezone

from credential_manager import (
    CREDENTIAL_FILE,
    _atomic_write_json,
)
from tcloud_api import call_api


def _mask(value: str, visible: int = 4) -> str:
    """与 login.py 一致的掩码规则：只保留末尾若干位。"""
    if len(value) <= visible:
        return "*" * len(value)
    return "*" * (len(value) - visible) + value[-visible:]


def _json_ok(payload: dict) -> str:
    return json.dumps({"success": True, **payload}, ensure_ascii=False)


def _json_err(code: str, message: str) -> str:
    return json.dumps(
        {"success": False, "error": {"code": code, "message": message}},
        ensure_ascii=False,
    )


def _validate(secret_id: str, secret_key: str) -> tuple:
    """用一次真实的只读 API 调用验证密钥可用性。

    选 DescribeCloudQUsageOverview 是因为它无入参、无副作用，且正是
    CloudQ 自己的接口——能调通即代表该密钥确实开通了 CloudQ 能力。

    `call_api` 不抛异常，它把失败包在 `{"success": false, "error": {...}}`
    里返回，所以这里按信封判定而不是 try/except。

    Returns:
        (ok, message) —— ok 为 False 时 message 是可直接展示的失败原因。
    """
    result = call_api(
        service="advisor",
        host="advisor.tencentcloudapi.com",
        action="DescribeCloudQUsageOverview",
        version="2020-07-21",
        payload={},
        secret_id=secret_id,
        secret_key=secret_key,
        token="",
    )
    if result.get("success") is True:
        return True, ""
    error = result.get("error") or {}
    code = error.get("code", "Unknown")
    message = error.get("message", "密钥校验失败。")
    return False, f"[{code}] {message}"


def cmd_test(secret_id: str, secret_key: str) -> int:
    ok, message = _validate(secret_id, secret_key)
    if not ok:
        print(_json_err("ValidateFailed", message))
        return 1
    print(_json_ok({"valid": True, "secret_id_masked": _mask(secret_id)}))
    return 0


def cmd_save(secret_id: str, secret_key: str) -> int:
    ok, message = _validate(secret_id, secret_key)
    if not ok:
        print(_json_err("ValidateFailed", message))
        return 1

    # 长期密钥没有过期时间；沿用 credential.json 的结构，expiresAt=0 表示
    # 永不过期，get_credential() 的 "ak" 分支据此跳过刷新逻辑。
    data = {
        "type": "ak",
        "secretId": secret_id,
        "secretKey": secret_key,
        "token": "",
        "expiresAt": 0,
        "createdAt": datetime.now(timezone.utc).isoformat(),
    }
    try:
        _atomic_write_json(CREDENTIAL_FILE, data)
    except Exception as exc:  # noqa: BLE001
        print(_json_err("SaveFailed", f"写入凭证文件失败: {exc}"))
        return 1

    print(
        _json_ok(
            {
                "logged_in": True,
                "secret_id_masked": _mask(secret_id),
                "auth_type": "ak",
            }
        )
    )
    return 0


def _read_credentials_from_stdin() -> tuple:
    raw = sys.stdin.buffer.read(16 * 1024 + 1)
    if len(raw) > 16 * 1024:
        raise ValueError("凭证输入过大。")
    payload = json.loads(raw.decode("utf-8"))
    if not isinstance(payload, dict):
        raise ValueError("凭证输入必须是 JSON 对象。")
    secret_id = payload.get("secretId")
    secret_key = payload.get("secretKey")
    if not isinstance(secret_id, str) or not isinstance(secret_key, str):
        raise ValueError("SecretId 与 SecretKey 均不能为空。")
    return secret_id.strip(), secret_key.strip()


def main() -> int:
    args = sys.argv[1:]
    if len(args) != 2 or args[0] not in ("--test", "--save") or args[1] != "--stdin":
        print(_json_err("InvalidArgs", "凭证必须通过标准输入传入。"))
        return 1

    try:
        secret_id, secret_key = _read_credentials_from_stdin()
    except (UnicodeDecodeError, json.JSONDecodeError, ValueError) as exc:
        print(_json_err("InvalidInput", str(exc)))
        return 1
    if not secret_id or not secret_key:
        print(_json_err("MissingCredential", "SecretId 与 SecretKey 均不能为空。"))
        return 1

    return cmd_test(secret_id, secret_key) if args[0] == "--test" else cmd_save(secret_id, secret_key)


if __name__ == "__main__":
    sys.exit(main())
