# consent-manager
An opensource solution to track and manage user consent compliant with GDPR

## service definition

This service is an API that allow you to store proof of consent and manage them from a user perspective

## services

 * createConsent: create a consent
 * getConsent: retrieve a consent
 * listConsents: list consents registered

## Consent definition

```json
{
  "id": "J02eZvKYlo2ClwuJ1"
  "created_at": "",
  "source_url": "",
  "preferences": [ "", "" ],
  "legal_docs": [ "", "" ],
}
``` 
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

