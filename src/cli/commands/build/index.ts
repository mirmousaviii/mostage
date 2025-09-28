import chalk from "chalk";
import { spawn } from "child_process";
import path from "path";

export async function buildCommand(options: any) {
  try {
    console.log(chalk.blue.bold("\nMostage CLI - build\n"));

    const outputDir = options.output;

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
          startBuild(outputDir);
        } else {
          console.error(chalk.red("❌ Failed to install dependencies"));
          process.exit(1);
        }
      });

      return;
    }

    startBuild(outputDir);
  } catch (error) {
    console.error(chalk.red("❌ Error building project:"), error);
    process.exit(1);
  }
}

function startBuild(outputDir: string) {
  console.log(chalk.green(`✅ Building project...`));
  console.log(chalk.gray(`   Output directory: ${outputDir}\n`));

  const viteProcess = spawn("npx", ["vite", "build", "--outDir", outputDir], {
    stdio: "inherit",
    shell: true,
  });

  viteProcess.on("close", (code) => {
    if (code === 0) {
      console.log(chalk.green.bold("\n✅ Build completed successfully!"));
      console.log(chalk.gray(`   Output: ${path.resolve(outputDir)}`));
      console.log(chalk.gray(`   You can now deploy your presentation.\n`));
    } else {
      console.error(chalk.red("❌ Build failed"));
      process.exit(1);
    }
  });

  // Handle Ctrl+C
  process.on("SIGINT", () => {
    console.log(chalk.yellow("\n\n🛑 Stopping build process..."));
    viteProcess.kill("SIGINT");
    process.exit(0);
  });
}
