/**
 * Helper script to help clean up the auto generated src/cms/extensions/documentation/documentation/1.0.0/full_documentation.json
 * for the Kong gwa client.
 * 
 * Mainly used to remove non-publicly used Strapi endpoints in the OpenAPI spec
 */

const fs = require("fs");

const data = require("./public-documentation.json");

const pathsToDelete = [
  "/public-advisory-audits",
  "/statutory-holiday",
  "/tokens",
  "/email/settings",
  "/upload",
  "/users-permissions",
  "/users",
  "/auth",
  "/connect",
  "/email",
];
const paths = data.paths;

Object.keys(paths).forEach((item) => {
  Object.keys(paths[item])
    .filter((key) => ["post", "delete", "put"].includes(key))
    .forEach((key) => delete paths[item][key]);
  
  pathsToDelete.forEach((match) => {
    if (item.startsWith(match)) {
      delete paths[item];
    }
  });
});

data.components.schemas.Website.properties.homepage.properties.data.properties.attributes.properties.Content.type = "object";
data.info.title = "BCPARKS";

fs.writeFileSync("public-documentation.json", JSON.stringify(data));
