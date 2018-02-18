// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by hashtag.js.
import { name as packageName } from "meteor/hashtag";

// Write your tests here!
// Here is an example.
Tinytest.add('hashtag - example', function (test) {
  test.equal(packageName, "hashtag");
});
