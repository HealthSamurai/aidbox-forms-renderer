## Element

```json
{
  "id": "Questionnaire.contact",
  "path": "Questionnaire.contact",
  "short": "Contact details for the publisher",
  "definition": "Contact details to assist a user in finding and communicating with the publisher.",
  "comment": "May be a web site, an email address, a telephone number, etc.\n\nSee guidance around (not) making local changes to elements [here](canonicalresource.html#localization).",
  "min": 0,
  "max": "*",
  "type": [
    {
      "code": "ContactDetail"
    }
  ],
  "mustSupport": false,
  "isModifier": false,
  "isSummary": true,
  "mapping": [
    {
      "identity": "workflow",
      "map": "Definition.contact"
    },
    {
      "identity": "rim",
      "map": ".participation[typeCode=CALLBCK].role"
    }
  ]
}
```
