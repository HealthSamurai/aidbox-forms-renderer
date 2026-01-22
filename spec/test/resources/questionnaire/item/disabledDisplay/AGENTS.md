## Element

```json
{
  "id": "Questionnaire.item.disabledDisplay",
  "path": "Questionnaire.item.disabledDisplay",
  "short": "hidden | protected",
  "definition": "Indicates if and how items that are disabled (because enableWhen evaluates to 'false') should be displayed.",
  "comment": "If not specified, rendering behavior is up to the client.  This element is only meaningful if enableWhen or an equivalent extension is present",
  "min": 0,
  "max": "1",
  "type": [
    {
      "code": "code"
    }
  ],
  "mustSupport": false,
  "isModifier": false,
  "isSummary": false,
  "binding": {
    "extension": [
      {
        "url": "http://hl7.org/fhir/StructureDefinition/elementdefinition-bindingName",
        "valueString": "DisabledDisplay"
      }
    ],
    "strength": "required",
    "description": "Defines how disabled elements should be rendered",
    "valueSet": "http://hl7.org/fhir/ValueSet/questionnaire-disabled-display|5.0.0"
  },
  "mapping": [
    {
      "identity": "rim",
      "map": "N/A - MIF rather than RIM level"
    }
  ]
}
```
