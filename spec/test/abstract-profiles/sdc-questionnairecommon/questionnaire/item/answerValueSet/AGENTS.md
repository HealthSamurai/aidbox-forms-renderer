## Element

```json
{
  "id": "Questionnaire.item.answerValueSet",
  "path": "Questionnaire.item.answerValueSet",
  "type": [
    {
      "code": "canonical",
      "targetProfile": [
        "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-valueset"
      ]
    }
  ],
  "mapping": [
    {
      "identity": "ihe-sdc",
      "map": "./list_field | ./lookup_field/endpoint"
    }
  ]
}
```
