function createEl(nodeType,innerHTML,attrObj){
  var _el = document.createElement(nodeType)
  _el.innerHTML = innerHTML
  if( attrObj ){
    Object.keys(attrObj).forEach(function(key){
      _el.setAttribute(key,attrObj[key])
    })  
  }
  return _el
}

function slugify(text){
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

function toHHMMSS(input) {
    var sec_num = parseInt(input, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours+':'+minutes+':'+seconds;
}

function now(argument) {
  return Math.round(new Date() / 1000)
}