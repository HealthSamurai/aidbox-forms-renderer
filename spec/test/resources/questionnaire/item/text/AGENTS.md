## Element

```json
{
  "id": "Questionnaire.item.text",
  "extension": [
    {
      "url": "http://hl7.org/fhir/StructureDefinition/elementdefinition-translatable",
      "valueBoolean": true
    },
    {
      "url": "http://hl7.org/fhir/StructureDefinition/elementdefinition-translatable",
      "valueBoolean": true
    }
  ],
  "path": "Questionnaire.item.text",
  "short": "Primary text for the item",
  "definition": "The name of a section, the text of a question or text content for a display item.",
  "comment": "When using this element to represent the name of a section, use group type item and also make sure to limit the text element to a short string suitable for display as a section heading.  Group item instructions should be included as a display type item within the group.",
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
