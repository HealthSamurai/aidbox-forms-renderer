## Element

```json
{
  "id": "Questionnaire.item.enableBehavior",
  "path": "Questionnaire.item.enableBehavior",
  "short": "all | any",
  "definition": "Controls how multiple enableWhen values are interpreted -  whether all or any must be true.",
  "comment": "This element must be specified if more than one enableWhen value is provided.",
  "min": 0,
  "max": "1",
  "type": [
    {
      "code": "code"
    }
  ],
  "condition": ["que-12"],
  "mustSupport": false,
  "isModifier": false,
  "isSummary": false,
  "binding": {
    "extension": [
      {
        "url": "http://hl7.org/fhir/StructureDefinition/elementdefinition-bindingName",
        "valueString": "EnableWhenBehavior"
      }
    ],
    "strength": "required",
    "description": "Controls how multiple enableWhen values are interpreted -  whether all or any must be true.",
    "valueSet": "http://hl7.org/fhir/ValueSet/questionnaire-enable-behavior|5.0.0"
  },
  "mapping": [
    {
      "identity": "rim",
      "map": "N/A - MIF rather than RIM level"
    }
  ]
}
```
