import io
import json
import sys
import unittest
from pathlib import Path
from unittest.mock import patch

SCRIPTS_DIR = Path(__file__).resolve().parents[1] / "scripts"
sys.path.insert(0, str(SCRIPTS_DIR))

import login  # noqa: E402
import save_ak  # noqa: E402


class BinaryStdin:
    def __init__(self, value: bytes):
        self.buffer = io.BytesIO(value)


class SecureInputTests(unittest.TestCase):
    def test_save_ak_reads_credentials_from_stdin(self):
        payload = json.dumps({"secretId": "AKIDEXAMPLE", "secretKey": "secret"}).encode()
        with patch.object(sys, "stdin", BinaryStdin(payload)):
            self.assertEqual(
                save_ak._read_credentials_from_stdin(),
                ("AKIDEXAMPLE", "secret"),
            )

    def test_save_ak_rejects_legacy_argv_credentials(self):
        with patch.object(sys, "argv", ["save_ak.py", "--test", "AKIDEXAMPLE", "secret"]):
            with patch("builtins.print") as output:
                self.assertEqual(save_ak.main(), 1)
        self.assertIn("InvalidArgs", output.call_args.args[0])

    def test_save_ak_stdin_mode_does_not_forward_secrets_as_arguments(self):
        payload = json.dumps({"secretId": "AKIDEXAMPLE", "secretKey": "secret"}).encode()
        with patch.object(sys, "argv", ["save_ak.py", "--test", "--stdin"]):
            with patch.object(sys, "stdin", BinaryStdin(payload)):
                with patch.object(save_ak, "cmd_test", return_value=0) as command:
                    self.assertEqual(save_ak.main(), 0)
        command.assert_called_once_with("AKIDEXAMPLE", "secret")

    def test_login_reads_authorization_code_from_bounded_stdin(self):
        payload = json.dumps({"code": "authorization-code"}).encode()
        with patch.object(sys, "stdin", BinaryStdin(payload)):
            self.assertEqual(login._read_code_from_stdin(), "authorization-code")

    def test_login_rejects_legacy_argv_authorization_code(self):
        with patch.object(sys, "argv", ["login.py", "--save", "authorization-code"]):
            with patch("builtins.print"):
                with self.assertRaises(SystemExit) as result:
                    login.main()
        self.assertEqual(result.exception.code, 1)


if __name__ == "__main__":
    unittest.main()
