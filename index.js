const { readFileSync } = require('fs');
const { findWhere, filter } = require('underscore');
const usZips = require('us-zips/map')

let data_source = [];


/**
 * Parses zip_codes.csv
 */
function loadData() {
  let data = readFileSync(__dirname + '/zip_codes.csv', 'utf8');
  let lines = data.split('\r\n');

  for(let item of lines){
    let parts = item.split(',');
    let _item = {
      zip_code: parts[0],
      city: parts[1],
      state: parts[2]
    };

    let location = usZips.get(_item.zip_code);

    if(location){
      _item = {
        ..._item,
        ...location
      }
    }

    data_source.push(_item);
  }
}

/**
 * Lookup a zipcode
 * Returns data in {zip_code, city, state } format
 */
exports.lookup = function(zipcode) {
  if(data_source.length === 0){
    loadData();
  }

  let result = findWhere(data_source, {
    zip_code: zipcode
  });
  if(result){
    return result;
  }
};

/**
 * listing by state
 * Returns data in {zip_code, city, state } format
 */
exports.listByState = function(state){
  if(data_source.length === 0){
    loadData();
  }

  let result = filter(data_source, item=>{
    return state.toUpperCase() === item.state;
  });

  if(result){
    return result;
  }
}