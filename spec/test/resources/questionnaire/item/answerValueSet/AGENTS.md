## Element

```json
{
  "id": "Questionnaire.item.answerValueSet",
  "path": "Questionnaire.item.answerValueSet",
  "short": "ValueSet containing permitted answers",
  "definition": "A reference to a value set containing a list of values representing permitted answers for a question.",
  "comment": "LOINC defines many useful value sets for questionnaire responses. See [LOINC Answer Lists](https://terminology.hl7.org/LOINC.html). The value may come from the ElementDefinition referred to by .definition.",
  "min": 0,
  "max": "1",
  "type": [
    {
      "code": "canonical",
      "targetProfile": ["http://hl7.org/fhir/StructureDefinition/ValueSet"]
    }
  ],
  "condition": ["que-5", "que-4", "que-14"],
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
