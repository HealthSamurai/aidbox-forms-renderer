## Element

```json
{
  "id": "Questionnaire.item.extension:itemConstraint",
  "path": "Questionnaire.item.extension",
  "sliceName": "itemConstraint",
  "min": 0,
  "max": "*",
  "type": [
    {
      "code": "Extension",
      "profile": ["http://hl7.org/fhir/StructureDefinition/targetConstraint"]
    }
  ],
  "mapping": [
    { "identity": "ihe-sdc", "map": "./*_Field/datatype/string/reg_ex" }
  ]
}
```
