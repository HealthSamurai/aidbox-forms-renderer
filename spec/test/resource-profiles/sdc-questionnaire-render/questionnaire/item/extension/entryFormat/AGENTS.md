## Element

```json
{
  "id": "Questionnaire.item.extension:entryFormat",
  "path": "Questionnaire.item.extension",
  "sliceName": "entryFormat",
  "min": 0,
  "max": "1",
  "type": [
    {
      "code": "Extension",
      "profile": [
        "http://hl7.org/fhir/StructureDefinition/entryFormat|5.3.0-ballot-tc1"
      ]
    }
  ],
  "mustSupport": true,
  "mapping": [
    {
      "identity": "ihe-sdc",
      "map": "./*_Field/format | ./*_Field/datatype/string/pattern"
    }
  ]
}
```
