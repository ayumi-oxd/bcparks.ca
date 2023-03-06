require("dotenv").config({
  path: `.env`,
})

module.exports = {
  siteMetadata: {
    title: `BC Parks`,
    description: `BC Parks`,
    author: `@bcparks`,
    apiURL: process.env.REACT_APP_CMS_BASE_URL,
    siteUrl: process.env.REACT_APP_SITE_URL,
    image: 'https://nrs.objectstore.gov.bc.ca/kuwyyf/generic_social_1146x600_603acfb441.jpg'
  },
  plugins: [
    `gatsby-plugin-loadable-components-ssr`,
    {
      resolve: `gatsby-plugin-canonical-urls`,
      options: {
        siteUrl: `https://bcparks.ca`,
      },
    },
    `gatsby-plugin-sass`,
    `gatsby-plugin-image`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: "gatsby-source-strapi",
      options: {
        singleTypes: [],
        apiURL: process.env.REACT_APP_CMS_BASE_URL,
        accessToken: process.env.STRAPI_TOKEN,
        collectionTypes: [
          "urgency",
          "protected-area",
          "public-advisory",
          "park-photo",
          `websites`,
          `pages`,
          "activity-types",
          "facility-types",
          "menus",
          "park-operation",
          "access-statuses",
          "park-operation-sub-areas",
          "park-sub-pages",
          "sites",
          "legacy-redirect",
        ],
        queryLimit: -1,
      },
    },
    `gatsby-transformer-sharp`,
    {
      resolve: `gatsby-plugin-sharp`,
      options: {
        defaults: {
          formats: [`auto`, `webp`],
          placeholder: `dominantColor`,
          quality: 90,
        },
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/bcid-favicon-32x32.png`, // This path is relative to the root of the site.
      },
    },
    {
      resolve: `gatsby-plugin-material-ui`,
      options: {
        stylesProvider: {
          injectFirst: true,
        },
      },
    },
    `gatsby-plugin-meta-redirect`,
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        output: '/'
      }
    },
    {
      resolve: `gatsby-plugin-robots-txt`,
      options: {
        resolveEnv: () => process.env.ENV_SUFFIX || 'dev',
        env: {
          'dev': {
            policy: [{userAgent: '*', allow: ['/']}]
          },
          'test': {
            policy: [{userAgent: '*', disallow: ['/']}]
          },
          'prod': {
            policy: [{userAgent: '*', allow: ['/']}]
          },
        },
      },
    },
  ],
}
