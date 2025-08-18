import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: './src/templates/index.html',
        home: './src/templates/home.html',
        template_doc: './src/templates/template_doc.html',
        eigen_decomposition: './src/templates/eigen_decomposition.html'
      }
    }
  },
  server: {
    host: '0.0.0.0',
    port: 5000,
  },
});
