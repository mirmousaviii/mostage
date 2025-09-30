import chalk from "chalk";
import { spawn } from "child_process";
import path from "path";
import fs from "fs-extra";

export async function devCommand(options: any) {
  try {
    console.log(chalk.blue.bold("\nMostage CLI - dev\n"));

    const port = parseInt(options.port);
    const host = options.host;
    const projectDir = path.resolve(options.dir || ".");

    // Validate project directory
    if (!(await fs.pathExists(projectDir))) {
      console.error(chalk.red(`❌ Project directory not found: ${projectDir}`));
      process.exit(1);
    }

    // Check if it's a valid Mostage project
    const indexHtmlPath = path.join(projectDir, "index.html");
    if (!(await fs.pathExists(indexHtmlPath))) {
      console.error(
        chalk.red(
          `❌ Not a valid Mostage project. index.html not found in: ${projectDir}`
        )
      );
      process.exit(1);
    }

    console.log(chalk.gray(`📁 Serving project from: ${projectDir}`));

    // Check if vite is available
    try {
      const { execSync } = await import("child_process");
      execSync("npx vite --version", { stdio: "ignore" });
    } catch (error) {
      console.log(
        chalk.yellow("⚠️  Vite not found. Installing dependencies...\n")
      );

      const installProcess = spawn("npm", ["install"], {
        stdio: "inherit",
        shell: true,
      });

      installProcess.on("close", (code) => {
        if (code === 0) {
          startDevServer(port, host, projectDir);
        } else {
          console.error(chalk.red("❌ Failed to install dependencies"));
          process.exit(1);
        }
      });

      return;
    }

    startDevServer(port, host, projectDir);
  } catch (error) {
    console.error(chalk.red("❌ Error starting development server:"), error);
    process.exit(1);
  }
}

function startDevServer(port: number, host: string, projectDir: string) {
  console.log(chalk.green(`✅ Development server starting...`));
  console.log(chalk.gray(`   Server: http://${host}:${port}`));
  console.log(chalk.gray(`   Project: ${projectDir}`));
  console.log(chalk.gray(`   Press Ctrl+C to stop\n`));

  const viteProcess = spawn(
    "npx",
    ["vite", "--port", port.toString(), "--host", host],
    {
      stdio: "inherit",
      shell: true,
      cwd: projectDir,
    }
  );

  viteProcess.on("close", (code) => {
    if (code !== 0) {
      console.error(chalk.red("❌ Development server stopped with error"));
      process.exit(1);
    }
  });

  // Handle Ctrl+C
  process.on("SIGINT", () => {
    console.log(chalk.yellow("\n\n🛑 Stopping development server..."));
    viteProcess.kill("SIGINT");
    process.exit(0);
  });
}
