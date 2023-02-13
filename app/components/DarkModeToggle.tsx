import { Moon, Sun } from "lucide-react";

import { Theme, Themed, useTheme } from "~/utils/theme-provider";

export const DarkModeToggle = () => {
    const [, setTheme] = useTheme();

    const toggleTheme = () => {
        setTheme((prevTheme) =>
            prevTheme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT
        );
    };

    return (
        <div className="h-8 w-8">
            <Themed
                dark={
                    <button
                        className="flex h-8 w-8 items-center justify-center"
                        onClick={toggleTheme}
                        aria-label="Toggle dark mode"
                    >
                        <Moon className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
                    </button>
                }
                light={
                    <button
                        className="flex h-8 w-8 items-center justify-center"
                        onClick={toggleTheme}
                        aria-label="Toggle light mode"
                    >
                        <Sun className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
                    </button>
                }
            />
        </div>
    );
};
