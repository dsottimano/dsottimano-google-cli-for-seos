# Google cli for SEO professionals

This is an open source Chrome extension that works like a CLI and manipulates Google search queries and parameters with little effort.  It can chain commands (mostly) and it's customizable.

If you like this, please star this repository.  

## Installation (1 minute)

- Download this repository: ![https://github.com/dsottimano/dsottimano-google-cli-for-seos/archive/main.zip]
- Unzip the folder 
- In Chrome go to  chrome://extensions/
- Top right, select developer mode
- Top left, "load unpacked"

![chomre](https://developer-chrome-com.imgix.net/image/BrQidfK9jaQyIHwdw91aVpkPiib2/iYdLKFsJ1KSVGLhbLRvS.png?auto=format&w=800)


## Reference

![search shortcut](https://user-images.githubusercontent.com/3630989/102194221-0d554380-3e8b-11eb-90b3-ad6ddbc51824.png)



## What can it do?

### Program your own parameters.  In this example (;esp), we change gl,hl,lr to Spain/Spanish and use Madrid's uule to search for pizza.

![2020-12-15 03 33 33](https://user-images.githubusercontent.com/3630989/102190798-79817880-3e86-11eb-9190-84191c50f84e.gif)

### Use this in the omnibox. Warning, if you change the default operator from ; to /, Chrome will try to search your file system.

![cache in omibox](https://user-images.githubusercontent.com/3630989/102190811-7dad9600-3e86-11eb-9bbc-3a2c2b5da2aa.gif)

### Change country, language interface and results language in an instant.  ;g (country)(interface)(result_language), so in this example, ;g brfrde which means we're searching in Brazil, with a French language interface for German results.

![iphone in brasil, fr interface and german lang results](https://user-images.githubusercontent.com/3630989/102190814-7e462c80-3e86-11eb-9f89-2d4f0751c6ee.gif)

### Quickly cycle between search types.  Here, we go from cat news to videos, to images and reset with the magic ;r parameter

![news video images then reset cat](https://user-images.githubusercontent.com/3630989/102190823-800ff000-3e86-11eb-9a30-92d6cd768a78.gif)

### You can change the default operator.  Slash is nice, but can be a conflict for some searches as well as the omnibox.

![slash](https://user-images.githubusercontent.com/3630989/102190829-80a88680-3e86-11eb-94ef-f6f40fc4afaa.gif)

### Search seo updates, in the news, with 100 results for the past 24 hours

![today news 100 seo updates](https://user-images.githubusercontent.com/3630989/102190831-81d9b380-3e86-11eb-971e-dc221cc4a6d6.gif)

### Easy shortcuts for fun stuff like your public IP address.

![whatsmyip](https://user-images.githubusercontent.com/3630989/102190832-82724a00-3e86-11eb-9b9e-6de2dd8eafb1.gif)

## Configuration

Just add to the configuration object (https://github.com/dsottimano/dsottimano-google-cli-for-seos/blob/main/main.js#L25)

**Basic query changing example**

Only search ebay.com and amazon.com with shortcut ;es


```js
{
  operator: "es",
  query: 'site:ebay.com OR site:amazon.com ',
  param: null,
  info: "limits results to ebay and amazon",
  fn: null,
  fnTakesInput: false
}

```

**Basic parameter manipulation**   

Here we'll create a command with operator u to return 100 results and remove the dupe filter.

```js
{
  operator: "u",
  query: null,
  param: '&num=10&filter=0',
  info: "set result number to 100 and sets filter to 0",
  fn: null,
  fnTakesInput: false
},

```

**Basic function input example**

Function inputs are when use a command and the following string separated by a space will be used in that function. Note, if you are using a function that needs to take input, you must set fnTakesInput to true.  

```js
{
  operator: "s",
  query: null,
  param: null,
  info: "shortcut for site: operator",
  fn: function(q) {
    return this.query = "site:" + q;

  },
  fnTakesInput: true
}
``` 


