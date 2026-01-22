## Element

```json
{
  "id": "Questionnaire.item.extension:maxValue",
  "path": "Questionnaire.item.extension",
  "sliceName": "maxValue",
  "min": 0,
  "max": "1",
  "type": [
    {
      "code": "Extension",
      "profile": [
        "http://hl7.org/fhir/StructureDefinition/maxValue|5.3.0-ballot-tc1"
      ]
    }
  ],
  "mustSupport": true,
  "mapping": [
    {
      "identity": "ihe-sdc",
      "map": "./*_Field/datatype/[integer|decimal]/maximum_value"
    }
  ]
}
```
