## Element

```json
{
  "id": "Questionnaire.item.prefix",
  "path": "Questionnaire.item.prefix",
  "short": "E.g. \"1(a)\", \"2.5.3\"",
  "definition": "A short label for a particular group, question or set of display text within the questionnaire used for reference by the individual completing the questionnaire.",
  "comment": "These are generally unique within a questionnaire, though this is not guaranteed. Some questionnaires may have multiple questions with the same label with logic to control which gets exposed.  Typically, these won't be used for \"display\" items, though such use is not prohibited.  Systems SHOULD NOT generate their own prefixes if prefixes are defined for any items within a Questionnaire.",
  "requirements": "Separating the label from the question text allows improved rendering.  Also, instructions will often refer to specific prefixes, so there's a need for the questionnaire design to have control over what labels are used.",
  "alias": ["label"],
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
      "map": "Not supported"
    }
  ]
}
```
