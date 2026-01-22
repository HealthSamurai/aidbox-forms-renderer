## Element

```json
{
  "id": "Questionnaire.item.readOnly",
  "path": "Questionnaire.item.readOnly",
  "short": "Don't allow human editing",
  "definition": "An indication, when true, that the value cannot be changed by a human respondent to the Questionnaire.",
  "comment": "If specified on a 'group', then all items beneath the specified group are read only.  For questions, this only marks the answer associated with the specific item read only.  Descendant questions are not impacted.  The value of readOnly elements can be established by asserting extensions for defaultValues, linkages that support pre-population and/or extensions that support calculation based on other answers.",
  "requirements": "Allows certain information to be phrased (and rendered) as a question and an answer, while keeping users from changing it.  May also be useful for preventing changes to pre-populated portions of a questionnaire, for calculated values, etc.",
  "min": 0,
  "max": "1",
  "type": [
    {
      "code": "boolean"
    }
  ],
  "condition": ["que-9"],
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
