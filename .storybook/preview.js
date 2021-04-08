import { withTests } from "@storybook/addon-jest";
import { addDecorator } from "@storybook/react";
import React from "react";
import ThemeProvider from "ye-ui/components/utilities/ThemeProvider";
import themes from "ye-ui/themes";
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
      items: ["default", ...Object.keys(themes)],
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
  const theme = context.globals.theme;
  return (
    <ThemeProvider theme={theme}>
      <Story {...context} />
    </ThemeProvider>
  );
};

if (results) addDecorator(withTests({ results }));

export const decorators = [withThemeProvider];
