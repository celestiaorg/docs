#!/usr/bin/env python3
"""Exercise the actual MDX Bash blocks offline; requires Bash, jq and Python 3."""
import argparse
import json
import os
from pathlib import Path
import re
import subprocess
import tempfile

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('page', type=Path, nargs='?',
                    default=Path(__file__).resolve().parent.parent /
                    'app/build/post-retrieve-blob/fibre/page.mdx')
parser.add_argument('--reproduce-original', action='store_true')
args = parser.parse_args()
source = args.page.read_text()
blocks = re.findall(r'```bash\n(.*?)\n```', source, re.S)
# Check every published shell block, including authentication and setup.
for index, block in enumerate(blocks):
    syntax = subprocess.run(['bash', '-n'], input=block, text=True, capture_output=True)
    assert syntax.returncode == 0, (index, syntax.stderr)
for name in ['FIBRE_HOME', 'NODE_RPC', 'KEY_NAME', 'AUTH_TOKEN', 'SIGNER']:
    assert re.search(rf'^export {name}=', source, re.M), f'Missing export: {name}'
assert 'restart the node after funding' in source, 'Missing funding restart warning'
rpc = next(b[b.index('rpc() {'):] for b in blocks if 'rpc() {' in b)
setup = 'set -o pipefail\n' if 'set -o pipefail' in source else ''
mock = '''
curl() { cat >/dev/null; cat "$FIXTURE"; return "$CURL_STATUS"; }
jq() {
  if [[ "$1" == -nc && "$REQUEST_STATUS" != 0 ]]; then
    command jq "$@"
    return "$REQUEST_STATUS"
  fi
  command jq "$@"
}
'''
def run(kind, payload, curl_status=0, request_status=0, old_receipt=False):
    block = next(b for b in blocks if f'| rpc > {kind}.json' in b)
    with tempfile.TemporaryDirectory() as d:
        p = Path(d)
        (p/'fixture.json').write_text(payload)
        if old_receipt:
            (p/'receipt.json').write_text('previous receipt\n')
        script = setup + mock + rpc + '\n' + block
        syntax = subprocess.run(['bash', '-n'], input=script, text=True, capture_output=True)
        assert syntax.returncode == 0, syntax.stderr
        env = dict(os.environ, FIXTURE=str(p/'fixture.json'), CURL_STATUS=str(curl_status),
                   REQUEST_STATUS=str(request_status), SIGNER='test-signer', KEY_NAME='test-key',
                   AUTH_TOKEN='dummy-offline-token', NODE_RPC='http://unused.invalid')
        result = subprocess.run(['bash', '--noprofile', '--norc'], input=script, cwd=d,
                                env=env, text=True, capture_output=True)
        receipt = (p/'receipt.json').read_text() if (p/'receipt.json').exists() else None
        return result, receipt

valid_result = {'height': 42, 'tx_hash': 'ABC123', 'blob_id': 'test-blob'}
def response(result):
    return json.dumps({'jsonrpc':'2.0', 'id':4, 'result':result})
valid = {'submit': response(valid_result), 'deposit': response(None),
         'escrow': response({'available_balance': {'denom':'utia', 'amount':'2000000'}})}
if args.reproduce_original:
    for payload in ['', '{"error":{"message":"timeout"}}']:
        result, receipt = run('submit', payload, curl_status=28, old_receipt=True)
        print(f'Original: body={payload!r}, block exit={result.returncode}, receipt={receipt!r}')
        assert result.returncode == 0 and receipt != 'previous receipt\n'
    print('Reproduced: failed transport/validation continues and overwrites an existing receipt.')
    raise SystemExit(0)

count = 0
for kind in valid:
    cases = [('success', valid[kind], 0, 0, True)]
    cases += [(name, payload, 0, 0, False) for name, payload in [
        ('empty', ''), ('whitespace', ' \n\t'), ('malformed', '{'), ('null', 'null'),
        ('array', '[]'), ('number', '42'), ('string', '"text"'), ('boolean', 'true'),
        ('missing result', '{}'), ('rpc error', '{"error":{"code":-1}}'),
        ('multiple responses', valid[kind] + '\n' + valid[kind]),
        ('success plus error', json.dumps(dict(json.loads(valid[kind]), error=None))),
    ]]
    cases += [('transport failure empty', '', 28, 0, False),
              ('transport failure valid body', valid[kind], 22, 0, False),
              ('request generation failure', valid[kind], 0, 7, False)]
    if kind == 'deposit':
        cases += [('non-null deposit', response({}), 0, 0, False)]
    if kind == 'escrow':
        for value in [None, {}, 'bad', {'denom':'other','amount':'1'},
                      {'denom':'utia','amount':1}, {'denom':'utia','amount':''},
                      {'denom':'utia','amount':'-1'}]:
            cases.append(('bad balance ' + repr(value), response({'available_balance':value}),0,0,False))
    if kind == 'submit':
        for field, values in [('height', [None,0,-1,1.5,'42']),
                              ('tx_hash', [None,'',[],{}]), ('blob_id', [None,'',[],{}])]:
            for value in values:
                cases.append((f'bad {field} {value!r}', response(dict(valid_result, **{field:value})),0,0,False))
        for field in valid_result:
            cases.append((f'missing {field}', response({k:v for k,v in valid_result.items() if k != field}),0,0,False))
    for name, payload, curl_status, request_status, succeeds in cases:
        for old_receipt in ([False,True] if kind == 'submit' else [False]):
            result, receipt = run(kind, payload, curl_status, request_status, old_receipt)
            assert (result.returncode == 0) == succeeds, (kind,name,result.returncode,result.stderr)
            if kind == 'submit':
                if succeeds:
                    assert json.loads(receipt) == valid_result, (kind,name,receipt)
                else:
                    assert receipt == ('previous receipt\n' if old_receipt else None), (kind,name,receipt)
            count += 1
print(f'PASS: {count} offline cases; actual guide blocks, Bash syntax, transport/pipeline errors, response shapes, and receipt preservation.')
print(subprocess.check_output(['jq','--version'], text=True).strip())
