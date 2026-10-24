import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

// Production hosts resolve a directory to index.html; mirror that for this static demo in dev.
const demoStaticIndexes: Plugin = {
  name: 'demo-static-indexes',
  configureServer(server) {
    server.middlewares.use((request, response, next) => {
      const [path, query] = (request.url ?? '').split('?');
      const demo = path.match(/^\/demos\/(novo|dsa)\/?$/)?.[1];
      if (!demo) { next(); return; }
      if (path === `/demos/${demo}`) {
        response.writeHead(302, { Location: `/demos/${demo}/${query ? `?${query}` : ''}` });
        response.end();
        return;
      }
      request.url = `/demos/${demo}/index.html${query ? `?${query}` : ''}`;
      next();
    });
  },
};

export default defineConfig({
  plugins: [react(), demoStaticIndexes],
});
