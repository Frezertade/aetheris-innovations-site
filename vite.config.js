import { defineConfig } from 'vite';
import { resolve } from 'path';
import { copyFileSync, mkdirSync, readdirSync, existsSync, readFileSync, writeFileSync, statSync } from 'fs';

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                notFound: resolve(__dirname, '404.html'),
                privacy: resolve(__dirname, 'privacy.html'),
                terms: resolve(__dirname, 'terms.html'),
                intake: resolve(__dirname, 'intake.html'),
                leadLeakAudit: resolve(__dirname, 'lead-leak-audit.html'),
                thankYou: resolve(__dirname, 'thank-you.html'),
                products: resolve(__dirname, 'products/index.html'),
                flow: resolve(__dirname, 'products/aetheris-flow/index.html'),
                scale: resolve(__dirname, 'products/aetheris-scale/index.html'),
                build: resolve(__dirname, 'products/aetheris-build/index.html'),
                onlinePresence: resolve(__dirname, 'products/online-presence/index.html'),
                onlinePresenceNew: resolve(__dirname, 'online-presence.html'),
                medspaMoneyMagnetDemo: resolve(__dirname, 'demos/medspa-money-magnet/index.html'),
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

                // Copy static SEO solution pages to dist/solutions so Vercel serves
                // every generated industry landing page from the production build.
                const copyDir = (srcDir, destDir) => {
                    if (!existsSync(srcDir)) return;
                    mkdirSync(destDir, { recursive: true });
                    for (const entry of readdirSync(srcDir)) {
                        const srcPath = resolve(srcDir, entry);
                        const destPath = resolve(destDir, entry);
                        if (statSync(srcPath).isDirectory()) {
                            copyDir(srcPath, destPath);
                        } else {
                            copyFileSync(srcPath, destPath);
                        }
                    }
                };
                copyDir(resolve(__dirname, 'solutions'), resolve(__dirname, 'dist/solutions'));
                console.log('SEO solution pages copied to dist/solutions');
            }
        }
    ]
});
