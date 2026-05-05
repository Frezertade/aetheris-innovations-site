import { defineConfig } from 'vite';
import { resolve } from 'path';
import { copyFileSync, mkdirSync, readdirSync, existsSync, readFileSync, writeFileSync } from 'fs';

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                notFound: resolve(__dirname, '404.html'),
                privacy: resolve(__dirname, 'privacy.html'),
                terms: resolve(__dirname, 'terms.html'),
                products: resolve(__dirname, 'products/index.html'),
                flow: resolve(__dirname, 'products/aetheris-flow/index.html'),
                scale: resolve(__dirname, 'products/aetheris-scale/index.html'),
                build: resolve(__dirname, 'products/aetheris-build/index.html'),
                onlinePresence: resolve(__dirname, 'products/online-presence/index.html'),
            },
        },
    },
    plugins: [
        {
            name: 'copy-blog-and-css',
            closeBundle() {
                // Copy blog HTML files
                const blogSrc = resolve(__dirname, 'blog');
                const blogDest = resolve(__dirname, 'dist/blog');
                if (!existsSync(blogDest)) {
                    mkdirSync(blogDest, { recursive: true });
                }

                // Read the hashed main.js script tag from the built index.html
                let mainScript = '';
                const distIndexPath = resolve(__dirname, 'dist/index.html');
                if (existsSync(distIndexPath)) {
                    const distIndex = readFileSync(distIndexPath, 'utf-8');
                    const scriptMatch = distIndex.match(/<script[^>]+type="module"[^>]+src="[^"]*main[^"]*\.js"[^>]*><\/script>/);
                    if (scriptMatch) {
                        mainScript = scriptMatch[0];
                    }
                }

                const files = readdirSync(blogSrc);
                for (const file of files) {
                    if (file.endsWith('.html')) {
                        const src = resolve(blogSrc, file);
                        const dest = resolve(blogDest, file);
                        let content = readFileSync(src, 'utf-8');

                        // Inject the hashed main.js script before </body> if not already present
                        if (mainScript && !/main[^"']*\.js/.test(content)) {
                            content = content.replace('</body>', `  ${mainScript}\n</body>`);
                        }

                        writeFileSync(dest, content);
                    }
                }
                console.log('Blog files copied to dist/blog (with chat widget script injected)');

                // Copy style.css to dist root for blog pages
                copyFileSync(resolve(__dirname, 'style.css'), resolve(__dirname, 'dist/style.css'));
                console.log('style.css copied to dist/');
            }
        }
    ]
});
