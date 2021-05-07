const glob = require("glob");
const { findWorkspaceRoot } = require("ye-ui/lib/workspaces");
const css_regex = "/\\.css$/";
const file_regex =
  "/.(svg|ico|jpg|jpeg|png|apng|gif|eot|otf|webp|ttf|woff|woff2|cur|ani|pdf)(?.*)?$/";

function getStoriesList() {
  const fileList = glob.sync(
    "**/!(.yarn|node_modules|build|reports|public|dist)/**/*.stories.@(js|jsx|ts|tsx|mdx)",
    { cwd: findWorkspaceRoot() }
  );
  return fileList.map((item) => `../../../${item}`);
}

module.exports = {
  stories: getStoriesList(),
  addons: [
    {
      name: "@storybook/addon-postcss",
      options: {
        postcssLoaderOptions: {
          implementation: require("postcss"),
        },
      },
    },
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
    "@storybook/addon-actions",
    "@storybook/addon-backgrounds",
    "@storybook/addon-controls",
    "@storybook/addon-events",
    "@storybook/addon-jest",
    "@storybook/addon-links",
    "@storybook/addon-queryparams",
    "@storybook/addon-storysource",
    "@storybook/addon-toolbars",
    "@storybook/addon-viewport",
  ],

  webpackFinal: async (config, { configType }) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.

    // Make whatever fine-grained changes you need
    const cssRule = config.module.rules.find(
      (rule) => rule.test && rule.test.toString() === css_regex
    );
    config.module.rules = [
      ...config.module.rules.filter(
        (rule) => rule.test && rule.test.toString() !== css_regex
      ),
      {
        ...cssRule,
        exclude: /\.module\.css$/,
      },
      {
        ...cssRule,
        test: /\.module\.css$/,
        use: cssRule.use.map((rule) => {
          if (rule && rule.loader && rule.loader.match(/\Wcss-loader/g)) {
            return {
              ...rule,
              options: {
                ...rule.options,
                sourceMap: true,
                localsConvention: "camelCase",
                modules: {
                  localIdentName:
                    configType === "DEVELOPMENT"
                      ? "[name]__[local]"
                      : "[hash:base64]",
                },
              },
            };
          }
          return rule;
        }),
      },
    ];

    // sass support
    config.module.rules.push({
      test: /\.scss$/,
      use: ["style-loader", "css-loader", "sass-loader"],
    });

    // svg inline imports
    // const fileLoaderRule = config.module.rules.find(
    //   (rule) => rule.test.toString() === file_regex
    // );
    // fileLoaderRule.exclude = /\.inline.svg$/;
    // config.module.rules.push({
    //   test: /\.svg$/,
    //   use: ["@svgr/webpack", "url-loader"],
    // });
    config.node = {
      __filename: true,
      __dirname: true,
    };

    return config;
  },
};
