"""Smoke-test the guide's actual commands. Linux mode needs sudo and a BBR kernel.

Use --desktop to test the documented BBR bypass on Docker Desktop instead.
This verifies startup and connectivity, not full sync or a light-node connection.
"""

import argparse
import json
import os
from pathlib import Path
import re
import socket
import subprocess
import tempfile
import time
from urllib.error import URLError
from urllib.request import urlopen


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("network", choices=["mainnet", "mocha"])
    parser.add_argument("--desktop", action="store_true")
    args = parser.parse_args()

    root = Path(__file__).resolve().parent.parent
    guide = (root / "app/operate/consensus-validators/docker/page.mdx").read_text()
    values = {
        "constants": json.loads((root / "constants/general.json").read_text()),
        "mainnetVersions": json.loads((root / "constants/mainnet_versions.json").read_text()),
        "mochaVersions": json.loads((root / "constants/mocha_versions.json").read_text()),
    }
    guide = re.sub(
        r"\{\{(\w+)\['([^']+)'\]\}\}",
        lambda match: values[match[1]][match[2]],
        guide,
    )

    def block(heading):
        section = guide.split(heading + "\n", 1)[1]
        return re.search(r"```bash\n(.*?)```", section, re.S)[1]

    # Refuse to touch an existing container or network when run locally.
    for kind, name in [("container", "celestia-app"), ("network", "celestia-network")]:
        if subprocess.run(["docker", kind, "inspect", name], capture_output=True).returncode == 0:
            raise RuntimeError(f"{kind} {name} already exists; use an isolated Docker host")

    network = block("**Mainnet Beta**" if args.network == "mainnet" else "**Mocha**")
    with tempfile.TemporaryDirectory(prefix="consensus-docker-") as home:
        env = dict(os.environ, APP_HOME=home)

        def run(command):
            subprocess.run(["bash", "-euo", "pipefail", "-c", network + command],
                           env=env, check=True, cwd=root)

        try:
            if not args.desktop:
                run(block("## Prepare a Linux host for BBR"))
            run(block("### Initialize the node home"))
            run(block("### Download the genesis file"))
            run(block("### Configure seeds"))
            heading = "#### Docker Desktop for local testing" if args.desktop else "#### Linux with BBR"
            run(block(heading))

            if not args.desktop:
                actual = subprocess.check_output([
                    "docker", "exec", "celestia-app", "cat",
                    "/proc/sys/net/ipv4/tcp_congestion_control",
                ], text=True).strip()
                if actual != "bbr":
                    raise RuntimeError(f"Expected container BBR, got {actual}")

            chain = values["constants"][args.network + "ChainId"]
            deadline = time.monotonic() + 120
            while True:
                try:
                    with urlopen("http://127.0.0.1:26657/status", timeout=2) as response:
                        status = json.load(response)["result"]
                    if status["node_info"]["network"] != chain:
                        raise RuntimeError(f"Unexpected chain: {status['node_info']['network']}")
                    with socket.create_connection(("127.0.0.1", 9090), timeout=2):
                        pass
                    break
                except (URLError, OSError):
                    if time.monotonic() >= deadline:
                        raise
                    time.sleep(1)

            run(block("### Create a shared Docker network"))
            run(block("### Connect celestia-app to the shared network"))
            run('docker run --rm --network celestia-network --entrypoint sh '
                'ghcr.io/celestiaorg/celestia-app:$APP_VERSION '
                "-c 'nc -z -w 5 celestia-app 9090'")
            print(f"PASS {chain}: genesis verified, RPC chain ID, host and shared-network gRPC TCP; "
                  f"BBR={'bypassed' if args.desktop else 'enabled'}", flush=True)
        finally:
            subprocess.run(["docker", "logs", "--tail", "80", "celestia-app"], check=False)
            subprocess.run(["docker", "stop", "celestia-app"], check=False)
            subprocess.run(["docker", "rm", "-f", "celestia-app"], check=False)
            subprocess.run(["docker", "network", "rm", "celestia-network"], check=False)


if __name__ == "__main__":
    main()
