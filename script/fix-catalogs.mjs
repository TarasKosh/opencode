import fs from 'fs';
import path from 'path';

const rootPkgPath = path.resolve('package.json');
const rootPkg = JSON.parse(fs.readFileSync(rootPkgPath, 'utf8'));
const catalog = rootPkg.workspaces?.catalog || {};

function processPackage(filePath) {
    if (!fs.existsSync(filePath)) return;
    console.log('Processing:', filePath);
    let content = fs.readFileSync(filePath, 'utf8');
    let pkg = JSON.parse(content);
    let changed = false;

    const sections = ['dependencies', 'devDependencies', 'peerDependencies'];
    sections.forEach(section => {
        if (pkg[section]) {
            for (const [name, version] of Object.entries(pkg[section])) {
                if (version === 'catalog:') {
                    if (catalog[name]) {
                        pkg[section][name] = catalog[name];
                        changed = true;
                        console.log(`  Replacing ${name}: catalog: -> ${catalog[name]}`);
                    } else {
                        console.warn(`  Warning: ${name} not found in catalog!`);
                    }
                }
            }
        }
    });

    if (changed) {
        fs.writeFileSync(filePath, JSON.stringify(pkg, null, 2), 'utf8');
        console.log('  Updated!');
    }
}

// Process root and subpackages
processPackage(rootPkgPath);

const packagesDir = path.resolve('packages');
if (fs.existsSync(packagesDir)) {
    const dirs = fs.readdirSync(packagesDir);
    dirs.forEach(dir => {
        const pkgPath = path.join(packagesDir, dir, 'package.json');
        processPackage(pkgPath);
    });
}

console.log('\n✅ Catalogs fixed! Now you can try: npm install or bun install');
