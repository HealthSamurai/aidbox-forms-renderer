## Element

```json
{
  "id": "Questionnaire.item.maxLength",
  "path": "Questionnaire.item.maxLength",
  "short": "No more than these many characters",
  "definition": "The maximum number of characters that are permitted in the answer to be considered a \"valid\" QuestionnaireResponse.",
  "comment": "For base64binary, reflects the number of characters representing the encoded data, not the number of bytes of the binary data. The value may come from the ElementDefinition referred to by .definition.",
  "min": 0,
  "max": "1",
  "type": [
    {
      "code": "integer"
    }
  ],
  "condition": ["que-10"],
  "mustSupport": false,
  "isModifier": false,
  "isSummary": false,
  "mapping": [
    {
      "identity": "v2",
      "map": "N/A"
    },
    {
      "identity": "rim",
      "map": "N/A - MIF rather than RIM level"
    }
  ]
}
```
