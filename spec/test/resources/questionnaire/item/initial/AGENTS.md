## Element

```json
{
  "id": "Questionnaire.item.initial",
  "path": "Questionnaire.item.initial",
  "short": "Initial value(s) when item is first rendered",
  "definition": "One or more values that should be pre-populated in the answer when initially rendering the questionnaire for user input.",
  "comment": "The user is allowed to change the value and override the default (unless marked as read-only). If the user doesn't change the value, then this initial value will be persisted when the QuestionnaireResponse is initially created.  Note that initial values can influence results.  The data type of initial.answer[x] must agree with the item.type, and only repeating items can have more then one initial value.",
  "requirements": "In some workflows, having defaults saves time.",
  "min": 0,
  "max": "*",
  "type": [
    {
      "code": "BackboneElement"
    }
  ],
  "condition": ["que-8", "que-13", "que-11"],
  "mustSupport": false,
  "isModifier": false,
  "isSummary": false,
  "mapping": [
    {
      "identity": "rim",
      "map": "N/A - MIF rather than RIM level"
    }
  ]
}
```
