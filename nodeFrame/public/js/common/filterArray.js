//'null', '0', '""', 'false', 'undefined' and 'NaN'  remove
function filter_array(test_array) {
  var index = -1,
      arr_length = test_array ? test_array.length : 0,
      resIndex = -1,
      result = [];

  while (++index < arr_length) {
      var value = test_array[index];

      if (value) {
          result[++resIndex] = value;
      }
  }
  return result;
}

//https://www.w3resource.com/javascript-exercises/javascript-array-exercise-24.php