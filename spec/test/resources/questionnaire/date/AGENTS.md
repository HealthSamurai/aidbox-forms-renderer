## Element

```json
{
  "id": "Questionnaire.date",
  "path": "Questionnaire.date",
  "short": "Date last changed",
  "definition": "The date  (and optionally time) when the questionnaire was last significantly changed. The date must change when the business version changes and it must change if the status code changes. In addition, it should change when the substantive content of the questionnaire changes.",
  "comment": "The date is often not tracked until the resource is published, but may be present on draft content. Note that this is not the same as the resource last-modified-date, since the resource may be a secondary representation of the questionnaire. Additional specific dates may be added as extensions or be found by consulting Provenances associated with past versions of the resource.\n\nSee guidance around (not) making local changes to elements [here](canonicalresource.html#localization).",
  "alias": ["Revision Date"],
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
      "map": "Definition.date"
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
