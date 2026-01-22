## Element

```json
{
  "id": "QuestionnaireResponse.authored",
  "path": "QuestionnaireResponse.authored",
  "short": "Date the answers were gathered",
  "definition": "The date and/or time that this questionnaire response was last modified by the user - e.g. changing answers or revising status.",
  "comment": "May be different from the lastUpdateTime of the resource itself, because that reflects when the data was known to the server, not when the data was captured.\n\nThis element is optional to allow for systems that might not know the value, however it SHOULD be populated if possible.",
  "requirements": "Clinicians need to be able to check the date that the information in the questionnaire was collected, to derive the context of the answers.",
  "alias": ["Date Created", "Date published", "Date Issued", "Date updated"],
  "min": 0,
  "max": "1",
  "type": [
    {
      "code": "dateTime"
    }
  ],
  "mustSupport": false,
  "isModifier": false,
  "isSummary": true,
  "mapping": [
    {
      "identity": "workflow",
      "map": "Event.recorded"
    },
    {
      "identity": "w5",
      "map": "FiveWs.recorded"
    },
    {
      "identity": "rim",
      "map": ".participation[typeCode=AUT].time"
    }
  ]
}
```
