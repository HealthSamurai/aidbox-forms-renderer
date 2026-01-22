## Element

```json
{
  "id": "QuestionnaireResponse.item.linkId",
  "path": "QuestionnaireResponse.item.linkId",
  "short": "Pointer to specific item from Questionnaire",
  "definition": "The item from the Questionnaire that corresponds to this item in the QuestionnaireResponse resource.",
  "requirements": "Items can repeat in the answers, so a direct 1..1 correspondence by position might not exist - requiring correspondence by identifier.",
  "min": 1,
  "max": "1",
  "type": [
    {
      "code": "string"
    }
  ],
  "condition": ["qrs-2"],
  "mustSupport": false,
  "isModifier": false,
  "isSummary": false,
  "mapping": [
    {
      "identity": "rim",
      "map": ".outboundRelationship[typeCode=DEFN].target[classCode=OBS, moodCode=DEFN].id"
    }
  ]
}
```
