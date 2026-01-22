## Element

```json
{
  "id": "Questionnaire.item.extension:minValue",
  "path": "Questionnaire.item.extension",
  "sliceName": "minValue",
  "min": 0,
  "max": "1",
  "type": [
    {
      "code": "Extension",
      "profile": [
        "http://hl7.org/fhir/StructureDefinition/minValue|5.3.0-ballot-tc1"
      ]
    }
  ],
  "mustSupport": true,
  "mapping": [
    {
      "identity": "ihe-sdc",
      "map": "./*_Field/datatype/[integer|decimal]/minimum_value"
    }
  ]
}
```
