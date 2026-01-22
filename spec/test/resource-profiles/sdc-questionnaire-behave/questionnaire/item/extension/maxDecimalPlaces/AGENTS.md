## Element

```json
{
  "id": "Questionnaire.item.extension:maxDecimalPlaces",
  "path": "Questionnaire.item.extension",
  "sliceName": "maxDecimalPlaces",
  "min": 0,
  "max": "1",
  "type": [
    {
      "code": "Extension",
      "profile": [
        "http://hl7.org/fhir/StructureDefinition/maxDecimalPlaces|5.3.0-ballot-tc1"
      ]
    }
  ],
  "mustSupport": true,
  "mapping": [
    {
      "identity": "ihe-sdc",
      "map": "./*_Field/datatype/decimal/fractionDigits"
    }
  ]
}
```
