
var docusign = require('docusign-esign-react-native');
var _ = require('lodash');

var helpers = {};

helpers.makeTab = function makeTab(type, data) {
  // https://docs.docusign.com/esign/restapi/Envelopes/EnvelopeTabs/

  // SignHere
  // Custom
  // FullName
  // InitialHere
  // InitialHereOptional
  // etc.

  var tab = new docusign[type].constructFromObject(data);
  return tab;
}


module.exports = helpers;