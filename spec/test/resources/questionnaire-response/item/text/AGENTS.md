## Element

```json
{
  "id": "QuestionnaireResponse.item.text",
  "path": "QuestionnaireResponse.item.text",
  "short": "Name for group or question text",
  "definition": "Text that is displayed above the contents of the group or as the text of the question being answered.",
  "comment": "The text for an item SHOULD be identical to the text from the corresponding Questionnaire.item. This can't be strictly enforced because it's possible for the Questionnaire to be updated subsequent to the QuestionnaireResponse having been created, however the intention is that the text in the QuestionnaireResponse reflects what the user saw when completing the Questionnaire.",
  "requirements": "Allows the questionnaire response to be read without access to the questionnaire.",
  "min": 0,
  "max": "1",
  "type": [
    {
      "code": "string"
    }
  ],
  "mustSupport": false,
  "isModifier": false,
  "isSummary": false,
  "mapping": [
    {
      "identity": "rim",
      "map": ".text"
    }
  ]
}
```
