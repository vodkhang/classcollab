// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by rocketchat-integration-management.js.
import { name as packageName } from "meteor/rocketchat-integration-management";

// Write your tests here!
// Here is an example.
Tinytest.add('rocketchat-integration-management - example', function (test) {
  test.equal(packageName, "rocketchat-integration-management");
});
