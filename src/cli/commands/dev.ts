import chalk from "chalk";
import { spawn } from "child_process";

export async function devCommand(options: { port: string; host: string }) {
  try {
    console.log(
      chalk.blue.bold("\n🚀 Starting Mostage development server...\n")
    );

    const port = parseInt(options.port);
    const host = options.host;

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
          startDevServer(port, host);
        } else {
          console.error(chalk.red("❌ Failed to install dependencies"));
          process.exit(1);
        }
      });

      return;
    }

    startDevServer(port, host);
  } catch (error) {
    console.error(chalk.red("❌ Error starting development server:"), error);
    process.exit(1);
  }
}

function startDevServer(port: number, host: string) {
  console.log(chalk.green(`✅ Development server starting...`));
  console.log(chalk.gray(`   Server: http://${host}:${port}`));
  console.log(chalk.gray(`   Press Ctrl+C to stop\n`));

  const viteProcess = spawn(
    "npx",
    ["vite", "--port", port.toString(), "--host", host],
    {
      stdio: "inherit",
      shell: true,
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
