## Element

```json
{
  "id": "QuestionnaireResponse.identifier",
  "path": "QuestionnaireResponse.identifier",
  "short": "Business identifier for this set of answers",
  "definition": "Business identifiers assigned to this questionnaire response by the performer and/or other systems.  These identifiers remain constant as the resource is updated and propagates from server to server.",
  "comment": "Note: This is a business identifier, not a resource identifier (see [discussion](resource.html#identifiers)).",
  "requirements": "Allows identification of the questionnaire response as it is known by various participating systems and in a way that remains consistent across servers.",
  "min": 0,
  "max": "*",
  "type": [
    {
      "code": "Identifier"
    }
  ],
  "mustSupport": false,
  "isModifier": false,
  "isSummary": true,
  "mapping": [
    {
      "identity": "workflow",
      "map": "Event.identifier"
    },
    {
      "identity": "w5",
      "map": "FiveWs.identifier"
    },
    {
      "identity": "rim",
      "map": ".id"
    }
  ]
}
```
