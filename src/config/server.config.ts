import { config } from "dotenv"

config()

export const port = process.env.PORT || 3000;
export const environment = process.argv[2] || "dev";