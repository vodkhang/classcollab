// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by rocketchat-actionlink-integration.js.
import { name as packageName } from "meteor/rocketchat-actionlink-integration";

// Write your tests here!
// Here is an example.
Tinytest.add('rocketchat-actionlink-integration - example', function (test) {
  test.equal(packageName, "rocketchat-actionlink-integration");
});
