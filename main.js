/**
 * @author David Sottimano
 * @email dsottimano@gmail.com
 * @twitter twitter.com/dsottimano
 * @create date 2020-12-14
 * @desc CLI for Google search
 */


//change the default operator character here
let defaultOperator = ";";


//keep this variable here, there's weirdness with persistance
let params = [];

//regex patterns for checking if the function should run or be cleared
let existRegex = new RegExp(`^\\${defaultOperator}.+|\\B\\${defaultOperator}.+`, 'g');
let resetPatternRegex = new RegExp(`^\\${defaultOperator}r|\\B\\${defaultOperator}r`, 'g');
let geoPatternRegex = new RegExp(`^\\${defaultOperator}g|\\B\\${defaultOperator}g`, 'g');


/**** CONFIG OBJECT ****/
//add your new commands in this object
let patternObject = [{
  operator: "s",
  query: null,
  param: null,
  info: "compares safe search. domain required for input after operator ",
  fn: function(q) {
    this.query = "site:" + q;
    this.param = "&safe=active"
    chrome.tabs.create({'url': 'https://www.google.com/search?q='+ this.query + '&safe=images' }, function(tab) {
      // opened tab, what to do, what to do...
  });
  } ,
  fnTakesInput: true
},
{
  operator: "c",
  query: null,
  param: null,
  info: "shortcut for cache: operator",
  fn: function(q) {
    return this.query = "cache:" + q;

  },
  fnTakesInput: true
},
{
  operator: "f",
  query: null,
  param: '&filter=0',
  info: "removes auto filtering of results",
  fn: null, fnTakesInput: false
},
{
  operator: "th",
  query: null,
  param: '&tbs=qdr:h',
  info: "set result recency of last hour",
  fn: null,
  fnTakesInput: false
},
{
  operator: "td",
  query: null,
  param: '&tbs=qdr:d',
  info: "set result recency of 24 hours",
  fn: null,
  fnTakesInput: false
},
{
  operator: "tw",
  query: null,
  param: '&tbs=qdr:w',
  info: "set result recency of 1 week",
  fn: null,
  fnTakesInput: false
},
{
  operator: "ty",
  query: null,
  param: '&tbs=qdr:y',
  info: "set result recency of 1 year",
  fn: null,
  fnTakesInput: false
},
{
  operator: "100",
  query: null,
  param: '&num=100',
  info: "set result number to 100",
  fn: null,
  fnTakesInput: false
},
{
  operator: "10",
  query: null,
  param: '&num=10',
  info: "set result number to 10",
  fn: null,
  fnTakesInput: false
},
{
  operator: "20",
  query: null,
  param: '&num=20',
  info: "set result number to 20",
  fn: null,
  fnTakesInput: false
},
{
  operator: "1",
  query: null,
  param: '&num=1',
  info: "set result number to 1",
  fn: null,
  fnTakesInput: false
},
{
  operator: "dup",
  query: '-site:yoursite.com "the verbatim text to check for plagiarized content"',
  param: null,
  info: "example pattern to find plagiarized content",
  fn: null,
  fnTakesInput: false
},
{
  operator: "n",
  query: null,
  param: '&tbm=nws',
  info: "change search to news",
  fn: null,
  fnTakesInput: false
},
{
  operator: "i",
  query: null,
  param: '&tbm=isch',
  info: "change search to image",
  fn: null,
  fnTakesInput: false
},
{
  operator: "v",
  query: null,
  param: '&tbm=vid',
  info: "change search to video",
  fn: null,
  fnTakesInput: false
},
{
  operator: "ip",
  query: 'whatsmyip',
  param: null,
  info: "change search to video",
  fn: null,
  fnTakesInput: false
},
{
  operator: "g",
  query: null,
  param: null,
  info: "to change country, interface lang and results lang. /gufrende would be &gl=fr&hl=en&lr=lang_de",
  fn: function (q) {
    
    let [gl, hl, lr] = q.match(/.{1,2}/g);
    let intlParamString = '';
    if (gl) intlParamString += `&gl=${gl}`;
    if (hl) intlParamString += `&hl=${hl}`;
    if (lr) intlParamString += `&lr=lang_${lr}`;
    return this.param = intlParamString
  },
  fnTakesInput: true
},
{
  operator: "esp",
  query: null,
  param: '&gl=es&hl=es&lr=lang_es&uule=w+CAIQICIMbWFkcmlkIHNwYWlu',
  info: "changes location to Madrid Spain, in Spanish",
  fn: null,
  fnTakesInput: true
}
];

let errors = []
patternObject.map(x=> {
  if (x.fnTakesInput && !x.query &!x.fn) {
    errors.push({name: x, error: "query, param must be null and there must be a function"})
  }

})

//listens for the popup to message and sends back the entire patternObject so we can display in html
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    sendResponse({patternObject,defaultOperator,errors})
  }
);


chrome.webRequest.onBeforeRequest.addListener(
  function (details) {

    //get the Google search URL
    let url = new URL(details.url)

    //if it's not google, just end the function
    if (!url.hostname.includes("google")) return

    //get the user query
    let q = url.searchParams.get("q");

    //if the default operator is not in the query, end the function
    if (!q.match(existRegex)) return

    //special check for ;r, which resets parameters. If this is in the query, return a clean search page and end the function
    if (q.match(resetPatternRegex)) {
      q = q.replace(defaultOperator + "r", "")
      params = [];
      return { redirectUrl: url.origin + "/search?q=" + q.trim() };
    }




    //break up the query by spaces to check each part
    q = q.split(' ')

    for (let part = 0; part < q.length; part++) {

      if (q[part].match(existRegex)) {

        for (let k in patternObject) {
       
          //pattern matching, function execution, parameter adding
          let exactPattern = new RegExp(`^${defaultOperator}${patternObject[k].operator}$`, 'g')

          if (q[part].match(exactPattern)) {

            //these are special input functions, like /g us where the next value after the operator (us) is used for the function
            if (patternObject[k].fnTakesInput) {
              if (patternObject[k].fn != null) patternObject[k].fn(q[part + 1]);
              if (patternObject[k].param != null) params.push(patternObject[k].param);
              q[part] = q[part].replace(q[part], patternObject[k].query || "").trim();
              q[part + 1] = ''.trim();
              part++
              break;

            //standard query  
            } else {
              if (patternObject[k].fn != null) patternObject[k].fn(q[part]);
              if (patternObject[k].param != null) params.push(patternObject[k].param);
              console.log(params)
              q[part] = q[part].replace(q[part], patternObject[k].query || "").trim();
              break;
            }

          }
        }

      } else {
        continue;
      }
    }

    //remove falsey values from the query and turn into string
    let newQuery = q.filter(Boolean).join(' ');

    //de-dupe the params and turn them into a string
    let newParams = [...new Set(params)].join('');

    return { redirectUrl: url.origin + "/search?q=" + newQuery + newParams };

  },
  { urls: ["*://*/search?*"] }, ["blocking"]);




