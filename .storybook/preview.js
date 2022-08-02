import { withTests } from "@storybook/addon-jest";
import { addDecorator } from "@storybook/react";
import React from "react";
import { ThemeContext } from "wo-library/contexts";
import "ye-ui/styles/css/base";
import defaultThemeStyleOptions from "ye-ui/styles/themes";
import theme from "./theme";

let results;

try {
  results = "../../../reports/test-report.json";
} catch (error) {
  console.log("reports/test-report.json does not exist, skipping.");
}

export const parameters = {
  docs: { theme },
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: { expanded: true },
};

export const globalTypes = {
  theme: {
    name: "Theme",
    description: "Global theme for components",
    defaultValue: "default",
    toolbar: {
      icon: "circlehollow",
      // array of plain string values or MenuItem shape (see below)
      items: ["default", ...Object.keys(defaultThemeStyleOptions)],
    },
  },
  locale: {
    name: "Locale",
    description: "Internationalization locale",
    defaultValue: "en",
    toolbar: {
      icon: "globe",
      items: [
        { value: "en", right: "🇺🇸", title: "English" },
        { value: "fr", right: "🇫🇷", title: "Français" },
        { value: "es", right: "🇪🇸", title: "Español" },
        { value: "zh", right: "🇨🇳", title: "中文" },
        { value: "kr", right: "🇰🇷", title: "한국어" },
      ],
    },
  },
};

const withThemeProvider = (Story, context) => {
  return (
    <ThemeContext.ThemeProvider
      themeVariants={defaultThemeStyleOptions}
      activeThemeName={context.globals.theme}
    >
      <Story {...context} />
    </ThemeContext.ThemeProvider>
  );
};

if (results) addDecorator(withTests({ results }));

export const decorators = [withThemeProvider];
