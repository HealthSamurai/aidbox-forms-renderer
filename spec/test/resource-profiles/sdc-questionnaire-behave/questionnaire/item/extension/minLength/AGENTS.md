## Element

```json
{
  "id": "Questionnaire.item.extension:minLength",
  "path": "Questionnaire.item.extension",
  "sliceName": "minLength",
  "min": 0,
  "max": "1",
  "type": [
    {
      "code": "Extension",
      "profile": [
        "http://hl7.org/fhir/StructureDefinition/minLength|5.3.0-ballot-tc1"
      ]
    }
  ],
  "mustSupport": true,
  "mapping": [
    {
      "identity": "ihe-sdc",
      "map": "./*_Field/datatype/string/maximum_characters"
    }
  ]
}
```
