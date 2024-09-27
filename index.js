
const fs = require("fs");
const path = require("path");

const projectDir = path.resolve("."); // 当前项目目录
const excludeDirs = ["node_modules", ".git"]; // 应该排除的目录

// 读取并解析package.json
function readPackageJson() {
  const packageJsonPath = path.join(projectDir, "package.json");
  if (!fs.existsSync(packageJsonPath)) {
    console.error("package.json not found.");
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
}

// 递归遍历目录获取所有文件路径
function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function (file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      if (!excludeDirs.includes(file)) {
        arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
      }
    } else {
      arrayOfFiles.push(path.join(dirPath, "/", file));
    }
  });

  return arrayOfFiles;
}

// 检查依赖是否在文件中被引用，包括动态引用
function isDependencyUsed(files, dependency) {
  const regexStaticImport = new RegExp(
    `require\\(['"\`]${dependency}['"\`]|from ['"\`]${dependency}['"\`]`,
    "i"
  );
  const regexDynamicImport = new RegExp(
    `import\\(['"\`]${dependency}['"\`]\\)`,
    "i"
  );
  return files.some((file) => {
    const fileContent = fs.readFileSync(file, "utf8");
    return (
      regexStaticImport.test(fileContent) ||
      regexDynamicImport.test(fileContent)
    );
  });
}

function findUnusedDependencies() {
  const { dependencies } = readPackageJson();
  const allFiles = getAllFiles(projectDir);
  const unusedDependencies = [];

  Object.keys(dependencies).forEach((dependency) => {
    if (!isDependencyUsed(allFiles, dependency)) {
      unusedDependencies.push(dependency);
    }
  });

  return unusedDependencies;
}

const unusedDependencies = findUnusedDependencies();
if (unusedDependencies.length > 0) {
  console.log("未使用的依赖:", unusedDependencies.join(", "));
} else {
  console.log("所有依赖都已使用。");
}