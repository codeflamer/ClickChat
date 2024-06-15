import { Inter, Roboto_Mono, Dancing_Script } from "next/font/google";

// If loading a variable font, you don't need to specify the font weight
export const inter = Inter({ subsets: ["latin"] });

export const roboto_mono = Roboto_Mono({
  subsets: ["latin"],
  display: "swap",
});

export const dancing_script = Dancing_Script({
  subsets: ["latin"],
  display: "swap",
});
