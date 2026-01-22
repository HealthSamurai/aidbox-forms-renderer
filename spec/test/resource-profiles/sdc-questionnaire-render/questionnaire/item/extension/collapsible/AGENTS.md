## Element

```json
{
  "id": "Questionnaire.item.extension:collapsible",
  "path": "Questionnaire.item.extension",
  "sliceName": "collapsible",
  "min": 0,
  "max": "1",
  "type": [
    {
      "code": "Extension",
      "profile": [
        "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-collapsible"
      ]
    }
  ],
  "mapping": [
    {
      "identity": "ihe-sdc",
      "map": "./*_Field/format | ./*_Field/datatype/string/pattern"
    }
  ]
}
```
