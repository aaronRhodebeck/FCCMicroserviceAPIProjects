# Microservice and API Projects for freeCodeCamp Backend Challenges

This is a collection of API endpoints hosted on [glitch.com](http://www.aaron-rhodebeck-freecodecamp-api-projects.glitch.me/) so that it will be testable by [freeCodeCamp](https://www.beta.freeCodeCamp.com).

**Project Descriptions**

* [Timestamp Microservice](#timestamp-microservice)
* [Request Header Parser Microservice](#request-header-parser-service)
* [URL Shortener Microservice](#url-shortener-microservice)
* [Exercise Tracker](#exercise_tracker)
* [File Metadata Microservice](#file-metadata-microservice)

---

## Timestamp Microservice

### User stories:

1. The API endpoint is `GET [project_url]/api/timestamp/:date_string?`
2. A date string is valid if can be successfully parsed by `new Date(date_string)` (JS) . Note that the unix timestamp needs to be an **integer** (not a string) specifying **milliseconds**. In our test we will use date strings compliant with ISO-8601 (e.g. `"2016-11-20"`) because this will ensure an UTC timestamp.
3. If the date string is **empty** it should be equivalent to trigger `new Date()`, i.e. the service uses the current timestamp.
4. If the date string is **valid** the api returns a JSON having the structure
   `{"unix": <date.getTime()>, "utc" : <date.toUTCString()> }`
   e.g. `{"unix": 1479663089000 ,"utc": "Sun, 20 Nov 2016 17:31:29 GMT"}`.
5. If the date string is **invalid** the api returns a JSON having the structure `{"unix": null, "utc" : "Invalid Date" }`. It is what you get from the date manipulation functions used above.

#### Example usage:

* https://curse-arrow.hyperdev.space/api/timestamp/2015-12-15
* https://curse-arrow.hyperdev.space/api/timestamp/1450137600000

#### Example output:

* { "unix": 1450137600, "natural": "December 15, 2015" }

---

## Request Header Parser Microservice

### User Story:

1. I can get the IP address, preferred languages (from header Accept-Language) and system infos (from header User-Agent) for my device.

#### Example Usage:

[\[base url\]/api/whoami](http://www.aaron-rhodebeck-freecodecamp-api-projects.glitch.me/api/whoami)

#### Example Output:

```json
{
  "ipaddress": "159.20.14.100",
  "language": "en-US;q=0.5",
  "sofware":
    "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:50.0) Gecko/20100101 Firefox/50.0"
}
```

---

## URL Shortener Microservice

### User Stories:

1. I can POST a URL to [project_url]/api/shorturl/new and I will receive a shortened URL in the JSON response.
   Example:

```json
{ "original_url": "www.google.com", "short_url": 1 }
```

2. If I pass an invalid URL that doesn't follow the http(s)://www.example.com(/more/routes) format, the JSON response will contain an error like {"error":"invalid URL"}.
   HINT: to be sure that the submitted url points to a valid site you can use the function dns.lookup(host, cb) from the dns core module.

3. When I visit the shortened URL, it will redirect me to my original link.

### Short URL Creation

Example: `POST [project_url]/api/shorturl/new - https://www.google.com`

**Example Usage:**
`[this_project_url]/api/shorturl/3`

**Will redirect to:**
`https://forum.freecodecamp.com`

---

## Exercise Tracker

_[See this page for details](https://aaron-rhodebeck-freecodecamp-api-projects.glitch.me/exercise-tracker)_

---

## File Metadata Microservice

### User Stories:

1. I can submit a form object that includes a file upload.
2. The from file input field has the "name" attribute set to "upfile". freeCodeCamp relies on this for testing.
3. Whe I submit something, I will recieve the file name, an dsize in bytes within the JSON response.

### Usage:

[See this page](https://aaron-rhodebeck-freecodecamp-api-projects.glitch.me/file-metadata-microservice)
