//change the default operator character here
let defaultOperator = "/";

//regex patterns for checking if the function should run or be cleared
let existRegex = new RegExp(`^\\${defaultOperator}.+|\\B\\${defaultOperator}.+`, 'g');
let resetPatternRegex = new RegExp(`^\\${defaultOperator}r|\\B\\${defaultOperator}r`, 'g');

//add your new commands in this object
let patternObject = [{
  operator: defaultOperator + "s",
  query: 'site:stackoverflow.com',
  param: null,
  info: "limits results to stackoverflow",
  fn: null
},
{
  operator: defaultOperator + "c",
  query: 'cache:',
  param: null,
  info: "shortcut for cache: operator",
  fn: null
},
{
  operator: defaultOperator + "f",
  query: null,
  param: '&filter=0',
  info: "removes auto filtering of results",
  fn: null
},
{
  operator: defaultOperator + "th",
  query: null,
  param: '&tbs=qdr:h',
  info: "set result recency of last hour",
  fn: null
},
{
  operator: defaultOperator + "td",
  query: null,
  param: '&tbs=qdr:d',
  info: "set result recency of 24 hours",
  fn: null
},
{
  operator: defaultOperator + "tw",
  query: null,
  param: '&tbs=qdr:w',
  info: "set result recency of 1 week",
  fn: null
},
{
  operator: defaultOperator + "ty",
  query: null,
  param: '&tbs=qdr:y',
  info: "set result recency of 1 year",
  fn: null
},
{
  operator: defaultOperator + "100",
  query: null,
  param: '&num=100',
  info: "set result number to 100",
  fn: null
},
{
  operator: defaultOperator + "10",
  query: null,
  param: '&num=10',
  info: "set result number to 10",
  fn: null
},
{
  operator: defaultOperator + "20",
  query: null,
  param: '&num=20',
  info: "set result number to 20",
  fn: null
},
{
  operator: defaultOperator + "1",
  query: null,
  param: '&num=1',
  info: "set result number to 1",
  fn: null
},
{
  operator: defaultOperator + "dup",
  query: '-site:yoursite.com "the verbatim text to check for plagiarized content"',
  param: null,
  info: "example pattern to find plagiarized content",
  fn: null
},
{
  operator: defaultOperator + "n",
  query: null,
  param: '&tbm=nws',
  info: "change search to news",
  fn: null
},
{
  operator: defaultOperator + "i",
  query: null,
  param: '&tbm=isch',
  info: "change search to image",
  fn: null
},
{
  operator: defaultOperator + "v",
  query: null,
  param: '&tbm=vid',
  info: "change search to video",
  fn: null
},
{
  operator: defaultOperator + "g",
  query: null,
  param: null,
  info: "to change country, interface lang and results lang. /gufrende would be &gl=fr&hl=en&lr=lang_de",
  fn: function (q) {
    let [o, gl, hl, lr] = q.match(/.{1,2}/g);
    let intlParamString = '';
    if (gl) intlParamString += `&gl=${gl}`;
    if (hl) intlParamString += `&hl=${hl}`;
    if (lr) intlParamString += `&lr=lang_${lr}`;
    return this.param = intlParamString
  }
},
{
  operator: defaultOperator + "esp",
  query: null,
  param: '&gl=es&hl=es&lr=lang_es&uule=w+CAIQICIMbWFkcmlkIHNwYWlu',
  info: "changes location to Madrid Spain, in Spanish",
  fn: null
}
];



//listens for the popup to message and sends back the entire patternObject so we can display in html
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    sendResponse(patternObject)
  }
);



//keep this variable here, there's weirdness with persistance
let params = [];

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

    for (part in q) {

      if (q[part].includes(defaultOperator)) {

        for (let k in patternObject) {

          //pattern matching, function execution, parameter adding
          let pattern = new RegExp(`^${patternObject[k].operator}`);
          if (q[part].match(pattern)) {
            if (patternObject[k].fn != null) patternObject[k].fn(q[part]);
            if (patternObject[k].param != null) params.push(patternObject[k].param);
            q[part] =  q[part].replace(pattern,patternObject[k].query || "").trim();
            break;
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




