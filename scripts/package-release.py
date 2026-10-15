#!/usr/bin/env python3
"""Package explicit public artifacts; never zip the working directory wholesale."""
import hashlib
import json
from pathlib import Path
import zipfile

ROOT = Path(__file__).resolve().parent.parent
VERSION = json.loads((ROOT / 'package.json').read_text())['version']
OUT = ROOT / 'output' / 'releases'


def files_under(folder):
    return sorted(p for p in (ROOT / folder).rglob('*') if p.is_file())


def archive(name, entries):
    path = OUT / name
    with zipfile.ZipFile(path, 'w', zipfile.ZIP_DEFLATED, compresslevel=6) as z:
        for source, target in entries:
            if not source.is_file():
                raise FileNotFoundError(source)
            z.write(source, target)
    return path


def main():
    catalog = json.loads((ROOT / 'catalog.json').read_text())
    for book in catalog['books']:
        for lang in ('zh', 'en'):
            if not (ROOT / 'dist' / 'downloads' / f"{book['id']}-{lang}.png").is_file():
                raise SystemExit('Run npm run build before packaging the release.')
    for name in ('01-introduction.png', '02-chinese-literature.png',
                 '03-world-literature.png', '04-process.png', 'github-cover.png'):
        if not (ROOT / 'press' / name).is_file():
            raise SystemExit('Run npm run export -- --out press before packaging.')
    OUT.mkdir(parents=True, exist_ok=True)
    common = [(ROOT / f, f) for f in ('ASSETS.md', 'LICENSE', 'LICENSE-ARTWORK')]
    skill = ROOT / 'skills'
    result = [archive(f'quiet-book-covers-v{VERSION}.zip',
                      [(p, p.relative_to(skill)) for p in files_under('skills/quiet-book-covers')])]
    result.append(archive(f'quiet-covers-artwork-v{VERSION}.zip',
                          common + [(ROOT / 'catalog.json', 'catalog.json')]
                          + [(p, p.relative_to(ROOT)) for d in ('artwork', 'prompts', 'process') for p in files_under(d)]))
    result.append(archive(f'quiet-covers-typeset-v{VERSION}.zip', common
                          + [(ROOT / 'fonts/OFL.txt', 'fonts/OFL.txt')]
                          + [(p, Path('covers') / p.name) for p in files_under('dist/downloads')]))
    result.append(archive(f'quiet-covers-press-v{VERSION}.zip', common
                          + [(p, p.relative_to(ROOT)) for p in files_under('press')]))
    sums = ''.join(f'{hashlib.sha256(p.read_bytes()).hexdigest()}  {p.name}\n' for p in result)
    (OUT / 'SHA256SUMS.txt').write_text(sums)
    for p in result:
        with zipfile.ZipFile(p) as z:
            if z.testzip() is not None:
                raise RuntimeError(f'Archive failed CRC validation: {p}')
        print(f'{p.name}: {p.stat().st_size / 1024 / 1024:.2f} MiB')


if __name__ == '__main__':
    main()
