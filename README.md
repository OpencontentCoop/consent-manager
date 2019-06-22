# Consent Manager

An opensource solution to track and manage user consent compliant with GDPR

## Service Definition

This service is an API that allow you to store and manage proof of consent

### Services

 * createConsent: create a consent [`POST /consents`]
 * getConsent: retrieve a consent [`GET /consents/{id}`]
 * listConsents: retrieve the list consents registered [`GET /consents`]
 
### Consent Definition

| Field               	| Definition |
| ---------------------	| ---------- |
| `id`    	      	    | [GUID](http://en.wikipedia.org/wiki/Globally_Unique_Identifier) |
| `ip`			        | The IP Address that performed the request. If available save the [X-Forwared-For](https://en.wikipedia.org/wiki/X-Forwarded-For) value |
| `created_at`		    | Timestamp of the request in ISO8601 format |
| `subject`		        | A list of fields saved form the source page |
| `source_url`		    | The page performing the request |
| `legal_docs`		    | List of documents subscribed by the user: for each document identified by the _shortname_ the object contains the full text of the document and the version. If not specified, version is set to 1. 

## Install

    docker-compose build
    docker-compose up

## Run tests

    docker-compose -f docker-compose.yml -f docker-compose.test.yml build
    docker-compose -f docker-compose.yml -f docker-compose.test.yml up
    
## Run tests with coverage

    docker-compose -f docker-compose.yml -f docker-compose.test.yml build
    docker-compose -f docker-compose.yml -f docker-compose.test.yml run app npm run test-with-coverage

    
# REST API

## Retrieve ALL Consents [`GET /consents]

This service implements a [cursor-based](https://opensource.zalando.com/restful-api-guidelines/#pagination) pagination for the Consents retrieval.

### Parameters

* limit - limit of results to fetch. If not speficied the default limit is 50, maximum limit is 300
* next - cursor to the next results
* previous - cursor to the previous results

Request :
`GET /consents`

Response:

    200 OK (application/json)
    
    {
        "results": [
            {
                "id": "e7bbfec8-ddfd-4c02-946e-72604ad73c17",
                "ip": "192.254.1.23",
                "created_at": "2019-06-22T13:03:55.669Z",
                "subject": [
                    "email",
                    "given_name",
                    "tax_code"
                ],
                "source_url": "http://mywebsite.com/privacy",
                "legal_docs": [
                    {
                        "version": 1,
                        "privacy_policy": "Privacy policy contents2..."
                    },
                    {
                        "version": 3,
                        "terms": "Terms of service...."
                    }
                ]
            },
            {
                "id": "ace29b4f-fbd3-4ed2-98e3-c90a4741ec6d",
                "ip": "1.1.1.1",
                "created_at": "2019-06-22T13:04:33.173Z",
                "subject": [
                    "email",
                    "given_name",
                    "tax_code"
                ],
                "source_url": "http://mywebsite.com/privacy",
                "legal_docs": [
                    {
                        "version": 1,
                        "privacy_policy": "Privacy policy contents2..."
                    },
                    {
                        "version": 3,
                        "terms": "Terms of service...."
                    }
                ]
            },
            {
                "id": "3eb2ed9b-6ba5-4902-9d4c-d7dd5dd16302",
                "ip": "192.254.2.222",
                "created_at": "2019-06-22T13:04:26.876Z",
                "subject": [
                    "email",
                    "given_name",
                    "tax_code"
                ],
                "source_url": "http://mywebsite.com/privacy",
                "legal_docs": [
                    {
                        "version": 1,
                        "privacy_policy": "Privacy policy contents2..."
                    },
                    {
                        "version": 3,
                        "terms": "Terms of service...."
                    }
                ]
            }
        ],
        "previous": "ImU3YmJmZWM4LWRkZmQtNGMwMi05NDZlLTcyNjA0YWQ3M2MxNyI",
        "hasPrevious": false,
        "next": "IjNlYjJlZDliLTZiYTUtNDkwMi05ZDRjLWQ3ZGQ1ZGQxNjMwMiI",
        "hasNext": false
        
Request:
`GET /consents?limit=1`

Response:

    200 OK (application/json)
    
    {
        "results": [
            {
                "id": "e7bbfec8-ddfd-4c02-946e-72604ad73c17",
                "ip": "192.254.1.23",
                "created_at": "2019-06-22T13:03:55.669Z",
                "subject": [
                    "email",
                    "given_name",
                    "tax_code"
                ],
                "source_url": "http://mywebsite.com/privacy",
                "legal_docs": [
                    {
                        "version": 1,
                        "privacy_policy": "Privacy policy contents2..."
                    },
                    {
                        "version": 3,
                        "terms": "Terms of service...."
                    }
                ]
            }
        ],
        "previous": "ImU3YmJmZWM4LWRkZmQtNGMwMi05NDZlLTcyNjA0YWQ3M2MxNyI",
        "hasPrevious": false,
        "next": "ImU3YmJmZWM4LWRkZmQtNGMwMi05NDZlLTcyNjA0YWQ3M2MxNyI",
        "hasNext": true
    }
    
Request:
`GET /consents?limit=1&next=ImU3YmJmZWM4LWRkZmQtNGMwMi05NDZlLTcyNjA0YWQ3M2MxNyI`

Response:

    200 OK (application/json)

    {
        "results": [
            {
                "id": "ace29b4f-fbd3-4ed2-98e3-c90a4741ec6d",
                "ip": "1.1.1.1",
                "created_at": "2019-06-22T13:04:33.173Z",
                "subject": [
                    "email",
                    "given_name",
                    "tax_code"
                ],
                "source_url": "http://mywebsite.com/privacy",
                "legal_docs": [
                    {
                        "version": 1,
                        "privacy_policy": "Privacy policy contents2..."
                    },
                    {
                        "version": 3,
                        "terms": "Terms of service...."
                    }
                ]
            }
        ],
        "previous": "ImFjZTI5YjRmLWZiZDMtNGVkMi05OGUzLWM5MGE0NzQxZWM2ZCI",
        "hasPrevious": true,
        "next": "ImFjZTI5YjRmLWZiZDMtNGVkMi05OGUzLWM5MGE0NzQxZWM2ZCI",
        "hasNext": true
    }
    
Request:
`GET /consents?previous=2`

Response:
    
    400 Bad Request (application/json)
    
    {
        "title": "Bad Request",
        "detail": "Unexpected end of JSON input",
        "status": 400,
        "instance": "/consents?previous=2"
    }

    


## Retrive ONE Consent [`GET /consents/{id}`]

### Parameters
* id - GUID of Consent to retrieve

Request:
`GET /consents/e7bbfec8-ddfd-4c02-946e-72604ad73c17`

Response:

    200 OK (application/json)
    
    {
        "id": "e7bbfec8-ddfd-4c02-946e-72604ad73c17",
        "ip": "192.254.1.23",
        "created_at": "2019-06-22T13:03:55.669Z",
        "subject": [
            "email",
            "given_name",
            "tax_code"
        ],
        "source_url": "http://mywebsite.com/privacy",
        "legal_docs": [
            {
                "version": 1,
                "privacy_policy": "Privacy policy contents2..."
            },
            {
                "version": 3,
                "terms": "Terms of service...."
            }
        ]
    }
    
Request:
`GET /consents/123`

Response:
    
    404 Not Found (application/json)
    
    {
        "title": "Not Found",
        "detail": "The specified resource is not found",
        "status": 404,
        "instance": "/consents/123"
    }
    

## Consent Creation [`POST /consents]

Request: 
`POST /consents`
        
    {
      "subject": [ "email", "given_name", "tax_code" ],
      "source_url": "http://mywebsite.com/privacy",
      "legal_docs": [ 
        { 
          "privacy_policy": "Privacy policy contents2...",
        },
        {  
          "terms": "Terms of service....",
          "version": 3
        }
      ]
    }  
      
Response:

    201 Created (application/json)
    
    {
        "id": "ace29b4f-fbd3-4ed2-98e3-c90a4741ec6d",
        "ip": "1.1.1.1",
        "created_at": "2019-06-22T13:04:33.173Z",
        "subject": [
            "email",
            "given_name",
            "tax_code"
        ],
        "source_url": "http://mywebsite.com/privacy",
        "legal_docs": [
            {
                "version": 1,
                "privacy_policy": "Privacy policy contents2..."
            },
            {
                "version": 3,
                "terms": "Terms of service...."
            }
        ]
    }
    
Request:
`POST /consents`
    
    {
      "subject": [ "email", "given_name", "tax_code" ],
      "source_url": "http://mywebsite.com/privacy"
    }

Response:

    400 Bad Request (application/json)
    
    {
        "title": "Bad Request",
        "detail": "The body of the request is invalid",
        "status": 400,
        "instance": "/consents"
    }
    
Request:
`POST /consents`
    
    {
        "subject": [ "email", "given_name", "tax_code" ],
        "source_url": "http://mywebsite.com/privacy",
        "legal_docs": [ 
            { 
                "version": 1
            },
            { 
                "terms": "Terms of service....",
                "version": 3
            }
        ]
    }
    
Response:

    400 Bad Request (application/json)
    {
        "title": "Bad Request",
        "detail": "Consent validation failed: legal_docs.2.short_name: Short name is a mandatory field, legal_docs.2.content: Document content is a mandatory field",
        "status": 400,
        "instance": "/consents"
    }

    
Response failed IP Validation
    
    400 Bad Request (application/json)
    
    {
        "title": "Bad Request",
        "detail": "Consent validation failed: ip: 1.1.1.999 is not a valid ip",
        "status": 400,
        "instance": "/consents"
    }

## Rate Limiting policy

A client can perform a maximum of 5 requests per second and 10800 requests per hour. Server-side, the API will respond with `429 Too Many Requests` if these limits are exceeded.

## Autoversioning of Documents
If not specified the version number is automatically generated with the following rules:

* if the document with that short_name has never been saved, version value is set to 1
* if the document has already been save with the same short_name and a different content, then the version number is incremented by 1

