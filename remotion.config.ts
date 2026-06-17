import { Config } from "@remotion/cli/config";

// Baby images live in the app's /public folder; staticFile() resolves against it.
Config.setPublicDir("public");
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
