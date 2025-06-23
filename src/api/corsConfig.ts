import { CorsOptions } from "cors";

const allowedOrigin =
  process.env.NODE_ENV === "dev"
    ? "*"
    : (process.env.API_ALLOWED_ORIGIN ?? false);

const corsOptions: CorsOptions = {
  origin: allowedOrigin,
};

export default corsOptions;
