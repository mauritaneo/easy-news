import { createReadStream } from 'fs';
import { join } from 'path';
import { parse } from 'url';

export default async function serveDist(req, res) {
  const parsedUrl = parse(req.url, true);
  const path = join(process.cwd(), 'dist', parsedUrl.pathname);

  try {
    const stream = createReadStream(path);
    stream.pipe(res);
  } catch (error) {
    res.statusCode = 404;
    res.end('Not found');
  }
}
