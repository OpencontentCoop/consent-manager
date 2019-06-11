# Consent-Manager

An opensource solution to track and manage user consent compliant with GDPR

## Service Definition

This service is an API that allow you to store proof of consent and manage

## Services

 * createConsent: create a consent
 * getConsent: retrieve a consent
 * listConsents: list consents registered

## Consent definition

| Field               	| Definition |
| ---------------------	| ---------- |
| `id`    	      	| [GUID](http://en.wikipedia.org/wiki/Globally_Unique_Identifier) |
| `ip`			| The IP Address that performed the request. If available save the [X-Forwared-For](https://en.wikipedia.org/wiki/X-Forwarded-For) value |
| `created_at`		| Timestamp of the request in ISO8601 format |
| `subject`		| A list of fields saved form the source page |
| `source_url`		| The page performing the request |
| `legal_docs`		| List of documents subscribed by the user: for each document identified by the _short_name_ the object contains the full text of the document and the version. If not specified, version is set to 1. |


## Consent API

This REST API includes the following endpoints:

* getConsent
```ruby
    GET: /consents/{id}
```
* createConsent
```ruby
    POST: /consents
```
* listConsents
```ruby
    GET: /consents
```

## Examples

### Create a new consent

Register a consent:

```ruby
  POST: /consents
  {
    "subject": [ "email", "given_name", "tax_code" ],
    "source_url": "http://mywebsite.com/privacy",
    "legal_docs": [ 
      { 
        "privacy_policy": "Privacy policy contents...",
        "version": 1,
      },
      {  
        "terms": "Terms of service....",
        "version": 3,
      }
    ]
  }
```
Response:

```json
201 OK
{
  "id": "c1804da9-ab1c-45e2-8g7c-729822cffdaf",
  "ip": "131.145.11.128",
  "created_at": "2019-02-20T09:35:00Z",
  "subject": [ "email", "given_name", "tax_code" ],
  "source_url": "http://mywebsite.com/privacy",
  "legal_docs": [ 
    { 
      "privacy_policy": "Privacy policy contents...",
      "version": 1,
    },
    {  
       "terms": "Terms of service....",
       "version": 3,
    }
  ]
}
```

### Retrieve a consent object
Request:
```ruby
  GET: /consents/c1804da9-ab1c-45e2-8g7c-729822cffdaf
```
Response:

```json
200 OK
{
  "id": "c1804da9-ab1c-45e2-8g7c-729822cffdaf",
  "ip": "131.145.11.128",
  "created_at": "2019-02-20T09:35:00Z",
  "subject": [ "email", "given_name", "tax_code" ],
  "source_url": "http://mywebsite.com/privacy",
  "legal_docs": [ 
    { 
      "privacy_policy": "Privacy policy contents...",
      "version": 1,
    },
    {  
       "terms": "Terms of service....",
       "version": 3,
    }
  ]
}
```

Request:
```ruby
  GET: /consents/1234
```
Response:

```json
404 Not Found 
{
  "title": "Not found",
  "detail": "The specified resource is not found",
  "status": 404,
  "instance": "/consents/1234",
}

```

### Lists consents
Request:
```ruby
  GET: /consents
```
Response:

```json
200 OK
[
  {
    "id": "6414bbd8-2227-45d0-a888-9e43a5f202ae",
    "ip": "131.145.11.128",
    "created_at": "2019-02-20T09:35:00Z",
    "subject": [ "email", "given_name", "tax_code" ],
    "source_url": "http://mywebsite.com/privacy",
    "legal_docs": [ 
      { 
        "privacy_policy": "Privacy policy contents...",
        "version": 1,
      },
      {  
        "terms": "Terms of service....",
        "version": 3,
      }
    ]
  },
  {
    "id": "acecb842-e60c-4ad8-b9d4-e881f75da0e6",
    "ip": "93.41.234.251",
    "created_at": "2019-05-10T14:53:29Z",
    "subject": [ "email", "given_name", "tax_code" ],
    "source_url": "http://mywebsite.com/privacy",
    "legal_docs": [ 
      { 
        "privacy_policy": "Privacy policy contents...",
        "version": 1,
      },
      {  
        "terms": "Terms of service....",
        "version": 3,
      }
    ]
  }
]
```

## Advanced topics

### Pagination

Implent a [cursor-based](https://opensource.zalando.com/restful-api-guidelines/#pagination) pagination for the API.

### Autoversioning of documents

If not specified the version number is automatically generated with the following rules:

1. if the document with that short_name has never been saved, add version value 1
1. if the document has already been save with the same short_name and a different content, then increment the version number

### Dockerize the project

Create a [docker image](https://docs.docker.com/get-started/part2/) of the project and allow the configuration of the API using environment variables.

## Other documentation

* [Zalando ReSTful API Guide](https://opensource.zalando.com/restful-api-guidelines/#introduction)
* [12factor app with docker](https://github.com/docker/labs/tree/master/12factor)
